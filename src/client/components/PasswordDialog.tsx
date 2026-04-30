import { FormEvent, useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';

type PasswordDialogProps = {
  mode: 'set' | 'unlock';
  noteId: string;
  error?: string;
  onCancel?: () => void;
  onSubmit: (password: string) => void;
};

export function PasswordDialog({ mode, noteId, error, onCancel, onSubmit }: PasswordDialogProps) {
  const [password, setPassword] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = password.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/45 p-4 backdrop-blur-sm">
      <form className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onSubmit={submit}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="grid size-12 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <LockKeyhole size={24} />
          </div>
          {onCancel ? (
            <button
              className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={onCancel}
              type="button"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold text-slate-950">{mode === 'set' ? '设置访问密码' : '输入访问密码'}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mode === 'set'
            ? '设置后，这个名称下的内容会用“名称 + 密码”加密保存。下次打开同名便签时需要输入密码。'
            : '这个名称下的内容已设置密码。请输入密码后查看。'}
        </p>
        <label className="mt-5 grid gap-2 text-sm text-slate-500">
          当前名称
          <input className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-600 outline-none" readOnly value={noteId} />
        </label>
        <label className="mt-3 grid gap-2 text-sm text-slate-500">
          密码
          <input
            autoFocus
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 outline-none focus:border-blue-400"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="请输入密码"
            type="password"
            value={password}
          />
        </label>
        {error ? <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        <button className="mt-5 h-11 w-full rounded-lg bg-blue-600 font-semibold text-white transition hover:bg-blue-500" type="submit">
          {mode === 'set' ? '保存密码并加密' : '解锁查看'}
        </button>
      </form>
    </div>
  );
}
