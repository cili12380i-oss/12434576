import React, { useEffect, useState } from 'react';
import { ArgumentMatrixSection } from './components/ArgumentMatrixSection';
import { EssayAnalysisSection } from './components/EssayAnalysisSection';
import { Header } from './components/Header';
import { MaterialLibrarySection } from './components/MaterialLibrarySection';
import { OutlineDrawer } from './components/OutlineDrawer';
import { ScopeAssessmentSection } from './components/ScopeAssessmentSection';
import { SourceMiningWorkspace } from './components/SourceMiningWorkspace';
import { INITIAL_ARGUMENT_CARDS } from './data/shenlunCorpus';
import {
  ArgumentCard,
  OutlineItem,
  OutlineSlotType,
  WorkspaceTabId,
} from './types/shenlun';

const CUSTOM_CARDS_KEY = 'celun_custom_cards_v1';
const OUTLINE_ITEMS_KEY = 'celun_outline_items_v1';
const OUTLINE_TITLE_KEY = 'celun_outline_title_v1';

const STARTER_OUTLINE: OutlineItem[] = [
  {
    id: 'starter-1',
    slotType: '总论点',
    title: '破题与中心立意',
    content:
      '基层治理既要有“云端智治”的精度，更要有“脚步丈量”的温度，以精细化服务托起群众稳稳的幸福。',
    sourceRef: '示范提纲 · 基层治理',
  },
  {
    id: 'starter-2',
    slotType: '分论点',
    title: '分论点一（精准感知）',
    content: '以“网格精度”织密感知网络，变“政府端菜”为“群众点菜”，推动治理重心下移。',
    sourceRef: '示范提纲 · 基层治理',
  },
  {
    id: 'starter-3',
    slotType: '分论点',
    title: '分论点二（多元协同）',
    content: '以“协商温度”凝聚共治合力，让居民从“旁观者”变为社区治理的“合伙人”。',
    sourceRef: '示范提纲 · 基层治理',
  },
  {
    id: 'starter-4',
    slotType: '分论点',
    title: '分论点三（减负赋能）',
    content: '做数字技术共享的“加法”与指尖形式主义的“减法”，让基层干部有精力走进楼栋。',
    sourceRef: '示范提纲 · 基层治理',
  },
  {
    id: 'starter-5',
    slotType: '金句升华',
    title: '结尾回扣升华',
    content:
      '民之所忧，我必念之；民之所盼，我必行之。以“微切口”破题、以“微协同”聚力，让人民城市的美好图景在基层生动铺展。',
    sourceRef: '示范提纲 · 基层治理',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('mining');

  const [customCards, setCustomCards] = useState<ArgumentCard[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_CARDS_KEY);
      return raw ? (JSON.parse(raw) as ArgumentCard[]) : [];
    } catch {
      return [];
    }
  });

  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>(() => {
    try {
      const raw = localStorage.getItem(OUTLINE_ITEMS_KEY);
      return raw ? (JSON.parse(raw) as OutlineItem[]) : STARTER_OUTLINE;
    } catch {
      return STARTER_OUTLINE;
    }
  });

  const [essayTitle, setEssayTitle] = useState<string>(() => {
    try {
      return localStorage.getItem(OUTLINE_TITLE_KEY) || '让“微治理”撬动基层“大效能”';
    } catch {
      return '让“微治理”撬动基层“大效能”';
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(customCards));
    } catch {
      // Ignore storage quota issues
    }
  }, [customCards]);

  useEffect(() => {
    try {
      localStorage.setItem(OUTLINE_ITEMS_KEY, JSON.stringify(outlineItems));
    } catch {
      // Ignore storage quota issues
    }
  }, [outlineItems]);

  useEffect(() => {
    try {
      localStorage.setItem(OUTLINE_TITLE_KEY, essayTitle);
    } catch {
      // Ignore storage quota issues
    }
  }, [essayTitle]);

  const handleSelectTab = (tab: WorkspaceTabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allCards = [...customCards, ...INITIAL_ARGUMENT_CARDS];

  const handleAddOutlineItem = (
    slotType: OutlineSlotType,
    title: string,
    content: string,
    sourceRef: string
  ) => {
    setOutlineItems((prev) => [
      ...prev,
      {
        id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        slotType,
        title,
        content,
        sourceRef,
      },
    ]);
  };

  const handleSaveCustomCard = (card: ArgumentCard) => {
    setCustomCards((prev) => [card, ...prev]);
  };

  const handleDeleteCustomCard = (id: string) => {
    setCustomCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateOutlineItem = (id: string, content: string) => {
    setOutlineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content } : item))
    );
  };

  const handleMoveOutlineItem = (index: number, direction: -1 | 1) => {
    setOutlineItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleRemoveOutlineItem = (id: string) => {
    setOutlineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddBlankItem = (slotType: OutlineSlotType) => {
    setOutlineItems((prev) => [
      ...prev,
      {
        id: `blank-${Date.now()}`,
        slotType,
        title: `自定义${slotType}`,
        content: '请在此输入你的论点句式或案例摘要…',
        sourceRef: '手写拟定',
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#1C1917]">
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        outlineCount={outlineItems.length}
        onOpenOutline={() => setDrawerOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'mining' && (
          <SourceMiningWorkspace
            existingCardCount={allCards.length}
            onSaveCustomCard={handleSaveCustomCard}
            onAddOutlineItem={handleAddOutlineItem}
            onNavigateTab={handleSelectTab}
          />
        )}

        {activeTab === 'arguments' && (
          <ArgumentMatrixSection
            cards={allCards}
            onAddOutlineItem={handleAddOutlineItem}
            onDeleteCustomCard={handleDeleteCustomCard}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialLibrarySection onAddOutlineItem={handleAddOutlineItem} />
        )}

        {activeTab === 'essays' && (
          <EssayAnalysisSection onAddOutlineItem={handleAddOutlineItem} />
        )}

        {activeTab === 'scope' && (
          <ScopeAssessmentSection onNavigateTab={handleSelectTab} />
        )}
      </main>

      <footer className="bg-[#F2EFE9] border-t border-[#E5E0D8] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#78716C]">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-sm font-bold text-[#1C1917]">策论研习社</span>
            <span aria-hidden="true">·</span>
            <span>原材深挖 · 论点卡片 · 分功素材 · 范文精析</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleSelectTab('mining')}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              原材深挖
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('arguments')}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              论点卡片
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('materials')}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              分功素材
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('essays')}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              范文精析
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab('scope')}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              适用范围
            </button>
          </div>
        </div>
      </footer>

      <OutlineDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={outlineItems}
        essayTitle={essayTitle}
        onChangeEssayTitle={setEssayTitle}
        onUpdateItem={handleUpdateOutlineItem}
        onMoveItem={handleMoveOutlineItem}
        onRemoveItem={handleRemoveOutlineItem}
        onClearAll={() => setOutlineItems([])}
        onLoadStarterTemplate={() => setOutlineItems(STARTER_OUTLINE)}
        onAddBlankItem={handleAddBlankItem}
      />
    </div>
  );
}
