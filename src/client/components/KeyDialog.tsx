import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';

type KeyDialogProps = {
  noteId: string;
  error?: string;
  onSubmit: (key: string) => void;
};

export function KeyDialog({ noteId, error, onSubmit }: KeyDialogProps) {
  const [key, setKey] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (key.trim()) onSubmit(key.trim());
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/45 p-4 backdrop-blur-sm">
      <form className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl" onSubmit={submit}>
        <div className="mb-5 grid size-12 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <LockKeyhole size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-950">需要解密密钥</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          这个便签没有在 URL Hash 中找到可用密钥。请输入分享者提供的密钥来本地解密。
        </p>
        <label className="mt-5 grid gap-2 text-sm text-slate-500">
          Note ID
          <input className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-600 outline-none" readOnly value={noteId} />
        </label>
        <label className="mt-3 grid gap-2 text-sm text-slate-500">
          密钥
          <input
            autoFocus
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-slate-900 outline-none focus:border-blue-400"
            onChange={(event) => setKey(event.target.value)}
            placeholder="base64url key"
            value={key}
          />
        </label>
        {error ? <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        <button className="mt-5 h-11 w-full rounded-lg bg-blue-600 font-semibold text-white transition hover:bg-blue-500" type="submit">
          解密并打开
        </button>
      </form>
    </div>
  );
}
