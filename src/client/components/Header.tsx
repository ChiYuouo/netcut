import { ArrowLeft, Eraser, LockKeyhole, Plus, Save, ShieldCheck, X } from 'lucide-react';
import type { NoteTab, SaveState } from '../store/noteStore';

type HeaderProps = {
  tabs: NoteTab[];
  activeId: string;
  onAdd: () => void;
  onBack: () => void;
  onClear: () => void;
  onClose: (id: string) => void;
  onPassword: () => void;
  onSave: () => void;
  onSelect: (id: string) => void;
};

const saveLabels: Record<SaveState, string> = {
  idle: '待保存',
  dirty: '有修改',
  saving: '保存中',
  saved: '已保存',
  error: '保存失败',
};

export function Header({ tabs, activeId, onAdd, onBack, onClear, onClose, onPassword, onSave, onSelect }: HeaderProps) {
  const active = tabs.find((tab) => tab.localId === activeId) || tabs[0];

  return (
    <header className="glass-panel sticky top-4 z-30 rounded-2xl px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="glass-button grid size-10 shrink-0 place-items-center rounded-full text-slate-600"
            onClick={onBack}
            title="返回首页"
            type="button"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary font-heading text-lg font-black text-white shadow-md shadow-blue-600/20">
            N
          </div>
          <div className="min-w-0">
            <div className="font-heading text-lg font-extrabold tracking-normal text-slate-950">NetCut</div>
            <div className="truncate text-xs text-slate-500">当前名称：{active?.noteId}</div>
          </div>
        </div>

        <nav className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
          {tabs.map((tab) => {
            const isActive = tab.localId === activeId;
            return (
              <button
                className={`group flex h-10 min-w-32 max-w-56 items-center gap-2 rounded-xl border px-3 text-sm transition-all ${
                  isActive
                    ? 'border-blue-500/40 bg-blue-50/90 text-blue-700 shadow-sm'
                    : 'border-white/70 bg-white/45 text-slate-600 hover:border-blue-200 hover:bg-white/80'
                }`}
                key={tab.localId}
                onClick={() => onSelect(tab.localId)}
                type="button"
              >
                <span className="min-w-0 flex-1 truncate text-left">{tab.title}</span>
                <span
                  className={`size-1.5 rounded-full ${
                    tab.saveState === 'saved' ? 'bg-emerald-500' : tab.saveState === 'error' ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                />
                {tabs.length > 1 ? (
                  <span
                    className="grid size-5 place-items-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    onClick={(event) => {
                      event.stopPropagation();
                      onClose(tab.localId);
                    }}
                    role="button"
                    title="关闭标签"
                  >
                    <X size={14} />
                  </span>
                ) : null}
              </button>
            );
          })}
          <button
            className="glass-button grid size-10 shrink-0 place-items-center rounded-xl text-slate-600 hover:text-blue-600"
            onClick={onAdd}
            title="在当前名称下新建标签"
            type="button"
          >
            <Plus size={18} />
          </button>
        </nav>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            className="glass-button flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:text-blue-600"
            onClick={onPassword}
            type="button"
          >
            <LockKeyhole size={16} />
            密码
          </button>
          <div
            className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold ${
              active?.saveState === 'saved'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-white/70 bg-white/45 text-slate-500'
            }`}
          >
            <ShieldCheck size={16} />
            {active ? saveLabels[active.saveState] : saveLabels.idle}
          </div>
          <button
            className="glass-button flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:text-red-600"
            onClick={onClear}
            type="button"
          >
            <Eraser size={16} />
            清空
          </button>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
            disabled={active?.saveState === 'saving'}
            onClick={onSave}
            type="button"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>
    </header>
  );
}
