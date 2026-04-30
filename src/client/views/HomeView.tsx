import { FormEvent, useState } from 'react';
import { ArrowRight, Cloud, Info, Key, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

export function HomeView() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  function submit(event: FormEvent) {
    event.preventDefault();
    const noteId = sanitizeNoteId(name) || randomName();
    navigate(`/${noteId}`);
  }

  return (
    <main className="app-surface flex min-h-screen flex-col px-5 py-6">
      <header className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="size-6 fill-primary text-primary" />
          <span className="font-heading text-2xl font-bold tracking-normal text-slate-950">云端剪切板</span>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center py-10">
        <form className="glass-panel flex w-full max-w-md flex-col gap-7 overflow-hidden rounded-xl p-8" onSubmit={submit}>
          <div className="text-center">
            <h1 className="font-heading text-3xl font-extrabold tracking-normal text-slate-950">进入剪切板</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">输入唯一名称，跨设备保存和同步文本。</p>
          </div>

          <div className="grid gap-2">
            <label className="relative flex items-center">
              <Key className="pointer-events-none absolute left-4 size-5 text-slate-400" />
              <input
                autoComplete="off"
                className="h-14 w-full rounded-lg border border-transparent bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                onChange={(event) => setName(event.target.value)}
                placeholder="输入名称，留空则自动生成"
                value={name}
              />
            </label>
            <p className="flex items-center gap-1 px-1 text-xs text-slate-500">
              <Info size={14} />
              名称就是访问凭证，请妥善保存。
            </p>
          </div>

          <button
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
            type="submit"
          >
            立即进入
            <ArrowRight size={20} />
          </button>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={16} className="text-emerald-500" />
              本地加密
            </span>
            <span className="flex items-center gap-1">
              <Zap size={16} className="text-amber-500" />
              快速同步
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}

function randomName(): string {
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

function sanitizeNoteId(value: string): string {
  return value.trim().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32);
}
