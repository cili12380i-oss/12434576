import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { SHENLUN_THEMES } from '../data/shenlunCorpus';
import {
  ArgumentCard,
  CardStageFilter,
  OutlineSlotType,
  ShenlunThemeId,
} from '../types/shenlun';

interface ArgumentMatrixSectionProps {
  cards: ArgumentCard[];
  onAddOutlineItem: (
    slotType: OutlineSlotType,
    title: string,
    content: string,
    sourceRef: string
  ) => void;
  onDeleteCustomCard: (id: string) => void;
}

const STAGE_FILTERS: { id: CardStageFilter; label: string }[] = [
  { id: 'all', label: '全部写作功能' },
  { id: '破题总论', label: '适合破题总论' },
  { id: '对策落地', label: '适合对策落地' },
  { id: '辩证升华', label: '适合辩证升华' },
];

export const ArgumentMatrixSection: React.FC<ArgumentMatrixSectionProps> = ({
  cards,
  onAddOutlineItem,
  onDeleteCustomCard,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ShenlunThemeId>('all');
  const [selectedStage, setSelectedStage] = useState<CardStageFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [compactMode, setCompactMode] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'arg-01': true,
    'arg-02': true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cards.filter((card) => {
      if (selectedTheme !== 'all' && card.theme !== selectedTheme) return false;
      if (selectedStage !== 'all' && card.stageTag !== selectedStage) return false;
      if (!q) return true;
      return (
        card.title.toLowerCase().includes(q) ||
        card.coreThesis.toLowerCase().includes(q) ||
        card.themeLabel.toLowerCase().includes(q) ||
        card.applicableScope.toLowerCase().includes(q) ||
        card.keywords.some((k) => k.toLowerCase().includes(q)) ||
        card.subArguments.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [cards, selectedTheme, selectedStage, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleAddToOutline = (
    feedbackKey: string,
    slotType: OutlineSlotType,
    title: string,
    content: string,
    sourceRef: string
  ) => {
    onAddOutlineItem(slotType, title, content, sourceRef);
    setAddedId(feedbackKey);
    setTimeout(() => setAddedId((curr) => (curr === feedbackKey ? null : curr)), 1600);
  };

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D8]">
          <div>
            <p className="text-xs tracking-widest text-[#78716C] mb-2">
              核心论点卡片矩阵 · 主题域 × 写作功能双维检索
            </p>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] text-balance">
              每张论点卡均明确「怎么写、何时用、何处慎用」
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#57534E] max-w-[64ch]">
              拒绝泛泛而谈的万金油模板。每张卡片除三层论证链与对仗分论点外，均附带「适用题型范围」与「偏题慎用提示」。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search
                className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="检索论点、关键词或适用题型…"
                aria-label="检索论点卡片"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D6D0C4] rounded-md text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div className="inline-flex items-center p-1 bg-[#EFECE4] rounded-md border border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setCompactMode(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !compactMode
                    ? 'bg-white text-[#1C1917]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                逻辑深拆
              </button>
              <button
                type="button"
                onClick={() => setCompactMode(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  compactMode
                    ? 'bg-white text-[#1C1917]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                速览卡片
              </button>
            </div>
          </div>
        </div>

        <div className="py-5 space-y-3 border-b border-[#E5E0D8]">
          <div
            role="tablist"
            aria-label="申论主题筛选"
            className="flex items-center gap-2 overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedTheme === 'all'}
              onClick={() => setSelectedTheme('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedTheme === 'all'
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'bg-white text-[#44403C] border-[#E5E0D8] hover:border-[#1C1917]'
              }`}
            >
              全部主题 ({cards.length})
            </button>
            {SHENLUN_THEMES.map((t) => {
              const count = cards.filter((c) => c.theme === t.id).length;
              const active = selectedTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-white text-[#44403C] border-[#E5E0D8] hover:border-[#1C1917]'
                  }`}
                >
                  {t.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#78716C] mr-1">按写作位置：</span>
            {STAGE_FILTERS.map((sf) => (
              <button
                key={sf.id}
                type="button"
                onClick={() => setSelectedStage(sf.id)}
                className={`px-3 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedStage === sf.id
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-[#F8F6F2] text-[#57534E] border-[#E5E0D8] hover:border-[#1C1917]'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="mt-6 bg-white border border-[#E5E0D8] rounded-lg p-12 text-center">
            <p className="font-editorial text-lg text-[#1C1917]">未找到匹配的论点卡片</p>
            <p className="text-sm text-[#78716C] mt-1">
              试试调整主题或写作位置筛选，或在「原材深挖」生成新的自定义卡片。
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTheme('all');
                setSelectedStage('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-[#1E3A8A] border border-[#1E3A8A]/30 rounded-md hover:bg-[#1E3A8A]/5 cursor-pointer"
            >
              重置筛选条件
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCards.map((card) => {
              const isExpanded = !compactMode && !!expandedIds[card.id];
              return (
                <article
                  key={card.id}
                  className="bg-white border border-[#E5E0D8] rounded-lg p-6 flex flex-col justify-between transition-colors hover:border-[#C7BFB3]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 text-xs text-[#78716C] mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono-num font-semibold text-[#9F2B22]">
                          CARD {card.indexCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#1C1917]">{card.themeLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{card.stageTag}</span>
                        <span aria-hidden="true">·</span>
                        <span>{card.examLevel}</span>
                        {card.isCustom && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#1E3A8A] font-medium">原材提取</span>
                          </>
                        )}
                      </div>
                      {card.isCustom && (
                        <button
                          type="button"
                          onClick={() => onDeleteCustomCard(card.id)}
                          aria-label={`删除自定义卡片 ${card.title}`}
                          className="text-[#78716C] hover:text-[#9F2B22] transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h2 className="font-editorial text-xl font-bold text-[#1C1917] leading-snug">
                      {card.title}
                    </h2>

                    <div className="mt-4 pt-4 border-t border-[#F0ECE3]">
                      <div className="text-xs font-medium text-[#9F2B22] mb-1.5">
                        核心记忆论点（可直接作总论点）
                      </div>
                      <p className="text-[15px] leading-[1.7] font-medium text-[#1C1917]">
                        {card.coreThesis}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#F0ECE3] space-y-2 text-xs leading-relaxed text-[#44403C]">
                      <div>
                        <span className="font-semibold text-[#14532D]">适用边界：</span>
                        <span>{card.applicableScope}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#9F2B22]">慎用提醒：</span>
                        <span>{card.cautionNote}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#F0ECE3] space-y-2.5 text-sm leading-relaxed text-[#44403C]">
                      <div>
                        <span className="font-semibold text-[#1C1917]">立论切口（Why）：</span>
                        <span>{card.logicChain.why}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#1C1917]">破局路径（How）：</span>
                        <span>{card.logicChain.how}</span>
                      </div>
                      {!compactMode && (
                        <div>
                          <span className="font-semibold text-[#1C1917]">价值升华：</span>
                          <span>{card.logicChain.elevation}</span>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-5 pt-4 border-t border-[#E5E0D8] space-y-4">
                        <div>
                          <div className="text-xs font-semibold text-[#1C1917] mb-2">
                            推荐三分论点句式（点击即可加入提纲）
                          </div>
                          <ul className="space-y-2">
                            {card.subArguments.map((sub, idx) => {
                              const subKey = `${card.id}-sub-${idx}`;
                              const subAdded = addedId === subKey;
                              return (
                                <li
                                  key={subKey}
                                  className="flex items-start justify-between gap-3 py-1.5 border-b border-[#F5F2EB] last:border-b-0"
                                >
                                  <div className="text-sm text-[#292524] leading-relaxed">
                                    <span className="font-mono-num text-xs text-[#78716C] mr-2">
                                      0{idx + 1}
                                    </span>
                                    {sub}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddToOutline(
                                        subKey,
                                        '分论点',
                                        `${card.themeLabel}分论点`,
                                        sub,
                                        `论点卡片 ${card.indexCode}`
                                      )
                                    }
                                    className="text-xs text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 mt-0.5 cursor-pointer"
                                  >
                                    {subAdded ? '已加入' : '+ 提纲'}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-[#F0ECE3] text-sm text-[#44403C] leading-relaxed">
                          <span className="font-semibold text-[#1C1917]">高分破题开头：</span>
                          {card.goldenOpening}
                        </div>

                        <div className="text-sm text-[#44403C] leading-relaxed">
                          <span className="font-semibold text-[#1C1917]">事实案例锚点：</span>
                          {card.caseAnchor}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#78716C]">
                      关键词：{card.keywords.join(' / ')}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!compactMode && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(card.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#44403C] hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <span>收起分论点</span>
                              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                            </>
                          ) : (
                            <>
                              <span>展开分论点与案例</span>
                              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            card.id,
                            `【${card.title}】\n总论点：${card.coreThesis}\n分论点：\n${card.subArguments
                              .map((s, i) => `${i + 1}. ${s}`)
                              .join('\n')}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded hover:border-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {copiedId === card.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#14532D]" aria-hidden="true" />
                            <span>已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>复制卡片</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToOutline(
                            card.id,
                            '总论点',
                            card.title,
                            card.coreThesis,
                            `论点卡片 ${card.indexCode}`
                          )
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#1E3A8A] rounded hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {addedId === card.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>已入提纲</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>收进提纲</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
