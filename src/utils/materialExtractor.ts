import {
  AnnotatedSentence,
  ArgumentCard,
  DeepExtractionResult,
  ExcludeAllThemeId,
  ExtractionFocus,
  MultiAngleThesis,
  TermConversion,
} from '../types/shenlun';

interface ThemeRule {
  id: ExcludeAllThemeId;
  label: string;
  keywords: string[];
  elevationTemplate: string;
}

const THEME_RULES: ThemeRule[] = [
  {
    id: 'governance',
    label: '基层治理',
    keywords: ['社区', '基层', '网格', '群众', '居民', '治理', '服务', '减负', '议事', '热线', '老人', '政务', '平台', '协同', '门禁'],
    elevationTemplate: '基层治理现代化归根结底是人的现代化，唯有兼顾效率精度与民生温度，方能绘就共建共治共享的幸福画卷。',
  },
  {
    id: 'innovation',
    label: '新质生产力',
    keywords: ['创新', '科技', '制造', '产业', '企业', '数字', '智能', '研发', '转型', '人才', '资金', '技术', '平台', '工匠', '良品率'],
    elevationTemplate: '向“新”而行、以“质”致远，本质是通过要素重组与制度护航，推动发展逻辑从规模速度向质量效益跃升。',
  },
  {
    id: 'rural',
    label: '乡村振兴',
    keywords: ['乡村', '农村', '农业', '农民', '乡土', '返乡', '农人', '村集体', '致富', '茶', '电商', '冷链', '文旅', '村'],
    elevationTemplate: '乡村振兴既要塑形更要铸魂，唯有做强特色产业、畅通要素循环，方能让广袤乡土成为安居乐业的希望田野。',
  },
  {
    id: 'ecology',
    label: '生态文明',
    keywords: ['生态', '绿色', '环保', '低碳', '碳汇', '污染', '森林', '山水', '能源', '保护', '红线', '自然'],
    elevationTemplate: '人不负青山，青山定不负人；打通生态价值转化通道，方能实现生态颜值与百姓富足的双向奔赴。',
  },
  {
    id: 'culture',
    label: '文化传承',
    keywords: ['文化', '非遗', '传统', '文物', '遗产', '古村', '文创', '精神', '记忆', '历史', '书屋', '美学'],
    elevationTemplate: '守正不守旧、尊古不复古，让传统文化在当代日常烟火中活态延续，是一个民族最深沉的文化自信。',
  },
  {
    id: 'livelihood',
    label: '民生青年',
    keywords: ['青年', '就业', '创业', '养老', '托育', '医疗', '教育', '保障', '劳动者', '工资', '安居', '民生', '大学生'],
    elevationTemplate: '民生无小事，枝叶总关情；制度托举与个人奋斗双向奔赴，是社会保持持久生机的源头活水。',
  },
];

