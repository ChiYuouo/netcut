import {
  ClipboardCopy,
  Download,
  ExternalLink,
  Link2,
  QrCode,
  Save,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ttlOptions, type NoteTab, type Permission, type TtlPreset } from '../store/noteStore';
import { countWords, formatDateTime, formatRemaining } from '../utils/time';

type SidebarProps = {
  tab: NoteTab;
  tabCount: number;
  countdown: string;
  onCopyText: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onSave: () => void;
  onPermissionChange: (permission: Permission) => void;
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
  onPermissionChange,
  onTtlChange,
}: SidebarProps) {
  const lines = tab.content ? tab.content.split(/\r\n|\r|\n/).length : 0;

  return (
    <aside className="w-full shrink-0 lg:w-84">
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">快捷按钮</h2>
          <div className="grid gap-2">
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              onClick={onCopyText}
              type="button"
            >
              <ClipboardCopy size={17} />
              复制
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                onClick={onDownload}
                type="button"
              >
                <Download size={16} />
                下载
              </button>
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-600 transition hover:bg-blue-100"
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

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">统计信息</h2>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <Stat label="便签页数" value={tabCount.toString()} />
            <Stat label="行数" value={lines.toString()} />
            <Stat label="字符数" value={tab.content.length.toString()} />
          </dl>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            估算词数：{countWords(tab.content)}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">信息与时间</h2>
          <dl className="space-y-2 text-sm">
            <Meta label="创建时间" value={formatDateTime(tab.createdAt)} />
            <Meta label="更新时间" value={formatDateTime(tab.updatedAt)} />
          </dl>
          <label className="mt-3 grid gap-2 text-xs text-slate-500">
            保留时间
            <select
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-400"
              onChange={(event) => onTtlChange(event.target.value as TtlPreset)}
              value={tab.ttl}
            >
              {ttlOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {tab.ttl === 'burn' ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              [阅后即焚] 此内容将在首次阅读后物理销毁
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
              过期时间：{tab.expiresAt ? countdown : describePendingTtl(tab.ttl)}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">分享</h2>
          <button
            className="mb-3 flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-blue-300"
            onClick={() => onPermissionChange(tab.permission === 'readonly' ? 'editable' : 'readonly')}
            type="button"
          >
            <span>{tab.permission === 'readonly' ? '只读' : '可编辑'}</span>
            {tab.permission === 'readonly' ? <ToggleLeft className="text-slate-400" /> : <ToggleRight className="text-blue-600" />}
          </button>
          <label className="grid gap-2 text-xs text-slate-500">
            当前便签完整链接
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none"
                readOnly
                value={tab.shareUrl}
              />
              <button
                className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                onClick={onCopyLink}
                title="复制链接"
                type="button"
              >
                <Link2 size={16} />
              </button>
            </div>
          </label>

          <div className="mt-3 grid aspect-square place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-400">
            {tab.shareUrl ? (
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
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
              className="mt-3 flex items-center justify-center gap-2 text-xs text-blue-600 hover:text-blue-500"
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-slate-950">{value}</dd>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-700">{value}</dd>
    </div>
  );
}

function describePendingTtl(ttl: TtlPreset): string {
  if (ttl === '1h') return '保存后约 1小时 后过期';
  if (ttl === '1d') return '保存后约 1天 后过期';
  if (ttl === '3d') return '保存后约 3天 后过期';
  if (ttl === 'forever') return '永久保留';
  return formatRemaining(null);
}
