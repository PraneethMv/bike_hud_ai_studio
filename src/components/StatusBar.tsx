import React from 'react';
import { 
  Wifi, 
  Smartphone, 
  Headphones, 
  Sun,
  Moon,
  Satellite,
  Zap
} from 'lucide-react';
import { StandaloneHudTelemetry, HudSettings } from '../types/hud';

interface StatusBarProps {
  telemetry: StandaloneHudTelemetry;
  settings: HudSettings;
  currentTime: string;
  onToggleTheme: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  telemetry, 
  settings, 
  currentTime,
  onToggleTheme,
}) => {
  const isOverspeed = telemetry.speed > telemetry.speedLimit;

  return (
    <header 
      id="hud-top-status-bar" 
      className="w-full h-12 bg-[#191c20] dark:bg-[#191c20] border-b border-[#43474e]/30 px-3 sm:px-4 flex items-center justify-between z-30 select-none text-[#e1e2e8]"
    >
      {/* Left Cluster: GPS GNSS Receiver & Speed Limit */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* M3 GPS 3D Fix Chip */}
        <div 
          id="hud-gps-fix-chip"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272a2f] text-[#c3c6cf] text-[11px] font-medium border border-[#43474e]/30 shadow-sm"
          title="Standalone GNSS 10Hz Receiver"
        >
          <Satellite className="w-3.5 h-3.5 text-[#a8c7fa]" />
          <span className="font-mono-num font-bold text-[#e1e2e8]">GPS 3D FIX</span>
          <span className="text-[#8d9199] text-[10px] hidden sm:inline">({telemetry.satellitesLocked} sats)</span>
        </div>

        {/* Speed Limit Road Badge */}
        <div 
          id="hud-road-speed-limit"
          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 font-bold text-xs font-mono-num transition-all shadow-sm ${
            isOverspeed
              ? 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab] animate-pulse'
              : 'bg-[#ffffff] text-[#ba1a1a] border-[#ba1a1a]'
          }`}
          title={`Road Speed Limit: ${telemetry.speedLimit} ${settings.speedUnit}`}
        >
          {telemetry.speedLimit}
        </div>
      </div>

      {/* Center Cluster: Clock & Ambient Weather */}
      <div className="flex items-center gap-2">
        <span id="hud-clock-readout" className="font-bold text-sm sm:text-base tracking-wide font-mono-num text-[#e1e2e8]">
          {currentTime}
        </span>
        <span className="text-[#8d9199] text-xs">•</span>
        <span id="hud-temp-readout" className="text-[#c3c6cf] text-xs font-medium hidden sm:inline">
          28{settings.tempUnit} Sunny
        </span>
      </div>

      {/* Right Cluster: Comms, Hardware 12V Aux Power & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Helmet Intercom */}
        <div 
          title="Bluetooth Helmet Headset Connected"
          className="flex items-center gap-1.5 text-[11px] text-[#c3c6cf] bg-[#272a2f] px-2.5 py-1 rounded-full border border-[#43474e]/30 hidden md:flex shadow-sm"
        >
          <Headphones className="w-3.5 h-3.5 text-[#a8c7fa]" />
          <span className="truncate max-w-[80px] font-medium">Sena 50S</span>
        </div>

        {/* Android Auto Wireless Projection */}
        <div 
          title="Wireless Android Auto Active"
          className="flex items-center gap-1.5 text-[11px] text-[#c3c6cf] bg-[#272a2f] px-2.5 py-1 rounded-full border border-[#43474e]/30 shadow-sm"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#a8c7fa]" />
          <span className="font-mono-num text-[11px] font-semibold">{telemetry.phoneBatteryPercent}%</span>
        </div>

        {/* Phone 4G LTE Signal */}
        <div className="flex items-center gap-0.5 text-[#8d9199] text-[10px] font-mono-num" title="Phone Cellular Signal">
          <Wifi className="w-3.5 h-3.5 text-[#c3c6cf]" />
        </div>

        {/* Standalone HUD 12V Auxiliary Power Chip */}
        <div 
          id="hud-hardware-power-chip"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#272a2f] border border-[#43474e]/30 text-[11px] shadow-sm"
          title="Motorcycle 12V Aux Harness Connected + Backup Battery 100%"
        >
          <Zap className="w-3 h-3 text-[#a8c7fa] fill-[#a8c7fa]" />
          <span className="font-mono-num font-bold text-[#e1e2e8] text-[10px] sm:text-[11px]">12V AUX</span>
        </div>

        {/* Theme mode toggle */}
        <button
          type="button"
          id="hud-theme-toggle-btn"
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-full bg-[#272a2f] hover:bg-[#32353a] text-[#c3c6cf] hover:text-[#e1e2e8] flex items-center justify-center transition-colors cursor-pointer border border-[#43474e]/30 shadow-sm"
          title={`Switch to ${settings.themeMode === 'dark' ? 'Light (Day)' : 'Dark (Night)'} Mode`}
        >
          {settings.themeMode === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
