import { Hono } from 'hono';
import { cors } from 'hono/cors';

type CreateNoteBody = {
  id?: unknown;
  content?: unknown;
  ttl_seconds?: unknown;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);

app.get('/', (c) => c.html(INDEX_HTML));

app.get('/api/health', (c) => c.json({ success: true }));

app.post('/api/notes', async (c) => {
  let body: CreateNoteBody;

  try {
    body = await c.req.json<CreateNoteBody>();
  } catch {
    return c.json({ success: false, message: '请求体必须是 JSON' }, 400);
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const content = typeof body.content === 'string' ? body.content : '';
  const ttlSeconds = normalizeTtl(body.ttl_seconds);

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 必须是 4-64 位字母、数字、下划线或短横线' }, 400);
  }

  if (!content) {
    return c.json({ success: false, message: 'content 不能为空' }, 400);
  }

  if (ttlSeconds === false) {
    return c.json({ success: false, message: 'ttl_seconds 必须是正整数' }, 400);
  }

  const expiresAt =
    ttlSeconds === null ? null : toSqliteTimestamp(new Date(Date.now() + ttlSeconds * 1000));

  try {
    await c.env.DB.prepare('INSERT INTO notes (id, content, expires_at) VALUES (?, ?, ?)')
      .bind(id, content, expiresAt)
      .run();
  } catch (error) {
    if (isD1ConstraintError(error)) {
      return c.json({ success: false, message: 'id 已存在，请换一个短链接' }, 409);
    }

    console.error('Failed to create note', error);
    return c.json({ success: false, message: '保存失败' }, 500);
  }

  return c.json({ success: true, id, expires_at: expiresAt });
});

