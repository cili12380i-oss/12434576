import React, { useState } from 'react';
import { BookOpen, CheckSquare, Square } from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data/shenlunCorpus';
import { WorkspaceTabId } from '../types/shenlun';

interface ScopeAssessmentSectionProps {
  onNavigateTab: (tab: WorkspaceTabId) => void;
}

const CHECKLIST_ITEMS = [
  {
    id: 'chk-1',
    title: '题干限定词已核对',
    detail: '确认“给定资料中某句话/某个案例”在题干中的真实指向，而非直接照搬卡片里的现成标题。',
  },
  {
    id: 'chk-2',
    title: '总论点回应了材料核心矛盾',
    detail: '检查你的总论点是否至少涵盖给定资料中 2 个以上关键主体或核心矛盾，避免单点偏题。',
  },
  {
    id: 'chk-3',
    title: '分论点之间保持并列或递进清晰',
    detail: '确保三个分论点维度不交叉重复（如避免同时写“思想意识”和“观念转变”两个同义分论点）。',
  },
  {
    id: 'chk-4',
    title: '原材事例已完成规范词转化',
    detail: '不整段抄袭材料原始故事，而是将大白话案例压缩为“主体 + 做法 + 成效”的 70 字以内精炼例证。',
  },
  {
    id: 'chk-5',
    title: '兼顾“本材料事实 + 外部适度印证”',
    detail: '先立足给定资料内部案例做扎实，再辅以 1–2 个「压缩实证案例馆」的跨地区典型案例，避免全篇脱离给定材料。',
  },
];

export const ScopeAssessmentSection: React.FC<ScopeAssessmentSectionProps> = ({
  onNavigateTab,
}) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({
    'chk-1': true,
  });
  const [imgError, setImgError] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedIds).filter(Boolean).length;

  return (
    <section className="py-10 lg:py-12">
      <div className="max-w-[1200px] mx-auto px-6 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-[#E5E0D8] items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div>
              <p className="text-xs tracking-widest text-[#78716C] mb-2">
                适用范围评估与写作自查清单
              </p>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] text-balance">
                诚实评估本工具的适用边界：什么能直接用，什么必须人工微调
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#57534E] max-w-[62ch] leading-relaxed">
                好的备考工具不把“万能模板”包装成考场答案。清楚了解每类资料的适用考级、题型边界与局限，再结合材料本身做针对性落笔，才能真正写出不跑题的高分申论。
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E0D8] grid grid-cols-3 gap-4">
              <div>
                <div className="font-mono-num text-lg font-semibold text-[#14532D]">一级强适配</div>
                <div className="text-xs text-[#57534E] mt-0.5">五段三分式议论文与材料提炼</div>
              </div>
              <div>
                <div className="font-mono-num text-lg font-semibold text-[#B45309]">二级需微调</div>
                <div className="text-xs text-[#57534E] mt-0.5">公文格式与副省级思辨命题</div>
              </div>
              <div>
                <div className="font-mono-num text-lg font-semibold text-[#9F2B22]">三级不适用</div>
                <div className="text-xs text-[#57534E] mt-0.5">纯法条实务与精确统计填空</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <figure className="relative w-full min-h-[210px] lg:h-full rounded-lg overflow-hidden border border-[#E5E0D8] bg-[#EDE9E0]">
              {!imgError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="申论策论研习案头稿纸"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="w-7 h-7 text-[#78716C] mb-2" aria-hidden="true" />
                  <p className="font-editorial text-base font-semibold text-[#1C1917]">
                    审题立意 · 量体裁衣
                  </p>
                </div>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 py-3">
                <p className="text-xs text-white/90">
                  先审题定边界，再从资料提取骨架，最后补入精准素材。
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* 3-Tier Scope Evaluation Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 space-y-4">
            <div className="text-xs font-semibold text-[#14532D]">
              一级强适配 · 可直接套用骨架
            </div>
            <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
              五段三分式议论文 / 策论文
            </h2>
            <ul className="space-y-2.5 text-sm text-[#44403C] leading-relaxed">
              <li>1. 国考地市级、省考联考、选调生考试大作文立意构建与分论点搭建。</li>
              <li>2. 六大常考主题域：基层治理、新质生产力、生态文明、文化传承、乡村振兴、民生青年。</li>
              <li>3. 材料阅读提速：通过「原材深挖」将口语故事快速转为规范采分词与概括要点。</li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigateTab('mining')}
              className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
            >
              前往「原材深挖」体验 →
            </button>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 space-y-4">
            <div className="text-xs font-semibold text-[#B45309]">
              二级有限适配 · 需结合题干微调
            </div>
            <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
              贯彻执行公文 & 地方省情卷
            </h2>
            <ul className="space-y-2.5 text-sm text-[#44403C] leading-relaxed">
              <li>1. 倡议书、调研报告、发言提纲等应用文：本库仅提供主体论点与对策表达，抬头、称谓、落款与特定行文语气须按公文规范补齐。</li>
              <li>2. 高度思辨的国考副省级哲学题（如“有与无”“快与慢”）：需结合题目特定隐喻，优先使用卡片中的「辩证升华」视角而非生硬套用对策。</li>
              <li>3. 跨省省考须将案例主语替换为题干所在省份或具体市县语境。</li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigateTab('arguments')}
              className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
            >
              筛选「辩证升华」论点卡 →
            </button>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 space-y-4">
            <div className="text-xs font-semibold text-[#9F2B22]">
              三级不适用 · 勿强行硬套
            </div>
            <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
              纯法条实务与专业时政填空
            </h2>
            <ul className="space-y-2.5 text-sm text-[#44403C] leading-relaxed">
              <li>1. 行政执法类试卷中严格依赖具体法律条款编号、执法程序时限的实务问答。</li>
              <li>2. 依赖最新年度政府工作报告精确统计数字或特定专有名词的客观填空题。</li>
              <li>3. 「原材深挖」基于中文政策信号词库与句法规则运行，面对极具文学隐喻或反讽语气的长篇散文材料时，仍需人工做主题定调。</li>
            </ul>
          </div>
        </div>

        {/* Interactive Pre-Writing Self-Check Rubric */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E0D8]">
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
                动笔前 5 步审题与选卡自查清单
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1">
                在组装完「写作提纲」准备落笔前，建议逐项核对以下五点，防止“论点很漂亮但偏离给定材料”。
              </p>
            </div>
            <div className="font-mono-num text-sm font-semibold text-[#1E3A8A] shrink-0">
              已完成自查：{completedCount} / {CHECKLIST_ITEMS.length}
            </div>
          </div>

          <div className="divide-y divide-[#F0ECE3]">
            {CHECKLIST_ITEMS.map((item) => {
              const checked = !!checkedIds[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className="w-full text-left py-4 flex items-start gap-3.5 hover:bg-[#FAF8F5] px-2 -mx-2 rounded transition-colors cursor-pointer"
                >
                  {checked ? (
                    <CheckSquare
                      className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Square
                      className="w-5 h-5 text-[#A8A29E] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        checked ? 'text-[#1C1917]' : 'text-[#44403C]'
                      }`}
                    >
                      {item.title}
                    </div>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
