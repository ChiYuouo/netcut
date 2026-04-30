export function formatDateTime(value?: string | null): string {
  if (!value) return '尚未生成';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parseServerTime(value));
}

export function formatRemaining(target?: string | null): string {
  if (!target) return '永久保留';

  const diff = parseServerTime(target).getTime() - Date.now();
  if (diff <= 0) return '已过期';

  const totalMinutes = Math.ceil(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `剩余 ${days}天 ${hours}小时`;
  if (hours > 0) return `剩余 ${hours}小时 ${minutes}分钟`;
  return `剩余 ${minutes}分钟`;
}

export function countWords(text: string): number {
  const latinWords = text.match(/[A-Za-z0-9_]+(?:['-][A-Za-z0-9_]+)*/g)?.length ?? 0;
  const cjkChars = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  return latinWords + cjkChars;
}

function parseServerTime(value: string): Date {
  if (value.includes('T')) return new Date(value);
  return new Date(`${value.replace(' ', 'T')}Z`);
}
