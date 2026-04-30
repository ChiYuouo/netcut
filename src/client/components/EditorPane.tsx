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
    <section className="grid min-h-[62vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">文本编辑区</h2>
        </div>
      </div>

      <div className="grid min-h-0">
        <textarea
          className="min-h-[56vh] resize-none border-0 bg-white p-5 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400 md:p-8"
          disabled={readonly}
          id="netcut-editor"
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={readonly ? '当前内容不可编辑' : '在这里输入或粘贴内容...'}
          spellCheck={false}
          value={content}
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 md:px-6">
        <span>{lines} 行</span>
        <span>{words} 词 / {content.length} 字符</span>
      </footer>
    </section>
  );
}
