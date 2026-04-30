import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { burnNote, fetchNote, saveNote } from '../api';
import { EditorPane } from '../components/EditorPane';
import { Header } from '../components/Header';
import { PasswordDialog } from '../components/PasswordDialog';
import { Sidebar } from '../components/Sidebar';
import { ttlOptions, useNoteStore, type SavedWorkspace, type TtlPreset } from '../store/noteStore';
import { decryptTextWithPassword, encryptTextWithPassword, workspaceSecret } from '../utils/crypto';
import { formatRemaining } from '../utils/time';

type SaveOptions = {
  passwordOverride?: string;
  passwordProtectedOverride?: boolean;
  ttlOverride?: TtlPreset;
};

export function WorkspaceView() {
  const { noteId = '' } = useParams();
  const navigate = useNavigate();
  const {
    tabs,
    activeId,
    addTab,
    closeTab,
    ensureWorkspace,
    replaceWorkspace,
    reset,
    setActive,
    updateActive,
    updateWorkspace,
  } = useNoteStore();
  const active = tabs.find((tab) => tab.localId === activeId) || tabs.find((tab) => tab.noteId === noteId);
  const workspaceTabs = tabs.filter((tab) => tab.noteId === noteId);
  const [loadedNames, setLoadedNames] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState('工作台已就绪');
  const [passwordDialog, setPasswordDialog] = useState<'set' | 'unlock' | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const [tick, setTick] = useState(0);

  const activeTtl = useMemo(() => ttlOptions.find((option) => option.value === active?.ttl) || ttlOptions[2], [active]);
  const canEdit = Boolean(active);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!noteId) return;
    ensureWorkspace(noteId);
    if (!loadedNames.has(noteId)) {
      void loadWorkspace(noteId);
    }
  }, [noteId]);

  if (!active) {
    return <div className="grid min-h-screen place-items-center bg-slate-100 text-slate-500">正在打开工作台...</div>;
  }

  const activeTab = active;

  async function loadWorkspace(targetNoteId: string, password?: string) {
    setStatus('正在读取云便签...');
    setPasswordError('');

    try {
      const note = await fetchNote(targetNoteId);
      if (note.password_protected && !password) {
        setPasswordDialog('unlock');
        setStatus('该便签需要密码');
        return;
      }

      const decrypted = await decryptTextWithPassword(note.ciphertext, note.iv, workspaceSecret(targetNoteId, password));
      const payload = parseWorkspacePayload(decrypted, targetNoteId);
      if (note.burn_after_read) {
        await burnNote(targetNoteId);
      }

      replaceWorkspace(targetNoteId, payload, {
        password,
        passwordProtected: note.password_protected,
        ttl: note.burn_after_read ? 'burn' : undefined,
        permission: note.permission,
        burnAfterRead: note.burn_after_read,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        expiresAt: note.expires_at,
        isOwner: true,
      });
      setLoadedNames((value) => new Set(value).add(targetNoteId));
      setPasswordDialog(null);
      setStatus(note.burn_after_read ? '已读取，服务端内容已自动焚毁' : '已读取保存内容');
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        setLoadedNames((value) => new Set(value).add(targetNoteId));
        setStatus(`已新建云便签 ${targetNoteId}`);
        return;
      }

      if (password) {
        setPasswordError('密码不正确，请重新输入');
        setPasswordDialog('unlock');
        setStatus('密码不正确');
        return;
      }

      setPasswordError('');
      setLoadedNames((value) => new Set(value).add(targetNoteId));
      setStatus('读取失败：该名称下的数据无法用名称钥匙打开');
    }
  }

  function updateContent(content: string) {
    updateActive({
      content,
      title: firstLineTitle(content, activeTab.title),
      saveState: 'dirty',
      error: undefined,
    });
  }

  async function saveWorkspace(options: SaveOptions = {}) {
    if (!canEdit) {
      setStatus('当前便签不可编辑');
      return;
    }

    const ttlValue = options.ttlOverride || activeTab.ttl;
    const ttl = ttlOptions.find((option) => option.value === ttlValue) || activeTtl;
    const permission = 'editable';
    const password = options.passwordOverride ?? activeTab.password;
    const passwordProtected = options.passwordProtectedOverride ?? activeTab.passwordProtected;

    updateWorkspace(activeTab.noteId, { saveState: 'saving', error: undefined });
    setStatus('正在保存当前名称下的所有标签...');

    try {
      const currentTabs = tabs.filter((tab) => tab.noteId === activeTab.noteId);
      const payload: SavedWorkspace = {
        v: 1,
        activePageId: activeTab.pageId,
        passwordProtected,
        tabs: currentTabs.map((tab) => ({
          pageId: tab.pageId,
          title: tab.localId === activeTab.localId ? firstLineTitle(activeTab.content, tab.title) : tab.title,
          content: tab.localId === activeTab.localId ? activeTab.content : tab.content,
        })),
      };
      const encrypted = await encryptTextWithPassword(JSON.stringify(payload), workspaceSecret(activeTab.noteId, password));
      const saved = await saveNote(activeTab.noteId, {
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        ttl_seconds: ttl.seconds,
        permission,
        burn_after_read: ttl.burn,
        password_protected: passwordProtected,
      });

      updateWorkspace(activeTab.noteId, {
        password,
        passwordProtected,
        saveState: 'saved',
        burnAfterRead: saved.burn_after_read,
        createdAt: saved.created_at,
        updatedAt: saved.updated_at,
        expiresAt: saved.expires_at,
        ttl: ttlValue,
        permission,
      });
      setStatus('保存成功');
    } catch (error) {
      updateWorkspace(activeTab.noteId, {
        saveState: 'error',
        error: error instanceof Error ? error.message : '保存失败',
      });
      setStatus(error instanceof Error ? error.message : '保存失败');
    }
  }

  async function setPassword(password: string) {
    updateWorkspace(activeTab.noteId, { password, passwordProtected: true, saveState: 'dirty' });
    setPasswordDialog(null);
    await saveWorkspace({ passwordOverride: password, passwordProtectedOverride: true });
  }

  async function copyText() {
    await navigator.clipboard.writeText(activeTab.content);
    setStatus('内容已复制');
  }

  async function copyLink() {
    await navigator.clipboard.writeText(activeTab.shareUrl);
    setStatus('完整链接已复制');
  }

  function download() {
    const blob = new Blob([activeTab.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `netcut-${activeTab.noteId}-${activeTab.pageId.slice(0, 6)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('已下载 .txt');
  }

  function addWorkspaceTab() {
    const tab = addTab(activeTab.noteId);
    setActive(tab.localId);
    setStatus('已在当前名称下新建标签');
  }

  function updateTtl(ttl: TtlPreset) {
    const option = ttlOptions.find((item) => item.value === ttl);
    updateWorkspace(activeTab.noteId, { ttl, burnAfterRead: Boolean(option?.burn), saveState: 'dirty' });
    void saveWorkspace({ ttlOverride: ttl });
  }

  function backHome() {
    reset();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Header
          activeId={activeId}
          onAdd={addWorkspaceTab}
          onBack={backHome}
          onClear={() => updateContent('')}
          onClose={closeTab}
          onPassword={() => setPasswordDialog('set')}
          onSave={() => void saveWorkspace()}
          onSelect={setActive}
          tabs={workspaceTabs}
        />

        <main className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <EditorPane content={activeTab.content} onContentChange={updateContent} readonly={!canEdit} />
          <Sidebar
            countdown={formatRemaining(activeTab.expiresAt)}
            onCopyLink={copyLink}
            onCopyText={copyText}
            onDownload={download}
            onSave={() => void saveWorkspace()}
            onTtlChange={updateTtl}
            tab={activeTab}
            tabCount={workspaceTabs.length}
          />
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 px-4 py-2 text-sm text-slate-600 shadow-xl backdrop-blur">
        {activeTab.error || status}
        <span className="sr-only">{tick}</span>
      </div>

      {passwordDialog ? (
        <PasswordDialog
          error={passwordError}
          mode={passwordDialog}
          noteId={activeTab.noteId}
          onCancel={passwordDialog === 'set' ? () => setPasswordDialog(null) : backHome}
          onSubmit={passwordDialog === 'set' ? setPassword : (password) => loadWorkspace(activeTab.noteId, password)}
        />
      ) : null}
    </div>
  );
}

function parseWorkspacePayload(text: string, noteId: string): SavedWorkspace {
  try {
    const parsed = JSON.parse(text) as Partial<SavedWorkspace>;
    if (parsed.v === 1 && Array.isArray(parsed.tabs)) {
      return {
        v: 1,
        passwordProtected: Boolean(parsed.passwordProtected),
        activePageId: parsed.activePageId,
        tabs: parsed.tabs.map((tab, index) => ({
          pageId: typeof tab.pageId === 'string' ? tab.pageId : `${noteId}-${index + 1}`,
          title: typeof tab.title === 'string' ? tab.title : `标签 ${index + 1}`,
          content: typeof tab.content === 'string' ? tab.content : '',
        })),
      };
    }
  } catch {
    // Older saves were a single encrypted text value.
  }

  return {
    v: 1,
    tabs: [{ pageId: `${noteId}-legacy`, title: firstLineTitle(text, '标签 1'), content: text }],
  };
}

function firstLineTitle(content: string, fallback: string): string {
  const first = content.split(/\r\n|\r|\n/).find((line) => line.trim());
  if (!first) return fallback;
  return first.replace(/^#+\s*/, '').slice(0, 30);
}