app.get('/api/notes/:id', async (c) => {
  const id = c.req.param('id');

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 格式不正确' }, 400);
  }

  const note = await c.env.DB.prepare(
    `SELECT content
     FROM notes
     WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
  )
    .bind(id)
    .first<{ content: string }>();

  if (!note) {
    return c.json({ success: false, message: '文本不存在或已过期' }, 404);
  }

  return c.json({ success: true, content: note.content });
});

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    await env.DB.prepare('DELETE FROM notes WHERE expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP').run();
  },
};

function normalizeTtl(value: unknown): number | null | false {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return false;
  }

  return value;
}

function isValidNoteId(id: string): boolean {
  return /^[A-Za-z0-9_-]{4,64}$/.test(id);
}

function toSqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function isD1ConstraintError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('unique');
}

const INDEX_HTML = String.raw`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>netcut</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f7f7f4;
        --panel: #ffffff;
        --text: #181a1f;
        --muted: #68707d;
        --line: #dfe3e8;
        --accent: #0f7b6c;
        --accent-strong: #09594f;
        --danger: #b42318;
        --shadow: 0 18px 50px rgba(24, 26, 31, 0.08);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
      }

      button,
      input,
      select,
      textarea {
        font: inherit;
      }

      .shell {
        width: min(1100px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 24px 0 40px;
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }

      .mark {
        display: grid;
        width: 34px;
        height: 34px;
        place-items: center;
        border-radius: 8px;
        background: #161a1d;
        color: #fff;
        font-weight: 800;
      }

      h1 {
        margin: 0;
        font-size: 22px;
        line-height: 1.1;
        letter-spacing: 0;
      }

      .status {
        min-height: 36px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--muted);
        font-size: 14px;
        text-align: right;
      }

      .status.error {
        color: var(--danger);
      }

      .workspace {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
        gap: 18px;
        align-items: start;
      }

      .panel {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: var(--shadow);
      }

      .editor {
        padding: 16px;
      }

      textarea {
        display: block;
        width: 100%;
        min-height: 420px;
        resize: vertical;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 14px;
        color: var(--text);
        background: #fbfcfc;
        line-height: 1.55;
        outline: none;
      }

      textarea:focus,
      input:focus,
      select:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(15, 123, 108, 0.14);
      }

      .controls {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 10px;
        margin-top: 12px;
        align-items: end;
      }

      label {
        display: grid;
        gap: 6px;
        color: var(--muted);
        font-size: 13px;
      }

      input,
      select {
        width: 100%;
        min-height: 42px;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 0 11px;
        color: var(--text);
        background: #fff;
        outline: none;
      }

      button {
        min-height: 42px;
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 0 14px;
        cursor: pointer;
        color: #fff;
        background: var(--accent);
        font-weight: 700;
        white-space: nowrap;
      }

      button:hover {
        background: var(--accent-strong);
      }

      button.secondary {
        color: var(--text);
        background: #eef2f1;
        border-color: #d6dcdb;
      }

      button.secondary:hover {
        background: #e3e9e8;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .side {
        display: grid;
        gap: 14px;
      }

      .box {
        padding: 14px;
      }

      .box h2 {
        margin: 0 0 12px;
        font-size: 16px;
        letter-spacing: 0;
      }

      .share-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
      }

      .share-row input {
        min-width: 0;
      }

      .loaded {
        min-height: 180px;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 12px;
        background: #fbfcfc;
        line-height: 1.55;
      }

      .meta {
        margin-top: 8px;
        color: var(--muted);
        font-size: 13px;
      }

      @media (max-width: 820px) {
        .workspace {
          grid-template-columns: 1fr;
        }

        header {
          align-items: flex-start;
          flex-direction: column;
        }

        .status {
          justify-content: flex-start;
          text-align: left;
        }

        .controls {
          grid-template-columns: 1fr;
        }

        textarea {
          min-height: 300px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header>
        <div class="brand">
          <div class="mark">N</div>
          <h1>netcut</h1>
        </div>
        <div id="status" class="status">就绪</div>
      </header>

      <section class="workspace">
        <form id="createForm" class="panel editor">
          <textarea id="content" placeholder="输入要分享的内容"></textarea>
          <div class="controls">
            <label>
              短链接
              <input id="noteId" maxlength="64" autocomplete="off" />
            </label>
            <label>
              保留时间
              <select id="ttl">
                <option value="3600">1 小时</option>
                <option value="86400" selected>1 天</option>
                <option value="604800">7 天</option>
                <option value="">永久</option>
              </select>
            </label>
            <button id="saveButton" type="submit">生成链接</button>
          </div>
        </form>

        <aside class="side">
          <section class="panel box">
            <h2>分享链接</h2>
            <div class="share-row">
              <input id="shareLink" readonly placeholder="生成后显示" />
              <button id="copyButton" class="secondary" type="button">复制</button>
            </div>
            <div id="shareMeta" class="meta"></div>
          </section>

          <section class="panel box">
            <h2>读取内容</h2>
            <div id="loadedContent" class="loaded">打开分享链接后显示</div>
          </section>
        </aside>
      </section>
    </main>

    <script>
      const form = document.querySelector('#createForm');
      const content = document.querySelector('#content');
      const noteId = document.querySelector('#noteId');
      const ttl = document.querySelector('#ttl');
      const saveButton = document.querySelector('#saveButton');
      const shareLink = document.querySelector('#shareLink');
      const copyButton = document.querySelector('#copyButton');
      const shareMeta = document.querySelector('#shareMeta');
      const loadedContent = document.querySelector('#loadedContent');
      const status = document.querySelector('#status');

      noteId.value = createId();

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setStatus('加密并保存中');
        saveButton.disabled = true;

        try {
          const text = content.value;
          const id = noteId.value.trim() || createId();

          if (!text.trim()) {
            throw new Error('内容不能为空');
          }

          if (!/^[A-Za-z0-9_-]{4,64}$/.test(id)) {
            throw new Error('短链接需要 4-64 位字母、数字、下划线或短横线');
          }

          const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
            'encrypt',
            'decrypt',
          ]);
          const encrypted = await encryptText(text, key);
          const rawKey = await crypto.subtle.exportKey('raw', key);
          const ttlSeconds = ttl.value ? Number(ttl.value) : null;

          const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id,
              content: encrypted,
              ttl_seconds: ttlSeconds,
            }),
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || '保存失败');
          }

          const url = location.origin + '/#n/' + id + '/' + toBase64Url(rawKey);
          shareLink.value = url;
          shareMeta.textContent = result.expires_at ? '过期时间 ' + result.expires_at + ' UTC' : '永久保存';
          history.replaceState(null, '', '#n/' + id + '/' + toBase64Url(rawKey));
          setStatus('已生成');
        } catch (error) {
          setStatus(error.message || '操作失败', true);
        } finally {
          saveButton.disabled = false;
        }
      });

      copyButton.addEventListener('click', async () => {
        if (!shareLink.value) return;
        await navigator.clipboard.writeText(shareLink.value);
        setStatus('已复制');
      });

      window.addEventListener('hashchange', loadFromHash);
      loadFromHash();

      async function loadFromHash() {
        const match = location.hash.match(/^#n\/([A-Za-z0-9_-]{4,64})\/([A-Za-z0-9_-]+)$/);
        if (!match) return;

        const id = match[1];
        const keyText = match[2];
        setStatus('读取中');

        try {
          const response = await fetch('/api/notes/' + encodeURIComponent(id));
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || '读取失败');
          }

          const key = await crypto.subtle.importKey(
            'raw',
            fromBase64Url(keyText),
            { name: 'AES-GCM' },
            false,
            ['decrypt'],
          );
          const text = await decryptText(result.content, key);
          loadedContent.textContent = text;
          shareLink.value = location.href;
          noteId.value = id;
          setStatus('已读取');
        } catch (error) {
          loadedContent.textContent = '';
          setStatus(error.message || '读取失败', true);
        }
      }

      async function encryptText(text, key) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const data = new TextEncoder().encode(text);
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
        return JSON.stringify({
          v: 1,
          alg: 'AES-GCM',
          iv: toBase64Url(iv),
          data: toBase64Url(encrypted),
        });
      }

      async function decryptText(payload, key) {
        const parsed = JSON.parse(payload);
        const iv = fromBase64Url(parsed.iv);
        const data = fromBase64Url(parsed.data);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
        return new TextDecoder().decode(decrypted);
      }

      function createId() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const bytes = crypto.getRandomValues(new Uint8Array(8));
        return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
      }

      function toBase64Url(value) {
        const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
        let binary = '';
        bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
      }

      function fromBase64Url(value) {
        const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
      }

      function setStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle('error', Boolean(isError));
      }
    </script>
  </body>
</html>`;
