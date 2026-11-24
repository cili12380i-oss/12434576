import React, { useState } from 'react';
import { BookOpen, Check, Copy, Plus } from 'lucide-react';
import { MODEL_ESSAYS } from '../data/shenlunCorpus';
import { OutlineSlotType } from '../types/shenlun';

interface EssayAnalysisSectionProps {
  onAddOutlineItem: (
    slotType: OutlineSlotType,
    title: string,
    content: string,
    sourceRef: string
  ) => void;
}

export const EssayAnalysisSection: React.FC<EssayAnalysisSectionProps> = ({
  onAddOutlineItem,
}) => {
  const [activeEssayId, setActiveEssayId] = useState(MODEL_ESSAYS[0].id);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [addedParaId, setAddedParaId] = useState<string | null>(null);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const essay = MODEL_ESSAYS.find((e) => e.id === activeEssayId) || MODEL_ESSAYS[0];
  const activeParagraph = essay.paragraphs[activeParagraphIndex] || essay.paragraphs[0];

  const handleSelectEssay = (id: string) => {
    setActiveEssayId(id);
    setActiveParagraphIndex(0);
  };

  const handleCopyTemplate = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTemplateId(id);
      setTimeout(() => setCopiedTemplateId((curr) => (curr === id ? null : curr)), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleAddParagraphToOutline = () => {
    const slotType: OutlineSlotType =
      activeParagraph.role === '破题立意'
        ? '总论点'
        : activeParagraph.role === '结尾收束'
          ? '金句升华'
          : '分论点';

    onAddOutlineItem(
      slotType,
      `${essay.title} · ${activeParagraph.role}`,
      activeParagraph.reusableTemplate,
      `${essay.indexCode} ${activeParagraph.role}`
    );
    setAddedParaId(activeParagraph.id);
    setTimeout(() => setAddedParaId((curr) => (curr === activeParagraph.id ? null : curr)), 1600);
  };

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D8]">
          <div>
            <p className="text-xs tracking-widest text-[#78716C] mb-2">
              高分范文结构精析 · 双栏同步阅读台
            </p>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] text-balance">
              看清每一段为何这样写：破题、推进与句式复用
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#57534E] max-w-[62ch]">
              点击左侧任意段落，右侧边栏实时同步呈现段落角色定位、阅卷视角拆解与可复用高分句式模板。
            </p>
          </div>

          <div
            role="tablist"
            aria-label="选择范文"
            className="inline-flex flex-wrap items-center gap-2"
          >
            {MODEL_ESSAYS.map((item) => {
              const selected = item.id === essay.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => handleSelectEssay(item.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-[#44403C] border-[#E5E0D8] hover:border-[#1C1917]'
                  }`}
                >
                  {item.indexCode} · {item.themeLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-white border border-[#E5E0D8] rounded-lg p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] mb-3 flex-wrap">
                <span>{essay.examSource}</span>
                <span aria-hidden="true">·</span>
                <span>{essay.year}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{essay.wordCount} 字</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">精读约 {essay.readingMinutes} 分钟</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] leading-tight">
                {essay.title}
              </h2>
              <p className="mt-2 text-base text-[#57534E]">{essay.subtitle}</p>
              <p className="mt-3 text-xs text-[#14532D] font-medium">
                对标范围：{essay.applicableScope}
              </p>

              <div className="mt-5 pt-5 border-t border-[#E5E0D8]">
                <div className="text-xs font-semibold text-[#9F2B22] mb-1.5">
                  全篇核心总论点
                </div>
                <p className="text-[15px] leading-[1.7] text-[#1C1917] font-medium">
                  {essay.overallThesis}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E0D8]">
              <div className="text-xs font-semibold text-[#1C1917] mb-2.5">
                全篇行文脉络图谱
              </div>
              <ol className="space-y-1.5 text-sm text-[#44403C]">
                {essay.outlineLogic.map((step, i) => (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="font-mono-num text-xs text-[#78716C] shrink-0">
                      0{i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <figure className="w-full h-full flex flex-col">
              <div className="w-full flex-1 min-h-[220px] rounded-lg overflow-hidden border border-[#E5E0D8] bg-[#F2EFE9]">
                {!imgErrorMap[essay.id] ? (
                  <img
                    src={essay.coverImage}
                    alt={essay.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImgErrorMap((prev) => ({ ...prev, [essay.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-7 h-7 text-[#78716C] mb-2" aria-hidden="true" />
                    <p className="font-editorial text-base font-semibold text-[#1C1917]">
                      {essay.title}
                    </p>
                  </div>
                )}
              </div>
              <figcaption className="text-xs font-editorial text-[#78716C] mt-2.5">
                {essay.coverCaption}
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7 space-y-5 bg-white border border-[#E5E0D8] rounded-lg p-6">
            <div className="flex items-center justify-between text-xs text-[#78716C] pb-3 border-b border-[#E5E0D8]">
              <span>正文精读区（点击任意段落切换右侧批注）</span>
              <span className="font-mono-num">
                第 {activeParagraphIndex + 1} / {essay.paragraphs.length} 段
              </span>
            </div>

            {essay.paragraphs.map((para, index) => {
              const isSelected = index === activeParagraphIndex;
              return (
                <button
                  key={para.id}
                  type="button"
                  onClick={() => setActiveParagraphIndex(index)}
                  className={`w-full text-left block p-4 rounded-md border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#F8F6F2] border-[#1E3A8A]/50'
                      : 'bg-white border-transparent hover:bg-[#FAF8F5] hover:border-[#E5E0D8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-[#9F2B22]' : 'text-[#78716C]'
                      }`}
                    >
                      0{index + 1} · {para.role}
                    </span>
                    <span className="text-[#78716C]">{para.technique}</span>
                  </div>
                  <p
                    className={`font-editorial text-[16px] leading-[1.85] text-[#1C1917] ${
                      index === 0
                        ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:leading-none first-letter:text-[#9F2B22]'
                        : ''
                    }`}
                  >
                    {para.text}
                  </p>
                </button>
              );
            })}
          </div>

          <aside
            aria-label="当前段落结构批注"
            className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#E5E0D8] rounded-lg p-6"
          >
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E5E0D8]">
              <div>
                <div className="text-xs text-[#9F2B22] font-semibold">
                  当前精析段落 · 0{activeParagraphIndex + 1}
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#1C1917] mt-1">
                  {activeParagraph.role}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                {essay.paragraphs.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveParagraphIndex(idx)}
                    aria-label={`跳转至第${idx + 1}段 ${p.role}`}
                    className={`w-7 h-7 font-mono-num text-xs rounded border transition-colors cursor-pointer ${
                      idx === activeParagraphIndex
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-[#F8F6F2] text-[#57534E] border-[#D6D0C4] hover:border-[#1C1917]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 space-y-5">
              <div>
                <div className="text-xs font-semibold text-[#78716C] mb-1.5">
                  阅卷视角结构拆解
                </div>
                <p className="text-sm leading-[1.75] text-[#292524]">
                  {activeParagraph.structuralAnalysis}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E0D8]">
                <div className="text-xs font-semibold text-[#78716C] mb-1.5">
                  核心修辞与论证技法
                </div>
                <p className="text-sm font-medium text-[#1C1917]">
                  {activeParagraph.technique}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E0D8]">
                <div className="text-xs font-semibold text-[#9F2B22] mb-2">
                  可迁移万能写作句式模板
                </div>
                <p className="text-sm leading-[1.8] text-[#1C1917] bg-[#F8F6F2] p-4 rounded border border-[#E5E0D8]">
                  {activeParagraph.reusableTemplate}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleCopyTemplate(activeParagraph.id, activeParagraph.reusableTemplate)
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded hover:border-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedTemplateId === activeParagraph.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#14532D]" aria-hidden="true" />
                    <span>句式已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>复制模板句式</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleAddParagraphToOutline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {addedParaId === activeParagraph.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>已收入提纲</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>收进我的提纲</span>
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
