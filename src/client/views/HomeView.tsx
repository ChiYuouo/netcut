import { FormEvent, useState } from 'react';
import { ArrowRight, Cloud, ShieldAlert } from 'lucide-react';
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
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Cloud size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-normal text-slate-950 md:text-6xl">云便签 网络剪贴板</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
          极简的数据暂存和传送工具，无需登录，即开即用...
        </p>

        <form
          className="mx-auto mt-10 flex max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70 sm:flex-row"
          onSubmit={submit}
        >
          <input
            className="min-h-14 min-w-0 flex-1 border-0 bg-transparent px-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
            onChange={(event) => setName(event.target.value)}
            placeholder="云便签名称 (可选：留空则自动生成随机名称)"
            value={name}
          />
          <button
            className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-blue-500"
            type="submit"
          >
            查看/新建云便签
            <ArrowRight size={18} />
          </button>
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
