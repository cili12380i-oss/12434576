import React from 'react';
import { BookMarked } from 'lucide-react';
import { WorkspaceTabId } from '../types/shenlun';

interface HeaderProps {
  activeTab: WorkspaceTabId;
  onSelectTab: (tab: WorkspaceTabId) => void;
  outlineCount: number;
  onOpenOutline: () => void;
}

const NAV_TABS: { id: WorkspaceTabId; label: string }[] = [
  { id: 'mining', label: '原材深挖' },
  { id: 'arguments', label: '论点卡片' },
  { id: 'materials', label: '分功素材' },
  { id: 'essays', label: '范文精析' },
  { id: 'scope', label: '适用范围' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  outlineCount,
  onOpenOutline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F2]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onSelectTab('mining')}
          className="font-editorial text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          策论研习社
        </button>

        <nav
          aria-label="主工作区导航"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-[#1C1917] border-[#1E3A8A] font-semibold'
                    : 'text-[#57534E] border-transparent hover:text-[#1C1917]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenOutline}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            <BookMarked className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>写作提纲</span>
            <span className="font-mono-num text-xs opacity-90">({outlineCount})</span>
          </button>
        </div>
      </div>

      <div className="md:hidden border-t border-[#E5E0D8] px-4 py-2 flex items-center gap-2 overflow-x-auto bg-[#F8F6F2]">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-[#57534E] bg-white border border-[#E5E0D8]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
