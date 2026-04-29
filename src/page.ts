export const KEY_PAGE_HTML = String.raw`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KeyCut</title>
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2315191f'/%3E%3Cpath d='M19 18h8v13l12-13h10L36 31.2 50 46H39.4L27 32.6V46h-8z' fill='%23f7efe3'/%3E%3C/svg%3E"
    />
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f7f6;
        --ink: #15191f;
        --muted: #6f7681;
        --panel: #ffffff;
        --line: #d9e0df;
        --soft: #e8eeee;
        --teal: #087568;
        --teal-dark: #07564d;
        --gold: #ad7424;
        --red: #b42318;
        --blue: #315d90;
        --shadow: 0 22px 70px rgba(35, 31, 25, 0.12);
      }

      * {
        box-sizing: border-box;
      }

      body {
        position: relative;
        margin: 0;
        min-height: 100vh;
        overflow-x: hidden;
        background:
          linear-gradient(135deg, rgba(8, 117, 104, 0.11), transparent 34%),
          linear-gradient(315deg, rgba(49, 93, 144, 0.12), transparent 38%),
          var(--bg);
        color: var(--ink);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
      }

      body::before {
        position: fixed;
        inset: 0;
        z-index: 0;
        content: "";
        background:
          linear-gradient(90deg, rgba(8, 117, 104, 0.06) 1px, transparent 1px),
          linear-gradient(180deg, rgba(49, 93, 144, 0.05) 1px, transparent 1px);
        background-size: 46px 46px;
        mask-image: linear-gradient(120deg, rgba(0, 0, 0, 0.72), transparent 68%);
        animation: drift-grid 18s linear infinite;
        pointer-events: none;
      }

      button,
      input,
      textarea {
        font: inherit;
      }

      button {
        min-height: 42px;
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 0 15px;
        cursor: pointer;
        color: #fff;
        background: var(--teal);
        font-weight: 750;
        white-space: nowrap;
        transition:
          transform 160ms ease,
          background 160ms ease,
          box-shadow 160ms ease;
      }

      button:hover {
        background: var(--teal-dark);
        box-shadow: 0 10px 24px rgba(8, 117, 104, 0.18);
        transform: translateY(-1px);
      }

      button.secondary {
        color: var(--ink);
        background: #eef3f2;
        border-color: var(--line);
      }

      button.secondary:hover {
        background: #e2eae8;
      }

      button.ghost {
        color: var(--blue);
        background: transparent;
        border-color: transparent;
      }

      button.ghost:hover {
        background: rgba(49, 93, 144, 0.08);
        box-shadow: none;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.52;
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 8px;
        color: var(--ink);
        background: #fbfdfc;
        outline: none;
        transition:
          border-color 160ms ease,
          box-shadow 160ms ease,
          background 160ms ease;
      }

      input:focus,
      textarea:focus {
        border-color: var(--teal);
        box-shadow: 0 0 0 4px rgba(8, 117, 104, 0.13);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .mark {
        position: relative;
        overflow: hidden;
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        border-radius: 10px;
        background: var(--ink);
        color: #eaf3ef;
        font-size: 22px;
        font-weight: 900;
      }

      .mark::after {
        position: absolute;
        inset: -35%;
        content: "";
        background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.32), transparent 70%);
        transform: translateX(-90%) rotate(10deg);
        animation: shine 4.8s ease-in-out infinite;
      }

      .brand-name {
        display: grid;
        gap: 2px;
      }

      .brand-name strong {
        font-size: 25px;
        line-height: 1;
        letter-spacing: 0;
      }

      .brand-name span {
        color: var(--muted);
        font-size: 13px;
      }

      .gate {
        position: relative;
        z-index: 1;
        display: grid;
        min-height: 100vh;
        place-items: center;
        padding: 28px;
      }

      .gate-card {
        position: relative;
        overflow: hidden;
        width: min(460px, 100%);
        padding: 28px;
        border: 1px solid rgba(217, 224, 223, 0.88);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
        animation: rise-in 520ms cubic-bezier(0.2, 0.72, 0.2, 1) both;
      }

      .gate-card::before {
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        content: "";
        background: linear-gradient(90deg, var(--teal), var(--blue), var(--gold), var(--teal));
        background-size: 220% 100%;
        animation: flow-line 5.6s linear infinite;
      }

      .gate-card h1 {
        margin: 28px 0 10px;
        font-size: clamp(30px, 5vw, 42px);
        letter-spacing: 0;
        line-height: 1.08;
      }

      .gate-card p {
        margin: 0 0 24px;
        color: var(--muted);
        line-height: 1.6;
      }

      .key-visual {
        display: grid;
        grid-template-columns: auto 1fr auto 1fr auto;
        gap: 10px;
        align-items: center;
        margin: 20px 0 22px;
        color: var(--muted);
        font-size: 13px;
      }

      .key-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--gold);
        box-shadow: 0 0 0 6px rgba(173, 116, 36, 0.13);
        animation: pulse-dot 2.4s ease-in-out infinite;
      }

      .key-line {
        position: relative;
        height: 1px;
        overflow: hidden;
        background: var(--line);
      }

      .key-line::after {
        position: absolute;
        inset: 0;
        content: "";
        background: linear-gradient(90deg, transparent, var(--teal), transparent);
        animation: scan-line 2.8s ease-in-out infinite;
      }

      .key-form {
        display: grid;
        gap: 12px;
      }

      .key-form label,
      .editor-label {
        display: grid;
        gap: 7px;
        color: var(--muted);
        font-size: 13px;
      }

      .key-form input {
        min-height: 48px;
        padding: 0 13px;
        font-size: 18px;
      }

      .app {
        position: relative;
        z-index: 1;
        display: none;
        width: min(1060px, calc(100vw - 32px));
        min-height: 100vh;
        margin: 0 auto;
        padding: 24px 0 34px;
      }

      .app.active {
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 18px;
        animation: rise-in 420ms cubic-bezier(0.2, 0.72, 0.2, 1) both;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
      }

      .top-left {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
      }

      .top-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .back-button {
        display: inline-flex;
        min-height: 40px;
        align-items: center;
        gap: 7px;
        color: var(--ink);
        background: rgba(255, 255, 255, 0.76);
        border-color: var(--line);
      }

      .back-button:hover {
        color: var(--teal-dark);
        background: #fff;
      }

      .key-chip,
      .dirty-chip {
        display: inline-flex;
        min-height: 32px;
        align-items: center;
        border-radius: 999px;
        padding: 0 11px;
        font-size: 13px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.78);
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dirty-chip {
        display: none;
        color: #7c4f0b;
        border-color: rgba(185, 134, 43, 0.38);
        background: rgba(255, 243, 214, 0.78);
      }

      .dirty-chip.active {
        display: inline-flex;
      }

      .workspace {
        display: grid;
        min-height: 0;
      }

      .editor-panel {
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-rows: auto 1fr auto;
        min-height: calc(100vh - 142px);
        padding: 18px;
        border: 1px solid rgba(217, 224, 223, 0.92);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: var(--shadow);
      }

      .editor-panel::before {
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        content: "";
        background: linear-gradient(90deg, var(--blue), var(--teal), var(--gold));
      }

      .editor-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .editor-head h2 {
        margin: 0;
        font-size: 18px;
        letter-spacing: 0;
      }

      .status {
        color: var(--muted);
        font-size: 14px;
        text-align: right;
      }

      .status.error {
        color: var(--red);
      }

      textarea {
        min-height: 440px;
        resize: vertical;
        padding: 16px;
        line-height: 1.62;
        font-size: 16px;
      }

      textarea:focus {
        background: #ffffff;
      }

      .editor-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
      }

      .count {
        color: var(--muted);
        font-size: 13px;
      }

      .editor-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .hidden {
        display: none;
      }

      @keyframes rise-in {
        from {
          opacity: 0;
          transform: translateY(14px) scale(0.985);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes drift-grid {
        from {
          background-position: 0 0;
        }

        to {
          background-position: 46px 46px;
        }
      }

      @keyframes flow-line {
        from {
          background-position: 0% 50%;
        }

        to {
          background-position: 220% 50%;
        }
      }

      @keyframes shine {
        0%,
        55% {
          transform: translateX(-90%) rotate(10deg);
        }

        75%,
        100% {
          transform: translateX(90%) rotate(10deg);
        }
      }

      @keyframes pulse-dot {
        0%,
        100% {
          transform: scale(1);
        }

        50% {
          transform: scale(1.25);
        }
      }

      @keyframes scan-line {
        from {
          transform: translateX(-100%);
        }

        to {
          transform: translateX(100%);
        }
      }

      @media (max-width: 720px) {
        .gate {
          padding: 16px;
        }

        .gate-card {
          padding: 22px;
        }

        .topbar,
        .editor-head,
        .editor-foot {
          align-items: flex-start;
          flex-direction: column;
        }

        .top-left {
          width: 100%;
          align-items: flex-start;
          flex-direction: column;
        }

        .top-actions,
        .editor-actions {
          width: 100%;
        }

        .top-actions button,
        .editor-actions button {
          flex: 1;
        }

        .status {
          text-align: left;
        }

        .editor-panel {
          min-height: calc(100vh - 184px);
        }

        textarea {
          min-height: 360px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
  </head>
  <body>
    <section id="gate" class="gate">
      <div class="gate-card">
        <div class="brand">
          <div class="mark">K</div>
          <div class="brand-name">
            <strong>KeyCut</strong>
            <span>netcut</span>
          </div>
        </div>
        <h1>用钥匙取回文字</h1>
        <p>给一段文字起个只有你知道的暗号。下次输入同一把钥匙，就能继续编辑它。</p>
        <div class="key-visual" aria-hidden="true">
          <span>写入</span>
          <span class="key-line"></span>
          <span class="key-dot"></span>
          <span class="key-line"></span>
          <span>取回</span>
        </div>
        <form id="keyForm" class="key-form">
          <label>
            文字钥匙
            <input id="keyInput" autocomplete="off" autofocus />
          </label>
          <button id="openButton" type="submit">打开</button>
          <div id="gateStatus" class="status"></div>
        </form>
      </div>
    </section>

    <main id="app" class="app">
      <header class="topbar">
        <div class="top-left">
          <button id="backButton" class="back-button" type="button">← 返回</button>
          <div class="brand">
            <div class="mark">K</div>
            <div class="brand-name">
              <strong>KeyCut</strong>
              <span id="keyLabel">未打开</span>
            </div>
          </div>
        </div>
        <div class="top-actions">
          <span id="keyChip" class="key-chip"></span>
          <button id="switchButton" class="ghost" type="button">切换钥匙</button>
        </div>
      </header>

      <section class="workspace">
        <div class="editor-panel">
          <div class="editor-head">
            <div>
              <h2>文字内容</h2>
              <span id="dirtyChip" class="dirty-chip">未保存</span>
            </div>
            <div id="appStatus" class="status">就绪</div>
          </div>

          <label class="editor-label">
            <span class="hidden">内容</span>
            <textarea id="content" placeholder="输入或编辑这个钥匙下保存的文字"></textarea>
          </label>

          <div class="editor-foot">
            <div id="count" class="count">0 字符</div>
            <div class="editor-actions">
              <button id="downloadButton" class="secondary" type="button">下载</button>
              <button id="saveButton" type="button">保存</button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <script>
      const gate = document.querySelector('#gate');
      const app = document.querySelector('#app');
      const keyForm = document.querySelector('#keyForm');
      const keyInput = document.querySelector('#keyInput');
      const openButton = document.querySelector('#openButton');
      const gateStatus = document.querySelector('#gateStatus');
      const keyLabel = document.querySelector('#keyLabel');
      const keyChip = document.querySelector('#keyChip');
      const backButton = document.querySelector('#backButton');
      const switchButton = document.querySelector('#switchButton');
      const content = document.querySelector('#content');
      const dirtyChip = document.querySelector('#dirtyChip');
      const appStatus = document.querySelector('#appStatus');
      const count = document.querySelector('#count');
      const downloadButton = document.querySelector('#downloadButton');
      const saveButton = document.querySelector('#saveButton');

      let active = null;
      let savedText = '';
      let dirty = false;

      keyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        await openKey();
      });

      content.addEventListener('input', () => {
        updateCount();
        setDirty(content.value !== savedText);
      });

      saveButton.addEventListener('click', saveCurrent);
      downloadButton.addEventListener('click', downloadCurrent);
      backButton.addEventListener('click', returnToGate);
      switchButton.addEventListener('click', returnToGate);

      function returnToGate() {
        if (dirty && !confirm('当前内容未保存，确定切换钥匙吗？')) {
          return;
        }
        active = null;
        savedText = '';
        setDirty(false);
        content.value = '';
        gate.classList.remove('hidden');
        app.classList.remove('active');
        setGateStatus('');
        keyInput.focus();
      }

      window.addEventListener('beforeunload', (event) => {
        if (!dirty) return;
        event.preventDefault();
        event.returnValue = '';
      });

      async function openKey() {
        const secret = keyInput.value.trim();
        if (!secret) {
          setGateStatus('请输入文字钥匙', true);
          return;
        }

        openButton.disabled = true;
        setGateStatus('打开中');

        try {
          const material = await deriveMaterial(secret);
          active = { secret, id: material.id, key: material.key };

          const response = await fetch('/api/notes/' + encodeURIComponent(active.id));
          if (response.status === 404) {
            savedText = '';
            showEditor('');
            setAppStatus('新钥匙');
            return;
          }

          const result = await response.json();
          if (!response.ok || !result.success) {
            throw new Error(result.message || '读取失败');
          }

          const text = await decryptText(result.content, active.key);
          savedText = text;
          showEditor(text);
          setAppStatus('已读取');
        } catch (error) {
          active = null;
          setGateStatus(error.message || '打开失败', true);
        } finally {
          openButton.disabled = false;
        }
      }

      async function saveCurrent() {
        if (!active) return;

        saveButton.disabled = true;
        setAppStatus('保存中');

        try {
          const encrypted = await encryptText(content.value, active.key);
          const response = await fetch('/api/notes/' + encodeURIComponent(active.id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: encrypted, ttl_seconds: null }),
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || '保存失败');
          }

          savedText = content.value;
          setDirty(false);
          setAppStatus('已保存 ' + new Date().toLocaleTimeString());
        } catch (error) {
          setAppStatus(error.message || '保存失败', true);
        } finally {
          saveButton.disabled = false;
        }
      }

      function showEditor(text) {
        gate.classList.add('hidden');
        app.classList.add('active');
        content.value = text;
        keyLabel.textContent = '已打开';
        keyChip.textContent = active.secret;
        setDirty(false);
        updateCount();
        content.focus();
      }

      function downloadCurrent() {
        const blob = new Blob([content.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'keycut-' + (active ? active.id.slice(0, 8) : 'text') + '.txt';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setAppStatus('已下载');
      }

      function setDirty(value) {
        dirty = value;
        dirtyChip.classList.toggle('active', dirty);
      }

      function updateCount() {
        count.textContent = content.value.length + ' 字符';
      }

      function setGateStatus(message, isError) {
        gateStatus.textContent = message;
        gateStatus.classList.toggle('error', Boolean(isError));
      }

      function setAppStatus(message, isError) {
        appStatus.textContent = message;
        appStatus.classList.toggle('error', Boolean(isError));
      }

      async function deriveMaterial(secret) {
        const idBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('keycut:id:v1:' + secret));
        const id = toBase64Url(idBytes);
        const passwordKey = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(secret),
          'PBKDF2',
          false,
          ['deriveKey'],
        );
        const key = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            hash: 'SHA-256',
            iterations: 180000,
            salt: new TextEncoder().encode('keycut:aes:v1:' + id),
          },
          passwordKey,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt'],
        );

        return { id, key };
      }

      async function encryptText(text, key) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const data = new TextEncoder().encode(text);
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
        return JSON.stringify({
          v: 2,
          alg: 'AES-GCM',
          iv: toBase64Url(iv),
          data: toBase64Url(encrypted),
        });
      }

      async function decryptText(payload, key) {
        const parsed = JSON.parse(payload);
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: fromBase64Url(parsed.iv) },
          key,
          fromBase64Url(parsed.data),
        );
        return new TextDecoder().decode(decrypted);
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
    </script>
  </body>
</html>`;
