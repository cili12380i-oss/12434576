import React, { useMemo, useState } from 'react';
import { Check, Copy, Plus, Search } from 'lucide-react';
import {
  MATERIAL_LIBRARY,
  MATERIAL_STAGES,
  SHENLUN_THEMES,
} from '../data/shenlunCorpus';
import {
  MaterialStageId,
  OutlineSlotType,
  ShenlunThemeId,
} from '../types/shenlun';

interface MaterialLibrarySectionProps {
  onAddOutlineItem: (
    slotType: OutlineSlotType,
    title: string,
    content: string,
    sourceRef: string
  ) => void;
}

export const MaterialLibrarySection: React.FC<MaterialLibrarySectionProps> = ({
  onAddOutlineItem,
}) => {
  const [activeStage, setActiveStage] = useState<MaterialStageId>('opening_closing');
  const [selectedTheme, setSelectedTheme] = useState<ShenlunThemeId>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const stageMeta =
    MATERIAL_STAGES.find((s) => s.id === activeStage) || MATERIAL_STAGES[0];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MATERIAL_LIBRARY.filter((item) => {
      if (item.stage !== activeStage) return false;
      if (selectedTheme !== 'all' && item.theme !== selectedTheme) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.usageTip.toLowerCase().includes(q) ||
        item.themeLabel.toLowerCase().includes(q)
      );
    });
  }, [activeStage, selectedTheme, query]);

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1800);
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleAdd = (
    id: string,
    stage: MaterialStageId,
    title: string,
    content: string,
    source: string
  ) => {
    const slotType: OutlineSlotType =
      stage === 'opening_closing' || stage === 'transition_parallel'
        ? '金句升华'
        : stage === 'compressed_case'
          ? '案例支撑'
          : '分论点';
    onAddOutlineItem(slotType, title, content, source);
    setAddedId(id);
    setTimeout(() => setAddedId((curr) => (curr === id ? null : curr)), 1600);
  };

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="pb-8 border-b border-[#E5E0D8]">
          <p className="text-xs tracking-widest text-[#78716C] mb-2">
            分功素材图书馆 · 按写作段落位置严格分馆
          </p>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] text-balance">
            写到哪一段，就进哪一馆：彻底告别素材混杂难找
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#57534E] max-w-[66ch]">
            金句、70字压缩案例、硬核对策动词、过渡排比句式各自独立成馆。先选你当前正在动笔的文章位置，再按主题精准取用。
          </p>
        </div>

        {/* 4 Independent Functional Vaults */}
        <div
          role="tablist"
          aria-label="选择写作功能分馆"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {MATERIAL_STAGES.map((stage) => {
            const active = stage.id === activeStage;
            const count = MATERIAL_LIBRARY.filter((m) => m.stage === stage.id).length;
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveStage(stage.id)}
                className={`text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#1C1917] border-[#E5E0D8] hover:border-[#1C1917]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className={active ? 'text-white/80' : 'text-[#9F2B22] font-semibold'}>
                    {stage.label.split('·')[0].trim()}
                  </span>
                  <span className={`font-mono-num ${active ? 'text-white/75' : 'text-[#78716C]'}`}>
                    {count} 条
                  </span>
                </div>
                <div className="font-editorial text-base font-bold mt-1.5">
                  {stage.shortTitle}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${active ? 'text-white/80' : 'text-[#78716C]'}`}>
                  {stage.writingPosition}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Vault Header & Sub-filters */}
        <div className="mt-8 pb-5 border-b border-[#E5E0D8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
              {stageMeta.label}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-1">
              {stageMeta.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <select
              aria-label="按申论主题筛选素材"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as ShenlunThemeId)}
              className="px-3 py-2 text-sm bg-white border border-[#D6D0C4] rounded-md text-[#1C1917] focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
            >
              <option value="all">全部主题领域</option>
              {SHENLUN_THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-56">
              <Search
                className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="在本馆内检索…"
                aria-label="检索本馆素材"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D6D0C4] rounded-md text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="mt-6 bg-white border border-[#E5E0D8] rounded-lg p-10 text-center">
            <p className="font-editorial text-lg text-[#1C1917]">
              当前分馆下暂无匹配该主题的素材
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTheme('all');
                setQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-medium text-[#1E3A8A] border border-[#1E3A8A]/30 rounded-md hover:bg-[#1E3A8A]/5 cursor-pointer"
            >
              显示本馆全部素材
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-[#E5E0D8] rounded-lg p-6 flex flex-col justify-between transition-colors hover:border-[#C7BFB3]"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#78716C] mb-2.5 flex-wrap">
                    <span className="font-semibold text-[#9F2B22]">{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#1C1917]">{item.themeLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.examFit}</span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-[1.75] text-[#292524]">
                    {item.content}
                  </p>

                  {item.structuredParts && (
                    <div className="mt-4 pt-3 border-t border-[#F0ECE3] space-y-1 text-xs text-[#44403C]">
                      <div>{item.structuredParts.lead}</div>
                      <div>{item.structuredParts.action}</div>
                      <div>{item.structuredParts.outcome}</div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#F0ECE3] space-y-1.5 text-xs leading-relaxed text-[#57534E]">
                    <div>
                      <span className="font-semibold text-[#14532D]">适用写法：</span>
                      {item.usageTip}
                    </div>
                    <div>
                      <span className="font-semibold text-[#9F2B22]">避坑提醒：</span>
                      {item.avoidTip}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#78716C] truncate">{item.source}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.content)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded hover:border-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#14532D]" aria-hidden="true" />
                          <span>已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>复制</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAdd(item.id, item.stage, item.title, item.content, item.source)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#1E3A8A] rounded hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {addedId === item.id ? (
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