const VERNACULAR_DICTIONARY: {
  triggers: string[];
  vernacular: string;
  officialTerm: string;
  usageContext: string;
}[] = [
  {
    triggers: ['验证码', '拦在门外', '智能', '老年人'],
    vernacular: '老人记不住验证码、被智能门禁拦在门外',
    officialTerm: '“数字鸿沟”凸显，公共服务适老化改造滞后',
    usageContext: '适用于概括题痛点与大作文“效率与温度”段破题',
  },
  {
    triggers: ['重复填报', '政务App', '耗时', '入户走访时间'],
    vernacular: '多个App重复填表拍照，占用入户时间',
    officialTerm: '“指尖形式主义”与多头填报加重基层负担，挤占一线服务精力',
    usageContext: '适用于基层减负专题概括与提出对策依据',
  },
  {
    triggers: ['重设备轻体验', '实体刷卡', '双通道'],
    vernacular: '改掉只买设备不顾体验，恢复刷卡和人工值守',
    officialTerm: '纠偏唯技术论，坚持传统兜底与数字赋能“两条腿走路”',
    usageContext: '适用于大作文辩证段与经验启示类小题',
  },
  {
    triggers: ['院落议事会', '自己投票', '改建'],
    vernacular: '居民投票决定闲置车棚怎么改',
    officialTerm: '健全基层协商民主机制，变“政府端菜”为“群众点菜”',
    usageContext: '适用于归纳概括群众路线与共建共治共享分论点',
  },
  {
    triggers: ['一次录入', '数据壁垒', '自动分发'],
    vernacular: '打通数据壁垒、一次录入自动分发',
    officialTerm: '破除部门“信息孤岛”，以数据共享赋能基层减负增效',
    usageContext: '适用于提出对策题“数字化治理”标准采分表达',
  },
  {
    triggers: ['有好茶', '无名气', '卖不上价', '单打独斗'],
    vernacular: '有好茶却没名气、茶农单打独斗卖不上价',
    officialTerm: '农产品品牌化程度低、产业链小散弱，同质化竞争突出',
    usageContext: '适用于乡村振兴概括问题与产业升级背景剖析',
  },
  {
    triggers: ['保底收购', '二次分红', '担风险'],
    vernacular: '怕改种担风险，推出保底收购加二次分红',
    officialTerm: '健全联农带农利益联结机制，增强小农户抗风险能力',
    usageContext: '适用于“农村产业融合/农民增收”小题核心采分点',
  },
  {
    triggers: ['返乡', '新农人', '硕士'],
    vernacular: '农学硕士和大学生返乡创业做深加工和研学',
    officialTerm: '吸引专业化“新农人”回流，推动农文旅三产深度融合',
    usageContext: '适用于人才振兴与土特产延链增值案例论证',
  },
  {
    triggers: ['不敢投', '不会用', '资金链', '一刀切'],
    vernacular: '改造成本高不敢投、老师傅不会用系统',
    officialTerm: '中小企业转型试错门槛高、复合型数字技能人才结构性短缺',
    usageContext: '适用于工业“智改数转”原因分析与经济类大作文痛点段',
  },
  {
    triggers: ['轻量级', '模块化', '夜校', '容错'],
    vernacular: '按需付费的轻量工具、开办夜校、设容错基金',
    officialTerm: '搭建公共服务平台降低转型门槛，以技能重塑与容错机制护航创新',
    usageContext: '适用于“有为政府精准施策”对策题与副省级策论文分论点',
  },
];

const PROBLEM_MARKERS = [
  '然而', '但是', '却', '困境', '难题', '痛点', '顾虑', '不敢', '不会', '不愿',
  '重复', '形式', '压缩', '闲置', '流失', '冲突', '盲目', '短板', '不足', '压力',
  '拦在门外', '卖不上价', '单打独斗', '重设备轻体验', '耗时',
];
const ACTION_MARKERS = [
  '为此', '一方面', '另一方面', '同时', '通过', '建立', '推出', '搭建', '联合',
  '打通', '恢复', '改建', '设立', '开展', '引导', '优化', '完善', '坚持', '推动',
  '成立', '开设', '协调', '叫停',
];
const VALUE_MARKERS = [
  '如今', '证明', '实现', '提升', '缩短', '翻了', '吸引', '串联', '赋能', '共享',
  '温暖', '收获', '成效', '省出', '良品率', '翻了两番',
];

