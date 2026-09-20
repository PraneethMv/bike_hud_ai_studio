import React from 'react';
import { Gauge, Navigation, FileBadge2, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export type ScreenId = 'home' | 'navigation' | 'docs' | 'settings';

interface NavRailProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

export const NavRail: React.FC<NavRailProps> = ({ 
  activeScreen, 
  onSelectScreen,
}) => {
  const items: NavItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      subLabel: 'HUD Cluster',
      icon: Gauge,
    },
    {
      id: 'navigation',
      label: 'Navigation',
      subLabel: 'Google Maps',
      icon: Navigation,
    },
    {
      id: 'docs',
      label: 'Documents',
      subLabel: 'Vehicle Wallet',
      icon: FileBadge2,
    },
    {
      id: 'settings',
      label: 'Settings',
      subLabel: 'HUD & Audio',
      icon: Settings,
    },
  ];

  return (
    <nav 
      id="hud-bottom-nav-rail"
      aria-label="HUD Screens"
      className="w-full h-16 bg-[#1d2024] border-t border-[#43474e]/25 px-4 sm:px-8 flex items-center justify-around z-30 select-none"
    >
      <div className="flex items-center justify-around w-full max-w-xl mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              id={`hud-nav-tab-${item.id}`}
              type="button"
              onClick={() => onSelectScreen(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 sm:px-5 rounded-2xl outline-none cursor-pointer group transition-all"
            >
              {/* Material 3 Active Pill Indicator */}
              <div className="relative w-14 sm:w-16 h-8 flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="m3NavPill"
                    className="absolute inset-0 rounded-full bg-[#0842a0] text-[#d3e3fd]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon 
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive ? 'text-[#d3e3fd]' : 'text-[#c3c6cf] group-hover:text-[#e1e2e8]'
                  }`} 
                />
              </div>

              {/* Material 3 Label */}
              <span className={`text-[11px] sm:text-xs font-medium mt-0.5 tracking-normal transition-colors ${
                isActive ? 'text-[#e1e2e8] font-semibold' : 'text-[#8d9199] group-hover:text-[#c3c6cf]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
