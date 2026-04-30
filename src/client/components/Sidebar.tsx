import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  Download,
  ExternalLink,
  History,
  Link2,
  QrCode,
  Save,
  Settings,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ttlOptions, type NoteTab, type TtlPreset } from '../store/noteStore';
import { countWords, formatDateTime, formatRemaining } from '../utils/time';

type SidebarProps = {
  tab: NoteTab;
  tabCount: number;
  countdown: string;
  onCopyText: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onSave: () => void;
  onTtlChange: (ttl: TtlPreset) => void;
};

export function Sidebar({
  tab,
  tabCount,
  countdown,
  onCopyText,
  onCopyLink,
  onDownload,
  onSave,
  onTtlChange,
}: SidebarProps) {
  const lines = tab.content ? tab.content.split(/\r\n|\r|\n/).length : 0;
  const words = countWords(tab.content);

  return (
    <aside className="w-full shrink-0 lg:w-84">
      <div className="space-y-5">
        <section className="glass-panel rounded-3xl p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full border border-white bg-slate-100 text-slate-600">
              <Settings size={18} />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900">设置</h2>
          </div>

          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            保存时长
            <span className="relative">
              <select
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200/70 bg-white/75 px-4 pr-11 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition hover:border-blue-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                onChange={(event) => onTtlChange(event.target.value as TtlPreset)}
                value={tab.ttl}
              >
                {ttlOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
            </span>
          </label>

          {tab.ttl === 'burn' ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              阅后即焚：首次读取后自动删除。
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
              过期时间：{tab.expiresAt ? countdown : describePendingTtl(tab.ttl)}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full border border-white bg-slate-100 text-slate-600">
              <BarChart3 size={18} />
            </div>
            <h2 className="font-heading text-lg font-bold text-slate-900">信息统计</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/70 bg-white/45 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-full bg-blue-100/70 text-blue-600">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-sm font-medium text-slate-600">同步状态</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold">{tab.saveState === 'saving' ? '同步中' : '已就绪'}</span>
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-3 text-center">
              <Stat label="页数" value={tabCount.toString()} />
              <Stat label="行数" value={lines.toString()} />
              <Stat label="字数" value={tab.content.length.toString()} />
            </dl>

            <div className="rounded-xl border border-slate-200/70 bg-white/45 px-3 py-2 text-xs text-slate-500">
              估算词数：{words}
            </div>

            <div className="border-t border-slate-200/60 pt-4">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">最后同步</div>
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate font-mono text-sm text-slate-600">{formatDateTime(tab.updatedAt)}</span>
                <History size={16} className="shrink-0 text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <h2 className="mb-3 font-heading text-lg font-bold text-slate-900">快捷操作</h2>
          <div className="grid gap-2">
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={onCopyText}
              type="button"
            >
              <ClipboardCopy size={17} />
              复制内容
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="glass-button flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600"
                onClick={onDownload}
                type="button"
              >
                <Download size={16} />
                下载
              </button>
              <button
                className="glass-button flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-blue-700"
                disabled={tab.saveState === 'saving'}
                onClick={onSave}
                type="button"
              >
                <Save size={16} />
                保存
              </button>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-5">
          <h2 className="mb-3 font-heading text-lg font-bold text-slate-900">分享</h2>
          <label className="grid gap-2 text-xs text-slate-500">
            当前完整链接
            <div className="flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white/70 px-3 text-sm text-slate-600 outline-none"
                readOnly
                value={tab.shareUrl}
              />
              <button
                className="glass-button grid size-10 shrink-0 place-items-center rounded-lg text-slate-600 hover:text-blue-600"
                onClick={onCopyLink}
                title="复制链接"
                type="button"
              >
                <Link2 size={16} />
              </button>
            </div>
          </label>

          <div className="mt-3 grid aspect-square place-items-center rounded-xl border border-dashed border-slate-300 bg-white/45 p-4 text-center text-slate-400">
            {tab.shareUrl ? (
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <QRCodeSVG bgColor="#ffffff" fgColor="#0f172a" level="M" size={176} value={tab.shareUrl} />
              </div>
            ) : (
              <div>
                <QrCode className="mx-auto mb-2" size={34} />
                保存后生成二维码
              </div>
            )}
          </div>

          {tab.shareUrl ? (
            <a
              className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-blue-700"
              href={tab.shareUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink size={14} />
              新窗口打开
            </a>
          ) : null}
        </section>
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/75 px-2 py-3 shadow-sm">
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</dt>
      <dd className="mt-1 font-mono text-2xl font-bold text-slate-900">{value}</dd>
    </div>
  );
}

function describePendingTtl(ttl: TtlPreset): string {
  if (ttl === '1h') return '保存后约 1 小时过期';
  if (ttl === '1d') return '保存后约 1 天过期';
  if (ttl === '3d') return '保存后约 3 天过期';
  if (ttl === 'forever') return '永久保留';
  return formatRemaining(null);
}