function splitChineseSentences(text: string): string[] {
  return text
    .split(/[。！？；\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 6);
}

function detectTheme(text: string): ThemeRule {
  let bestRule = THEME_RULES[0];
  let maxHits = -1;

  for (const rule of THEME_RULES) {
    let hits = 0;
    for (const kw of rule.keywords) {
      const regex = new RegExp(kw, 'g');
      const matches = text.match(regex);
      if (matches) hits += matches.length;
    }
    if (hits > maxHits) {
      maxHits = hits;
      bestRule = rule;
    }
  }
  return bestRule;
}

function extractTopKeywords(text: string, rule: ThemeRule): string[] {
  const candidates = new Set<string>();
  for (const kw of rule.keywords) {
    if (text.includes(kw)) candidates.add(kw);
  }
  const quotedMatches = text.match(/“([^”]{2,10})”/g);
  if (quotedMatches) {
    for (const q of quotedMatches) {
      const clean = q.replace(/[“”]/g, '').trim();
      if (clean.length >= 2 && clean.length <= 8) candidates.add(clean);
    }
  }
  const result = Array.from(candidates).slice(0, 5);
  return result.length > 0 ? result : ['制度创新', '精准施策', '协同共治'];
}

function classifySentence(s: string): AnnotatedSentence['signal'] {
  const pScore = PROBLEM_MARKERS.filter((m) => s.includes(m)).length;
  const aScore = ACTION_MARKERS.filter((m) => s.includes(m)).length;
  const oScore = VALUE_MARKERS.filter((m) => s.includes(m)).length;

  if (oScore > 0 && oScore >= pScore && oScore >= aScore) return 'outcome';
  if (pScore > 0 && pScore >= aScore) return 'problem';
  if (aScore > 0) return 'action';
  return 'neutral';
}

function compactSummary(sentence: string, maxLen = 76): string {
  const cleaned = sentence
    .replace(/^(然而|但是|为此|同时|如今|此外|一方面|另一方面)[，,、\s]*/, '')
    .trim();
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen)}…`;
}

function extractTermConversions(
  text: string,
  problemQuotes: string[],
  actionQuotes: string[]
): TermConversion[] {
  const matched: TermConversion[] = [];
  for (const entry of VERNACULAR_DICTIONARY) {
    const hitCount = entry.triggers.filter((t) => text.includes(t)).length;
    if (hitCount >= 2 || (entry.triggers.length <= 3 && hitCount >= 1 && text.includes(entry.triggers[0]))) {
      matched.push({
        vernacular: entry.vernacular,
        officialTerm: entry.officialTerm,
        usageContext: entry.usageContext,
      });
    }
  }

  if (matched.length >= 2) return matched.slice(0, 5);

  const fallback: TermConversion[] = [...matched];
  if (problemQuotes[0]) {
    fallback.push({
      vernacular: compactSummary(problemQuotes[0], 30),
      officialTerm: '核心执行梗阻与供需错位问题亟待破除',
      usageContext: '适用于概括问题要点及破题段痛点引出',
    });
  }
  if (actionQuotes[0]) {
    fallback.push({
      vernacular: compactSummary(actionQuotes[0], 30),
      officialTerm: '精准化机制供给与多元主体协同发力',
      usageContext: '适用于提出对策题及策论文主体段做法提炼',
    });
  }
  if (actionQuotes[1]) {
    fallback.push({
      vernacular: compactSummary(actionQuotes[1], 30),
      officialTerm: '制度松绑赋能与长效保障体系构建',
      usageContext: '适用于第三分论点长效机制深化',
    });
  }
  return fallback;
}

export function extractDeepMaterialAnalysis(
  rawText: string,
  focus: ExtractionFocus,
  customTitle?: string,
  nextIndexNumber = 9
): DeepExtractionResult {
  const sentences = splitChineseSentences(rawText);
  const theme = detectTheme(rawText);
  const keywords = extractTopKeywords(rawText, theme);

  const annotatedSentences: AnnotatedSentence[] = sentences.map((s) => ({
    text: s,
    signal: classifySentence(s),
  }));

  const problemQuotes = annotatedSentences
    .filter((a) => a.signal === 'problem')
    .map((a) => a.text);
  const actionQuotes = annotatedSentences
    .filter((a) => a.signal === 'action')
    .map((a) => a.text);
  const outcomeQuotes = annotatedSentences
    .filter((a) => a.signal === 'outcome')
    .map((a) => a.text);

  const problems =
    problemQuotes.length > 0
      ? problemQuotes.slice(0, 4).map((s) => compactSummary(s, 52))
      : ['部分环节存在重形式轻实效、供需对接不够精准的短板。'];

  const causes = [
    `深层症结一（观念与导向）：未充分立足一线真实场景与群众/企业承受力，存在一定“一刀切”或重短期表象倾向。`,
    `深层症结二（机制与要素）：跨部门协同与资源要素（数据、资金、技能培训）尚未完全打通，内生抗风险与支撑机制不足。`,
  ];

  const actions =
    actionQuotes.length > 0
      ? actionQuotes.slice(0, 4).map((s) => compactSummary(s, 56))
      : [`围绕${keywords[0] || theme.label}搭建精准化公共服务与协商平台，降低试错与沟通门槛。`];

  const outcomes =
    outcomeQuotes.length > 0
      ? outcomeQuotes.slice(0, 3).map((s) => compactSummary(s, 54))
      : [`推动问题从根源化解，实现效率提升、主体增收与群众满意度的同步跃升。`];

  const termConversions = extractTermConversions(rawText, problemQuotes, actionQuotes);

  const kw1 = keywords[0] || theme.label;
  const kw2 = keywords[1] || '机制创新';
  const kw3 = keywords[2] || '精准赋能';

  const multiAngles: MultiAngleThesis[] = [
    {
      angleName: '角度一 · 治理精度与机制协同（稳妥高分）',
      examLevel: '国考地市级 / 省考通用',
      thesis: `推动${theme.label}提质增效，关键在于破除“${kw1}”落地梗阻，以精准施策、多方协同与机制赋能实现长效发展。`,
      subPoints: [
        `坚持问题导向与需求本位，围绕“${problems[0].slice(0, 20)}”精准补短板。`,
        `打通协同与要素壁垒，落实“${actions[0].slice(0, 22)}”等务实抓手。`,
        `完善考核减负与长效保障机制，让基层/一线主体轻装上阵。`,
      ],
      fitReason: '紧扣材料原本做法脉络，三层递进最稳妥，不容易跑题。',
    },
    {
      angleName: '角度二 · 效率与温度的平衡（思辨加分）',
      examLevel: '国考副省级 / 哲学思辨题',
      thesis: `${theme.label}的现代化既要有技术与制度推进的“加速度”，更要守住兼顾普通人切身感受的“温暖度”。`,
      subPoints: [
        `拒绝“重硬件轻体验”的形式主义，让发展成果真正可感可及。`,
        `坚持“两条腿走路”，以包容性设计与兜底机制托住薄弱群体。`,
        `在共建共治共享中凝聚人心，实现物理空间升级与人文归属感同频共振。`,
      ],
      fitReason: '当题干出现“速度与温度”“快与慢”“技术与人心”时，此立意能显著拉开档次。',
    },
    {
      angleName: '角度三 · 内生动力与长期主义（破局深化）',
      examLevel: '选调生 / 产业与乡村专题',
      thesis: `破解${theme.label}发展瓶颈不能靠短期输血或盲目跟风，唯有激发主体内生动力、涵养包容创新生态，方能行稳致远。`,
      subPoints: [
        `尊重本地资源禀赋，避免“一刀切”或简单照搬外部模板。`,
        `健全利益联结与人才培养体系，让“参与者”真正成为“受益者”。`,
        `以耐心资本与容错机制护航长期探索，夯实可持续发展根基。`,
      ],
      fitReason: '适合材料中出现“害怕担风险、人才外流、长期主义”等关键词的题目。',
    },
  ];

  const primaryActionText = actions[0] || `以${kw1}与${kw2}破局`;
  const primaryOutcomeText = outcomes[0] || `实现质效与满意度双提升`;
  const compressedCase = `面对“${problems[0].slice(0, 22)}”等现实瓶颈，当地坚持精准破局，通过${primaryActionText.slice(0, 32)}，最终${primaryOutcomeText.slice(0, 26)}，为同类地区提供了可复制样本。`;

  let selectedAngle = multiAngles[0];
  if (focus === 'elevation') selectedAngle = multiAngles[1];
  else if (focus === 'problem') selectedAngle = multiAngles[0];
  else if (focus === 'action') selectedAngle = multiAngles[2];

  const indexCode = String(nextIndexNumber).padStart(2, '0');
  const titleText =
    customTitle && customTitle.trim().length > 0
      ? customTitle.trim()
      : `${theme.label}材料提炼：以“${kw1}”与“${kw2}”破局提质`;

  const generatedCard: ArgumentCard = {
    id: `custom-${Date.now()}`,
    indexCode,
    theme: theme.id,
    themeLabel: theme.label,
    examLevel: selectedAngle.examLevel,
    stageTag: focus === 'elevation' ? '辩证升华' : focus === 'action' ? '对策落地' : '破题总论',
    applicableScope: `由给定材料提炼生成，适用于「${theme.label}」相关归纳概括、对策分析及五段三分式大作文。`,
    cautionNote: '直接来自特定案例材料，跨主题套用时需将具体地名、行业名词抽象替换为题干对应主体。',
    title: titleText,
    coreThesis: selectedAngle.thesis,
    logicChain: {
      why: `材料痛点映照：${problems[0]}`,
      how: `核心破局路径：${actions[0]}`,
      elevation: theme.elevationTemplate,
    },
    subArguments: selectedAngle.subPoints,
    goldenOpening: `治事必先明理，破局重在精准。审视当前${theme.label}实践，${kw1}与${kw2}的协同演进正为我们提供破题之道。`,
    caseAnchor: compressedCase,
    keywords,
    isCustom: true,
  };

  return {
    themeId: theme.id,
    themeLabel: theme.label,
    keywords,
    annotatedSentences,
    subQuestionPoints: {
      problems,
      causes,
      actions,
      outcomes,
    },
    termConversions,
    multiAngles,
    compressedCase,
    generatedCard,
  };
}
