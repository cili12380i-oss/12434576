import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Eye,
  FileEdit,
  Layers,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_SOURCE_MATERIALS } from '../data/shenlunCorpus';
import {
  ArgumentCard,
  ExtractionFocus,
  OutlineSlotType,
} from '../types/shenlun';
import { extractDeepMaterialAnalysis } from '../utils/materialExtractor';

interface SourceMiningWorkspaceProps {
  existingCardCount: number;
  onSaveCustomCard: (card: ArgumentCard) => void;
  onAddOutlineItem: (
    slotType: OutlineSlotType,
    title: string,
    content: string,
    sourceRef: string
  ) => void;
  onNavigateTab: (tab: 'arguments' | 'scope') => void;
}

type MiningOutputTab = 'terms' | 'angles' | 'subq' | 'card';

const FOCUS_OPTIONS: { id: ExtractionFocus; label: string }[] = [
  { id: 'balanced', label: '全维度提炼' },
  { id: 'problem', label: '侧重痛点归因' },
  { id: 'action', label: '侧重对策路径' },
  { id: 'elevation', label: '侧重思辨拔高' },
];

export const SourceMiningWorkspace: React.FC<SourceMiningWorkspaceProps> = ({
  existingCardCount,
  onSaveCustomCard,
  onAddOutlineItem,
  onNavigateTab,
}) => {
  const [sourceText, setSourceText] = useState(SAMPLE_SOURCE_MATERIALS[0].text);
  const [sourceViewMode, setSourceViewMode] = useState<'annotated' | 'edit'>('annotated');
  const [outputTab, setOutputTab] = useState<MiningOutputTab>('terms');
  const [focus, setFocus] = useState<ExtractionFocus>('balanced');
  const [customTitle, setCustomTitle] = useState('');
  const [editedThesis, setEditedThesis] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedCardNotice, setSavedCardNotice] = useState(false);

  const activeSample = SAMPLE_SOURCE_MATERIALS.find((s) => s.text === sourceText);

  const analysis = useMemo(() => {
    if (sourceText.trim().length < 20) return null;
    return extractDeepMaterialAnalysis(
      sourceText,
      focus,
      customTitle,
      existingCardCount + 1
    );
  }, [sourceText, focus, customTitle, existingCardCount]);

  const effectiveThesis =
    editedThesis !== null
      ? editedThesis
      : analysis?.generatedCard.coreThesis || '';

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 1600);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleLoadSample = (text: string) => {
    setSourceText(text);
    setCustomTitle('');
    setEditedThesis(null);
    setSavedCardNotice(false);
  };

  const handleSaveAngleAsCard = (
    angleIndex: number,
    angleName: string,
    examLevel: string,
    thesis: string,
    subPoints: string[]
  ) => {
    if (!analysis) return;
    const card: ArgumentCard = {
      ...analysis.generatedCard,
      id: `custom-${Date.now()}-${angleIndex}`,
      examLevel,
      title: `${analysis.themeLabel} · ${angleName.split('·')[1]?.trim() || angleName}`,
      coreThesis: thesis,
      subArguments: subPoints,
    };
    onSaveCustomCard(card);
    setCopiedKey(`saved-angle-${angleIndex}`);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSaveEditedCard = () => {
    if (!analysis) return;
    onSaveCustomCard({
      ...analysis.generatedCard,
      id: `custom-${Date.now()}`,
      coreThesis: effectiveThesis,
    });
    setSavedCardNotice(true);
    setTimeout(() => setSavedCardNotice(false), 2000);
  };

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D8]">
          <div>
            <p className="text-xs tracking-widest text-[#78716C] mb-2">
              原材料价值深挖工坊 · 一材多用工作台
            </p>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1C1917] leading-tight text-balance">
              把一份给定资料的价值吃干榨净：从原词转换到多角度立意
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#44403C] max-w-[68ch] leading-relaxed">
              申论高分的关键不在于背多少外部名言，而在于从原材料中挖出「规范表达 + 小题要点 + 多元立意 + 压缩事例」。切换左侧示例或粘贴你的资料，右侧即时完成四维拆解。
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('arguments')}
              className="px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-white border border-[#D6D0C4] rounded-md hover:border-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              查看全部论点卡片
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('scope')}
              className="px-3.5 py-2 text-xs font-medium text-[#9F2B22] bg-white border border-[#E5E0D8] rounded-md hover:border-[#9F2B22] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              能力边界说明
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT ZONE: Source Material Input & Annotated Reader */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-[#1C1917]">
                  1. 选择真题风给定资料或粘贴个人材料
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSourceText('');
                    setSourceViewMode('edit');
                    setEditedThesis(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>清空自填</span>
                </button>
              </div>

              <div className="space-y-2">
                {SAMPLE_SOURCE_MATERIALS.map((sample) => {
                  const isActive = sourceText === sample.text;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample.text)}
                      className={`w-full text-left p-3 rounded-md border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white border-[#1E3A8A]'
                          : 'bg-[#F2EFE9]/60 border-[#E5E0D8] hover:bg-white hover:border-[#C7BFB3]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#1C1917]">
                        {sample.title}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-1">
                        {sample.examContext} · 适用：{sample.applicableQuestionTypes}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-[#F2EFE9]/70 border-b border-[#E5E0D8] flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-[#1C1917]">
                  给定资料原文（<span className="font-mono-num">{sourceText.length}</span> 字）
                </div>
                <div className="inline-flex items-center p-0.5 bg-[#E8E3D9] rounded">
                  <button
                    type="button"
                    onClick={() => setSourceViewMode('annotated')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded cursor-pointer ${
                      sourceViewMode === 'annotated'
                        ? 'bg-white text-[#1C1917]'
                        : 'text-[#57534E]'
                    }`}
                  >
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    <span>信号标注透视</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceViewMode('edit')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded cursor-pointer ${
                      sourceViewMode === 'edit'
                        ? 'bg-white text-[#1C1917]'
                        : 'text-[#57534E]'
                    }`}
                  >
                    <FileEdit className="w-3 h-3" aria-hidden="true" />
                    <span>粘贴 / 编辑原文</span>
                  </button>
                </div>
              </div>

              {sourceViewMode === 'edit' || sourceText.trim().length < 20 ? (
                <textarea
                  rows={12}
                  value={sourceText}
                  onChange={(e) => {
                    setSourceText(e.target.value);
                    setEditedThesis(null);
                  }}
                  placeholder="请粘贴你的申论给定资料、调研报道或政策文本（建议50字以上），系统将自动高亮痛点、做法与成效，并提炼规范词与多角度立意…"
                  aria-label="给定资料原文输入"
                  className="w-full p-4 text-sm leading-[1.8] text-[#1C1917] bg-white focus:outline-none placeholder:text-[#A8A29E]"
                />
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-[11px] pb-2.5 border-b border-[#F0ECE3]">
                    <span className="font-medium text-[#9F2B22]">[痛点/问题句]</span>
                    <span className="font-medium text-[#1E3A8A]">[对策/做法句]</span>
                    <span className="font-medium text-[#14532D]">[成效/实证句]</span>
                  </div>

                  <div className="space-y-2.5 text-sm leading-[1.8] text-[#292524]">
                    {analysis?.annotatedSentences.map((sent, idx) => {
                      const tagLabel =
                        sent.signal === 'problem'
                          ? '痛点'
                          : sent.signal === 'action'
                            ? '做法'
                            : sent.signal === 'outcome'
                              ? '成效'
                              : null;

                      const colorClass =
                        sent.signal === 'problem'
                          ? 'bg-[#9F2B22]/8 text-[#1C1917]'
                          : sent.signal === 'action'
                            ? 'bg-[#1E3A8A]/8 text-[#1C1917]'
                            : sent.signal === 'outcome'
                              ? 'bg-[#14532D]/8 text-[#1C1917]'
                              : '';

                      const tagColor =
                        sent.signal === 'problem'
                          ? 'text-[#9F2B22]'
                          : sent.signal === 'action'
                            ? 'text-[#1E3A8A]'
                            : 'text-[#14532D]';

                      return (
                        <p key={idx} className={`px-2.5 py-1.5 rounded ${colorClass}`}>
                          {tagLabel && (
                            <span className={`font-mono-num text-[11px] font-semibold mr-2 ${tagColor}`}>
                              [{tagLabel}]
                            </span>
                          )}
                          <span>{sent.text}。</span>
                        </p>
                      );
                    })}
                  </div>

                  {activeSample && (
                    <div className="pt-3 border-t border-[#F0ECE3] text-xs text-[#78716C]">
                      提示：点击右上角「粘贴 / 编辑原文」即可随时替换为自己的资料文本。
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ZONE: 4-Dimension Value Output */}
          <div className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-lg">
            {!analysis ? (
              <div className="p-12 text-center">
                <Sparkles className="w-8 h-8 text-[#78716C] mx-auto mb-3" aria-hidden="true" />
                <p className="font-editorial text-lg font-semibold text-[#1C1917]">
                  等待材料输入以开启四维深挖
                </p>
                <p className="text-sm text-[#78716C] mt-1">
                  请在左侧选择一份示例材料，或粘贴至少 20 字以上的原文内容。
                </p>
              </div>
            ) : (
              <div>
                <div className="px-6 py-4 bg-[#F8F6F2] border-b border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-semibold text-[#9F2B22]">
                      识别主领域：{analysis.themeLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>核心词：{analysis.keywords.join(' / ')}</span>
                  </div>
                  <div className="text-xs text-[#78716C]">
                    一材四维产出：规范词 · 三立意 · 小题点 · 压缩事例
                  </div>
                </div>

                <div
                  role="tablist"
                  aria-label="原材料价值提取维度"
                  className="px-6 pt-4 border-b border-[#E5E0D8] flex items-center gap-2 overflow-x-auto"
                >
                  {[
                    { id: 'terms' as const, label: '1. 大白话转规范词' },
                    { id: 'angles' as const, label: '2. 一材三角度立意' },
                    { id: 'subq' as const, label: '3. 小题采分要点' },
                    { id: 'card' as const, label: '4. 案例压缩与存卡' },
                  ].map((tab) => {
                    const active = outputTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setOutputTab(tab.id)}
                        className={`px-3.5 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                            : 'text-[#57534E] border-transparent hover:text-[#1C1917]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-6">
                  {outputTab === 'terms' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                          口语/事例描述 → 申论阅卷规范采分词
                        </h3>
                        <p className="text-xs text-[#78716C] mt-1">
                          申论评分最忌“照抄材料大白话”。下表将原材中的具体现象提炼为可直接落纸的政策规范表达：
                        </p>
                      </div>

                      <div className="divide-y divide-[#E5E0D8] border-t border-b border-[#E5E0D8]">
                        {analysis.termConversions.map((item, idx) => (
                          <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="text-xs text-[#78716C]">
                                原材大白话：{item.vernacular}
                              </div>
                              <div className="text-[15px] font-semibold text-[#1C1917]">
                                规范表达：{item.officialTerm}
                              </div>
                              <div className="text-xs text-[#57534E]">
                                适用位置：{item.usageContext}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCopy(`term-${idx}`, item.officialTerm)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded hover:border-[#1C1917] cursor-pointer"
                              >
                                {copiedKey === `term-${idx}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#14532D]" aria-hidden="true" />
                                    <span>已复制</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>复制词条</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onAddOutlineItem(
                                    '分论点',
                                    '规范表达摘录',
                                    item.officialTerm,
                                    '原材规范词转化'
                                  );
                                  setCopiedKey(`term-add-${idx}`);
                                  setTimeout(() => setCopiedKey(null), 1500);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#1E3A8A] border border-[#1E3A8A]/30 rounded hover:bg-[#1E3A8A]/5 cursor-pointer"
                              >
                                {copiedKey === `term-add-${idx}` ? '已入提纲' : '+ 提纲'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {outputTab === 'angles' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                          同一份资料，拆出三种不同考场立意方向
                        </h3>
                        <p className="text-xs text-[#78716C] mt-1">
                          申论大作文通常“立意不唯一”，需结合题干指令（如侧重基层服务 vs 侧重思维辩证）选择最契合的一套论点框架：
                        </p>
                      </div>

                      <div className="divide-y divide-[#E5E0D8] border-t border-[#E5E0D8]">
                        {analysis.multiAngles.map((ang, idx) => (
                          <div key={idx} className="py-5 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="text-sm font-bold text-[#9F2B22]">
                                {ang.angleName}
                              </div>
                              <div className="text-xs text-[#78716C]">{ang.examLevel}</div>
                            </div>

                            <p className="text-[15px] font-semibold text-[#1C1917] leading-relaxed">
                              总论点：{ang.thesis}
                            </p>

                            <ol className="space-y-1.5 text-sm text-[#44403C]">
                              {ang.subPoints.map((sp, sIdx) => (
                                <li key={sIdx} className="flex items-baseline gap-2">
                                  <span className="font-mono-num text-xs text-[#78716C]">
                                    0{sIdx + 1}
                                  </span>
                                  <span>{sp}</span>
                                </li>
                              ))}
                            </ol>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <span className="text-xs text-[#57534E]">
                                选型提示：{ang.fitReason}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSaveAngleAsCard(
                                      idx,
                                      ang.angleName,
                                      ang.examLevel,
                                      ang.thesis,
                                      ang.subPoints
                                    )
                                  }
                                  className="px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#F8F6F2] border border-[#D6D0C4] rounded hover:border-[#1C1917] cursor-pointer"
                                >
                                  {copiedKey === `saved-angle-${idx}` ? '已存入论点卡片' : '存为论点卡'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onAddOutlineItem(
                                      '总论点',
                                      ang.angleName,
                                      ang.thesis,
                                      '一材三立意'
                                    );
                                    ang.subPoints.forEach((p, i) =>
                                      onAddOutlineItem(
                                        '分论点',
                                        `分论点 ${i + 1}`,
                                        p,
                                        ang.angleName
                                      )
                                    );
                                    setCopiedKey(`outline-angle-${idx}`);
                                    setTimeout(() => setCopiedKey(null), 1600);
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#1E3A8A] rounded hover:bg-[#172554] cursor-pointer"
                                >
                                  {copiedKey === `outline-angle-${idx}` ? '整套已入提纲' : '整套导入提纲'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {outputTab === 'subq' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                          小题作答要点拆解（归纳概括 / 综合分析 / 提出对策）
                        </h3>
                        <p className="text-xs text-[#78716C] mt-1">
                          同一篇资料既是大作文素材库，也是前三道小题的直接采分源：
                        </p>
                      </div>

                      <div className="space-y-4 divide-y divide-[#E5E0D8] border-t border-[#E5E0D8]">
                        <div className="pt-4">
                          <div className="text-xs font-semibold text-[#9F2B22] mb-2">
                            一、问题与痛点清单（归纳概括题核心）
                          </div>
                          <ul className="space-y-1.5 text-sm text-[#292524]">
                            {analysis.subQuestionPoints.problems.map((p, i) => (
                              <li key={i} className="flex items-baseline gap-2">
                                <span className="font-mono-num text-xs text-[#78716C]">0{i + 1}</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <div className="text-xs font-semibold text-[#1C1917] mb-2">
                            二、深层原因归因（综合分析题推进）
                          </div>
                          <ul className="space-y-1.5 text-sm text-[#44403C]">
                            {analysis.subQuestionPoints.causes.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <div className="text-xs font-semibold text-[#1E3A8A] mb-2">
                            三、直接对策与经验做法（提出对策 / 经验启示题）
                          </div>
                          <ul className="space-y-1.5 text-sm text-[#292524]">
                            {analysis.subQuestionPoints.actions.map((a, i) => (
                              <li key={i} className="flex items-baseline gap-2">
                                <span className="font-mono-num text-xs text-[#78716C]">0{i + 1}</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <div className="text-xs font-semibold text-[#14532D] mb-2">
                            四、成效与结果呈现
                          </div>
                          <ul className="space-y-1.5 text-sm text-[#292524]">
                            {analysis.subQuestionPoints.outcomes.map((o, i) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {outputTab === 'card' && (
                    <div className="space-y-5">
                      <div className="pb-4 border-b border-[#E5E0D8]">
                        <div className="text-xs font-semibold text-[#1C1917] mb-1.5">
                          自动生成的考场 70 字压缩实证案例
                        </div>
                        <p className="text-sm leading-[1.8] text-[#1C1917] bg-[#F8F6F2] p-4 rounded border border-[#E5E0D8]">
                          {analysis.compressedCase}
                        </p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy('comp-case', analysis.compressedCase)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-white border border-[#D6D0C4] rounded hover:border-[#1C1917] cursor-pointer"
                          >
                            {copiedKey === 'comp-case' ? '已复制压缩案例' : '复制案例文本'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onAddOutlineItem(
                                '案例支撑',
                                `${analysis.themeLabel}原材压缩事例`,
                                analysis.compressedCase,
                                '原材深挖工坊'
                              );
                              setCopiedKey('comp-add');
                              setTimeout(() => setCopiedKey(null), 1500);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#1E3A8A] border border-[#1E3A8A]/30 rounded hover:bg-[#1E3A8A]/5 cursor-pointer"
                          >
                            {copiedKey === 'comp-add' ? '已加入提纲' : '+ 案例入提纲'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-[#1C1917]">
                          微调并保存至「论点卡片」矩阵
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {FOCUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setFocus(opt.id);
                                setEditedThesis(null);
                              }}
                              className={`px-3 py-1 text-xs font-medium rounded border cursor-pointer ${
                                focus === opt.id
                                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                                  : 'bg-[#F8F6F2] text-[#57534E] border-[#E5E0D8]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label htmlFor="mining-card-title" className="block text-xs text-[#78716C] mb-1">
                            卡片标题
                          </label>
                          <input
                            id="mining-card-title"
                            type="text"
                            value={customTitle || analysis.generatedCard.title}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            className="w-full px-3 py-2 text-sm font-bold font-editorial bg-[#F8F6F2] border border-[#D6D0C4] rounded focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
                          />
                        </div>

                        <div>
                          <label htmlFor="mining-card-thesis" className="block text-xs text-[#78716C] mb-1">
                            总论点表述
                          </label>
                          <textarea
                            id="mining-card-thesis"
                            rows={3}
                            value={effectiveThesis}
                            onChange={(e) => setEditedThesis(e.target.value)}
                            className="w-full px-3 py-2 text-sm leading-relaxed bg-[#F8F6F2] border border-[#D6D0C4] rounded focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={handleSaveEditedCard}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172554] cursor-pointer"
                          >
                            {savedCardNotice ? (
                              <>
                                <Check className="w-4 h-4" aria-hidden="true" />
                                <span>已保存至论点卡片</span>
                              </>
                            ) : (
                              <>
                                <Layers className="w-4 h-4" aria-hidden="true" />
                                <span>保存为专属论点卡片</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onAddOutlineItem(
                                '总论点',
                                customTitle || analysis.generatedCard.title,
                                effectiveThesis,
                                '原材深挖自定义'
                              );
                              setCopiedKey('custom-out');
                              setTimeout(() => setCopiedKey(null), 1600);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1C1917] bg-white border border-[#D6D0C4] rounded-md hover:border-[#1C1917] cursor-pointer"
                          >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                            <span>{copiedKey === 'custom-out' ? '已收入提纲' : '仅送入提纲'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
