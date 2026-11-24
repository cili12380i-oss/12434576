import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  FilePlus2,
  Trash2,
  X,
} from 'lucide-react';
import { OutlineItem, OutlineSlotType } from '../types/shenlun';

interface OutlineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OutlineItem[];
  essayTitle: string;
  onChangeEssayTitle: (title: string) => void;
  onUpdateItem: (id: string, content: string) => void;
  onMoveItem: (index: number, direction: -1 | 1) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onLoadStarterTemplate: () => void;
  onAddBlankItem: (slotType: OutlineSlotType) => void;
}

export const OutlineDrawer: React.FC<OutlineDrawerProps> = ({
  isOpen,
  onClose,
  items,
  essayTitle,
  onChangeEssayTitle,
  onUpdateItem,
  onMoveItem,
  onRemoveItem,
  onClearAll,
  onLoadStarterTemplate,
  onAddBlankItem,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const estimatedWords = items.reduce((acc, item) => {
    if (item.slotType === '总论点') return acc + 160;
    if (item.slotType === '分论点') return acc + 250;
    if (item.slotType === '金句升华') return acc + 130;
    return acc + 90;
  }, 0);

  const exportMarkdown = () => {
    const lines = [
      `# ${essayTitle || '未命名申论文章提纲'}`,
      `> 预计成文字数：约 ${estimatedWords} 字（考场标准建议 1000–1200 字）`,
      '',
      ...items.map(
        (item, idx) =>
          `## 0${idx + 1}. 【${item.slotType}】${item.title}\n${item.content}\n（来源：${item.sourceRef}）`
      ),
    ];
    return lines.join('\n\n');
  };

  const handleCopyOutline = async () => {
    try {
      await navigator.clipboard.writeText(exportMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="我的申论写作提纲"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-xl bg-[#F8F6F2] h-full flex flex-col border-l border-[#E5E0D8] shadow-xl">
        <div className="px-6 py-5 bg-white border-b border-[#E5E0D8] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
              我的申论写作提纲
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              已收集 <span className="font-mono-num font-semibold text-[#1C1917]">{items.length}</span> 项素材 · 预估成文约{' '}
              <span className="font-mono-num font-semibold text-[#9F2B22]">{estimatedWords}</span> 字
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭提纲面板"
            className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-md hover:bg-[#F8F6F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 bg-white border-b border-[#E5E0D8]">
          <label htmlFor="outline-essay-title" className="block text-xs font-semibold text-[#78716C] mb-1.5">
            拟定文章标题
          </label>
          <input
            id="outline-essay-title"
            type="text"
            value={essayTitle}
            onChange={(e) => onChangeEssayTitle(e.target.value)}
            placeholder="例如：以“绣花功夫”绘就基层善治新图景"
            className="w-full px-3 py-2 font-editorial text-base font-bold bg-[#F8F6F2] border border-[#D6D0C4] rounded text-[#1C1917] focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-lg p-8 text-center">
              <p className="font-editorial text-lg font-semibold text-[#1C1917]">
                提纲工作台暂无内容
              </p>
              <p className="text-sm text-[#78716C] mt-1.5 leading-relaxed">
                在「论点矩阵」「范文精析」或「素材金句库」点击“收进提纲”，即可在此自由编排文章骨架。
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onLoadStarterTemplate}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172554] cursor-pointer"
                >
                  载入标准五段式示范提纲
                </button>
                <button
                  type="button"
                  onClick={() => onAddBlankItem('分论点')}
                  className="px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded-md hover:border-[#1C1917] cursor-pointer"
                >
                  手写空白分论点
                </button>
              </div>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border border-[#E5E0D8] rounded-lg p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono-num font-semibold text-[#9F2B22]">
                      0{idx + 1}
                    </span>
                    <span className="font-semibold text-[#1E3A8A]">{item.slotType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#57534E] truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveItem(idx, -1)}
                      aria-label="上移"
                      className="p-1 text-[#78716C] hover:text-[#1C1917] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => onMoveItem(idx, 1)}
                      aria-label="下移"
                      className="p-1 text-[#78716C] hover:text-[#1C1917] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="移除该项"
                      className="p-1 text-[#78716C] hover:text-[#9F2B22] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={item.content}
                  onChange={(e) => onUpdateItem(item.id, e.target.value)}
                  aria-label={`${item.title} 内容编辑`}
                  className="w-full p-2.5 text-sm leading-relaxed bg-[#F8F6F2] border border-[#E5E0D8] rounded text-[#1C1917] focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
                />

                <div className="text-[11px] text-[#78716C]">
                  来源：{item.sourceRef}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAddBlankItem('分论点')}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded hover:border-[#1C1917] cursor-pointer"
            >
              <FilePlus2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>加一条手写分论点</span>
            </button>
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-3 py-2 text-xs font-medium text-[#78716C] hover:text-[#9F2B22] cursor-pointer"
              >
                清空提纲
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleCopyOutline}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172554] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>已复制完整提纲</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>导出 Markdown 提纲</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
