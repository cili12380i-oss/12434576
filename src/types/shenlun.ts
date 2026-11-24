export type ShenlunThemeId =
  | 'all'
  | 'governance'
  | 'innovation'
  | 'ecology'
  | 'culture'
  | 'rural'
  | 'livelihood';

export type ExcludeAllThemeId = Exclude<ShenlunThemeId, 'all'>;

export type WorkspaceTabId =
  | 'mining'
  | 'arguments'
  | 'materials'
  | 'essays'
  | 'scope';

export type CardStageFilter = 'all' | '破题总论' | '对策落地' | '辩证升华';

export interface ThemeMeta {
  id: ExcludeAllThemeId;
  label: string;
  shortDesc: string;
}

export interface ArgumentCard {
  id: string;
  indexCode: string;
  theme: ExcludeAllThemeId;
  themeLabel: string;
  examLevel: string;
  stageTag: Exclude<CardStageFilter, 'all'>;
  applicableScope: string;
  cautionNote: string;
  title: string;
  coreThesis: string;
  logicChain: {
    why: string;
    how: string;
    elevation: string;
  };
  subArguments: string[];
  goldenOpening: string;
  caseAnchor: string;
  keywords: string[];
  isCustom?: boolean;
}

export interface EssayParagraph {
  id: string;
  role: '破题立意' | '过渡承接' | '分论点一' | '分论点二' | '分论点三' | '辩证升华' | '结尾收束';
  text: string;
  structuralAnalysis: string;
  technique: string;
  reusableTemplate: string;
}

export interface ModelEssay {
  id: string;
  indexCode: string;
  title: string;
  subtitle: string;
  examSource: string;
  year: string;
  theme: ExcludeAllThemeId;
  themeLabel: string;
  wordCount: number;
  readingMinutes: number;
  coverImage: string;
  coverCaption: string;
  applicableScope: string;
  overallThesis: string;
  outlineLogic: string[];
  paragraphs: EssayParagraph[];
}

export type MaterialStageId =
  | 'opening_closing'
  | 'compressed_case'
  | 'policy_action'
  | 'transition_parallel';

export interface MaterialStageMeta {
  id: MaterialStageId;
  label: string;
  shortTitle: string;
  writingPosition: string;
  description: string;
}

export interface MaterialItem {
  id: string;
  stage: MaterialStageId;
  categoryLabel: string;
  theme: ExcludeAllThemeId;
  themeLabel: string;
  examFit: string;
  title: string;
  content: string;
  structuredParts?: {
    lead?: string;
    action?: string;
    outcome?: string;
  };
  source: string;
  usageTip: string;
  avoidTip: string;
}

export type OutlineSlotType = '总论点' | '分论点' | '案例支撑' | '金句升华';

export interface OutlineItem {
  id: string;
  slotType: OutlineSlotType;
  title: string;
  content: string;
  sourceRef: string;
}

export type ExtractionFocus = 'balanced' | 'problem' | 'action' | 'elevation';

export interface SampleSourceMaterial {
  id: string;
  title: string;
  examContext: string;
  applicableQuestionTypes: string;
  text: string;
}

export interface TermConversion {
  vernacular: string;
  officialTerm: string;
  usageContext: string;
}

export interface MultiAngleThesis {
  angleName: string;
  examLevel: string;
  thesis: string;
  subPoints: string[];
  fitReason: string;
}

export interface AnnotatedSentence {
  text: string;
  signal: 'problem' | 'action' | 'outcome' | 'neutral';
}

export interface DeepExtractionResult {
  themeId: ExcludeAllThemeId;
  themeLabel: string;
  keywords: string[];
  annotatedSentences: AnnotatedSentence[];
  subQuestionPoints: {
    problems: string[];
    causes: string[];
    actions: string[];
    outcomes: string[];
  };
  termConversions: TermConversion[];
  multiAngles: MultiAngleThesis[];
  compressedCase: string;
  generatedCard: ArgumentCard;
}
