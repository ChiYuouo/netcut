import { FileText } from 'lucide-react';
import { countWords } from '../utils/time';

type EditorPaneProps = {
  content: string;
  readonly: boolean;
  onContentChange: (value: string) => void;
};

export function EditorPane({ content, readonly, onContentChange }: EditorPaneProps) {
  const lines = content ? content.split(/\r\n|\r|\n/).length : 0;
  const words = countWords(content);

  return (
    <section className="glass-panel grid min-h-[62vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 bg-white/35 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
            <FileText size={16} />
          </div>
          <h2 className="font-heading text-sm font-bold text-slate-900">编辑区</h2>
        </div>
      </div>

      <div className="grid min-h-0">
        <textarea
          className="min-h-[56vh] resize-none border-0 bg-transparent p-5 font-mono text-base leading-7 text-slate-800 outline-none placeholder:text-slate-400 md:p-8"
          disabled={readonly}
          id="netcut-editor"
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={readonly ? '当前内容不可编辑' : '在此输入或粘贴内容...'}
          spellCheck={false}
          value={content}
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 bg-white/35 px-4 py-3 text-sm text-slate-500 md:px-6">
        <span>{lines} 行</span>
        <span>{words} 词 / {content.length} 字符</span>
      </footer>
    </section>
  );
}
