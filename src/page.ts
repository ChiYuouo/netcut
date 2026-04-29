export const KEY_PAGE_HTML = String.raw`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>netcut</title>
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2315191f'/%3E%3Cpath d='M16 47V17h8.3l15.4 17.2V17H48v30h-8.2L24.4 29.8V47z' fill='%23eaf3ef'/%3E%3C/svg%3E"
    />
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f3ef;
        --ink: #15191f;
        --muted: #707782;
        --panel: #fffdf9;
        --line: #e2ded8;
        --soft: #efece5;
        --teal: #0b796f;
        --teal-dark: #075c55;
        --gold: #b9792a;
        --red: #b42318;
        --blue: #365f8f;
        --shadow: 0 24px 80px rgba(36, 30, 24, 0.12);
        --glow: rgba(10, 125, 112, 0.18);
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
          radial-gradient(circle at 12% 16%, rgba(11, 121, 111, 0.16), transparent 30%),
          radial-gradient(circle at 86% 12%, rgba(185, 121, 42, 0.13), transparent 32%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(246, 243, 239, 0.92)),
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
          linear-gradient(90deg, rgba(11, 121, 111, 0.04) 1px, transparent 1px),
          linear-gradient(180deg, rgba(185, 121, 42, 0.035) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: linear-gradient(120deg, rgba(0, 0, 0, 0.62), transparent 72%);
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
        box-shadow: 0 0 0 4px rgba(10, 125, 112, 0.13);
      }

      .page-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        position: relative;
        display: grid;
        width: 42px;
        height: 42px;
        flex: 0 0 auto;
        place-items: center;
        border-radius: 13px;
        color: #ecf7f3;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.09), transparent),
          #15191f;
        box-shadow: 0 14px 32px rgba(21, 25, 31, 0.18);
        font-weight: 900;
      }

      .logo::before {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        content: "";
        background: var(--teal);
        transform: translate(9px, -9px);
        box-shadow: 0 0 0 5px rgba(11, 121, 111, 0.18);
      }

      .title-copy {
        display: grid;
        gap: 2px;
      }

      .title-copy strong {
        font-size: 24px;
        line-height: 1;
        letter-spacing: 0;
      }

      .title-copy span {
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
        width: min(520px, 100%);
        padding: 34px;
        border: 1px solid rgba(223, 228, 226, 0.9);
        border-radius: 18px;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 253, 249, 0.78)),
          rgba(255, 255, 255, 0.82);
        box-shadow: var(--shadow);
        backdrop-filter: blur(22px);
        animation: rise-in 520ms cubic-bezier(0.2, 0.72, 0.2, 1) both;
      }

      .gate-card h1 {
        margin: 22px 0 10px;
        font-size: clamp(32px, 5vw, 48px);
        letter-spacing: 0;
        line-height: 1.08;
      }

      .gate-card p {
        width: min(390px, 100%);
        margin: 0 0 26px;
        color: var(--muted);
        line-height: 1.6;
      }

      .key-form {
        display: grid;
        gap: 14px;
      }

      .key-form label,
      .editor-label {
        display: grid;
        gap: 7px;
        color: var(--muted);
        font-size: 13px;
      }

      .key-form input {
        min-height: 54px;
        padding: 0 15px;
        font-size: 18px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.78);
      }

      .gate-card::after {
        position: absolute;
        right: -56px;
        bottom: -72px;
        width: 210px;
        height: 210px;
        border-radius: 999px;
        content: "";
        background:
          radial-gradient(circle, rgba(10, 125, 112, 0.16), transparent 58%),
          conic-gradient(from 90deg, transparent, rgba(183, 122, 37, 0.16), transparent);
        filter: blur(1px);
        animation: slow-spin 18s linear infinite;
        pointer-events: none;
      }

      .gate-card .page-title {
        position: relative;
        z-index: 1;
      }

      .app {
        position: relative;
        z-index: 1;
        display: none;
        width: min(1180px, calc(100vw - 32px));
        min-height: 100vh;
        margin: 0 auto;
        padding: 22px 0 34px;
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
        margin-bottom: 4px;
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
        gap: 10px;
        min-width: 0;
      }

      .back-button {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        gap: 7px;
        color: var(--ink);
        background: rgba(255, 255, 255, 0.76);
        border-color: var(--line);
        box-shadow: 0 10px 30px rgba(21, 25, 31, 0.06);
      }

      .back-button:hover {
        color: var(--teal-dark);
        background: #fff;
      }

      .key-chip {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        gap: 8px;
        border-radius: 999px;
        padding: 0 13px;
        font-size: 13px;
        color: var(--ink);
        border: 1px solid rgba(226, 222, 216, 0.88);
        background: rgba(255, 253, 249, 0.84);
        box-shadow: 0 10px 30px rgba(36, 30, 24, 0.07);
        max-width: min(42vw, 520px);
        min-width: 0;
      }

      .key-chip-text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .key-chip::before {
        width: 7px;
        height: 7px;
        flex: 0 0 auto;
        border-radius: 999px;
        content: "";
        background: var(--teal);
        box-shadow: 0 0 0 4px rgba(11, 121, 111, 0.13);
      }

      .state-chip {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        border-radius: 999px;
        padding: 0 13px;
        color: var(--muted);
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.42);
        font-size: 13px;
        white-space: nowrap;
      }

      .state-chip.unsaved {
        color: #79500f;
        border-color: rgba(185, 121, 42, 0.28);
        background: rgba(255, 246, 229, 0.78);
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
        padding: 24px;
        border: 1px solid rgba(223, 228, 226, 0.92);
        border-radius: 22px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 253, 249, 0.84)),
          rgba(255, 255, 255, 0.86);
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
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

      .status:empty {
        display: none;
      }

      textarea {
        min-height: 440px;
        resize: vertical;
        padding: 18px;
        line-height: 1.62;
        font-size: 16px;
        border-radius: 16px;
        background:
          linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)),
          linear-gradient(135deg, rgba(10, 125, 112, 0.12), rgba(54, 95, 143, 0.08));
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

      @keyframes slow-spin {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }

      @keyframes nudge-in {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
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

        .key-chip {
          max-width: 100%;
          flex: 1;
        }

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
        <div class="page-title">
          <span class="logo">n</span>
          <div class="title-copy">
            <strong>netcut</strong>
            <span>钥匙剪贴板</span>
          </div>
        </div>
        <h1>打开文字</h1>
        <p>输入钥匙，继续编辑对应内容。</p>
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
          <div class="page-title">
            <span class="logo">n</span>
            <div class="title-copy">
              <strong>netcut</strong>
              <span id="keyLabel">已打开</span>
            </div>
          </div>
        </div>
        <div class="top-actions">
          <span id="keyChip" class="key-chip"><span id="keyChipText" class="key-chip-text"></span></span>
          <span id="stateChip" class="state-chip">已读取</span>
        </div>
      </header>

      <section class="workspace">
        <div class="editor-panel">
          <div class="editor-head">
            <div>
              <h2>文字内容</h2>
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
      const keyChipText = document.querySelector('#keyChipText');
      const stateChip = document.querySelector('#stateChip');
      const backButton = document.querySelector('#backButton');
      const content = document.querySelector('#content');
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

      function returnToGate() {
        if (dirty) {
          setAppStatus('请先保存当前修改', true);
          content.focus();
          return;
        }
        goToGate();
      }

      function goToGate() {
        active = null;
        savedText = '';
        setDirty(false);
        content.value = '';
        gate.classList.remove('hidden');
        app.classList.remove('active');
        setGateStatus('');
        keyInput.focus();
      }

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
        keyChipText.textContent = active.secret;
        keyChipText.title = active.secret;
        setDirty(false);
        updateCount();
        content.focus();
      }

      function downloadCurrent() {
        const blob = new Blob([content.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'netcut-' + (active ? active.id.slice(0, 8) : 'text') + '.txt';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setAppStatus('已下载');
      }

      function setDirty(value) {
        dirty = value;
        if (dirty) {
          stateChip.textContent = '未保存';
          stateChip.classList.add('unsaved');
        } else {
          stateChip.textContent = '已保存';
          stateChip.classList.remove('unsaved');
        }
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
        if (!dirty && (message === '已读取' || message === '新钥匙')) {
          stateChip.textContent = message;
          stateChip.classList.remove('unsaved');
        }
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
