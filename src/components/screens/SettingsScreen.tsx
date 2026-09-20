import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon,
  Bluetooth, 
  Gauge, 
  Shield, 
  Smartphone, 
  Headphones, 
  RefreshCw, 
  Check, 
  Sliders, 
  Bell, 
  Volume2,
  Satellite,
  Compass,
  Palette,
  Power
} from 'lucide-react';
import { HudSettings, StandaloneHudTelemetry, M3ColorSeed } from '../../types/hud';

interface SettingsScreenProps {
  settings: HudSettings;
  telemetry: StandaloneHudTelemetry;
  onUpdateSettings: (updater: (prev: HudSettings) => HudSettings) => void;
}

type SettingsSection = 'display' | 'alerts' | 'connectivity' | 'gnss';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  telemetry,
  onUpdateSettings,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('display');
  const [isCheckingOta, setIsCheckingOta] = useState(false);
  const [otaSuccess, setOtaSuccess] = useState(false);

  const sections = [
    { id: 'display', label: 'Display & M3 Theme', icon: Palette },
    { id: 'alerts', label: 'Speed & Alerts', icon: Bell },
    { id: 'connectivity', label: 'Bluetooth & Intercom', icon: Bluetooth },
    { id: 'gnss', label: 'GNSS & System', icon: Satellite },
  ];

  const handleOtaCheck = () => {
    setIsCheckingOta(true);
    setOtaSuccess(false);
    setTimeout(() => {
      setIsCheckingOta(false);
      setOtaSuccess(true);
      setTimeout(() => setOtaSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div 
      id="hud-settings-screen" 
      className="w-full h-full p-3 sm:p-5 bg-[#111318] flex flex-col overflow-hidden select-none text-[#e1e2e8]"
    >
      {/* Settings Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#43474e]/25">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#e1e2e8] tracking-normal">
              AeroHUD System Settings
            </h2>
            <p className="text-xs text-[#c3c6cf]">
              Material 3 display, GNSS speedometer calibration, wireless audio & phone projection
            </p>
          </div>
        </div>

        {/* Current OS Version Badge */}
        <div className="text-right">
          <span className="text-xs font-bold text-[#a8c7fa] block">
            AeroHUD M3 Automotive
          </span>
          <span className="text-[10px] text-[#8d9199] font-mono-num">
            Version 2.4.0 • Build 8402
          </span>
        </div>
      </div>

      {/* Main Layout: Sidebar Navigation + Content Panel */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mt-3 min-h-0 overflow-hidden">
        {/* Left Section Selector (Span 4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-2 overflow-y-auto pr-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                id={`hud-settings-sec-${sec.id}`}
                onClick={() => setActiveSection(sec.id as SettingsSection)}
                className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1d2024] border-[#a8c7fa]/50 text-[#e1e2e8] shadow-sm'
                    : 'bg-[#191c20] border-[#43474e]/20 text-[#c3c6cf] hover:bg-[#1d2024]'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-[#0842a0] text-[#d3e3fd]' : 'bg-[#272a2f] text-[#8d9199]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {sec.label}
                </span>
              </button>
            );
          })}

          {/* Quick Hardware Status Card */}
          <div className="mt-auto p-3 rounded-2xl bg-[#191c20] border border-[#43474e]/20 text-xs">
            <span className="text-[10px] text-[#8d9199] font-semibold uppercase block">HARDWARE PROFILE</span>
            <div className="flex items-center justify-between text-[#c3c6cf] mt-1 font-mono-num">
              <span>Vehicle Interface</span>
              <span className="text-[#a8c7fa] font-bold">Universal (Agnostic)</span>
            </div>
            <div className="flex items-center justify-between text-[#c3c6cf] mt-1 font-mono-num">
              <span>Power Input</span>
              <span className="text-[#e1e2e8] font-bold">12V DC (9-18V Regulated)</span>
            </div>
            <div className="flex items-center justify-between text-[#c3c6cf] mt-1 font-mono-num">
              <span>Internal Battery</span>
              <span className="text-[#e1e2e8] font-bold">100% (Li-ion 2500mAh)</span>
            </div>
          </div>
        </div>

        {/* Right Settings Detail Panels (Span 8 cols) */}
        <div className="md:col-span-8 bg-[#1d2024] rounded-[28px] border border-[#43474e]/25 p-4 sm:p-5 overflow-y-auto">
          {/* 1. DISPLAY & MATERIAL 3 THEME */}
          {activeSection === 'display' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#e1e2e8] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#a8c7fa]" />
                Material 3 Design & Appearance
              </h3>

              {/* Theme Mode Switcher */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                <label className="text-xs font-semibold text-[#e1e2e8] block mb-2">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark', label: 'Dark (Night)', icon: Moon },
                    { id: 'light', label: 'Light (Day)', icon: Sun },
                    { id: 'system', label: 'Auto (Ambient Sensor)', icon: Palette },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      id={`hud-theme-choice-${t.id}`}
                      onClick={() => onUpdateSettings((prev) => ({ ...prev, themeMode: t.id as any }))}
                      className={`py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        settings.themeMode === t.id
                          ? 'bg-[#0842a0] text-[#d3e3fd] font-semibold'
                          : 'bg-[#191c20] text-[#c3c6cf] hover:text-[#e1e2e8]'
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Color Palette */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                <label className="text-xs font-semibold text-[#e1e2e8] block mb-2">
                  Dynamic Material You Accent
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'blue', label: 'Android Blue', bg: 'bg-blue-500' },
                    { id: 'emerald', label: 'Forest Green', bg: 'bg-emerald-500' },
                    { id: 'amber', label: 'Desert Amber', bg: 'bg-amber-500' },
                    { id: 'purple', label: 'Lavender', bg: 'bg-purple-500' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onUpdateSettings((prev) => ({ ...prev, m3ColorSeed: c.id as M3ColorSeed }))}
                      className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                        settings.m3ColorSeed === c.id
                          ? 'bg-[#191c20] border-[#a8c7fa] text-[#e1e2e8]'
                          : 'bg-[#191c20] border-transparent text-[#8d9199]'
                      }`}
                    >
                      <div className={`w-5 h-5 mx-auto rounded-full ${c.bg} mb-1`} />
                      <span className="text-[11px] font-medium block truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* HUD Screen Brightness */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#e1e2e8]">
                    Display Brightness
                  </label>
                  <span className="text-xs font-mono-num font-bold text-[#a8c7fa]">
                    {settings.hudBrightness}% (High Nits Anti-Glare)
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.hudBrightness}
                  onChange={(e) => onUpdateSettings((prev) => ({ ...prev, hudBrightness: Number(e.target.value) }))}
                  className="w-full accent-[#a8c7fa] cursor-pointer h-2 bg-[#191c20] rounded-full"
                />
              </div>

              {/* Units: Speed & Temperature */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                  <label className="text-xs font-semibold text-[#e1e2e8] block mb-1.5">
                    Speed Unit
                  </label>
                  <div className="flex rounded-full bg-[#191c20] p-1 border border-[#43474e]/20">
                    {(['km/h', 'mph'] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => onUpdateSettings((prev) => ({ ...prev, speedUnit: unit }))}
                        className={`flex-1 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          settings.speedUnit === unit
                            ? 'bg-[#0842a0] text-[#d3e3fd]'
                            : 'text-[#8d9199] hover:text-[#e1e2e8]'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                  <label className="text-xs font-semibold text-[#e1e2e8] block mb-1.5">
                    Temperature Unit
                  </label>
                  <div className="flex rounded-full bg-[#191c20] p-1 border border-[#43474e]/20">
                    {(['°C', '°F'] as const).map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => onUpdateSettings((prev) => ({ ...prev, tempUnit: unit }))}
                        className={`flex-1 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          settings.tempUnit === unit
                            ? 'bg-[#0842a0] text-[#d3e3fd]'
                            : 'text-[#8d9199] hover:text-[#e1e2e8]'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SPEED & ALERTS */}
          {activeSection === 'alerts' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#e1e2e8] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#a8c7fa]" />
                Speed Limit & Navigation Safety
              </h3>

              {/* Overspeed threshold */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-xs font-semibold text-[#e1e2e8] block">
                      Overspeed Warning Alert
                    </label>
                    <p className="text-[11px] text-[#c3c6cf]">
                      Pulsing visual halo when riding above selected limit
                    </p>
                  </div>
                  <span className="text-xs font-mono-num font-bold text-[#a8c7fa]">
                    {settings.speedAlertThreshold} {settings.speedUnit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[50, 60, 80, 100].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => onUpdateSettings((prev) => ({ ...prev, speedAlertThreshold: limit }))}
                      className={`flex-1 py-1.5 rounded-full text-xs font-mono-num font-bold border transition-all cursor-pointer ${
                        settings.speedAlertThreshold === limit
                          ? 'bg-[#0842a0] border-[#a8c7fa] text-[#d3e3fd]'
                          : 'bg-[#191c20] border-[#43474e]/30 text-[#8d9199] hover:text-[#e1e2e8]'
                      }`}
                    >
                      {limit} {settings.speedUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles: Speed camera alerts, audio chimes */}
              <div className="flex flex-col gap-2.5">
                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#e1e2e8] block">Speed Camera / Radar Alerts</span>
                    <span className="text-[11px] text-[#c3c6cf]">Notify 300m before road speed cameras</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings((prev) => ({ ...prev, speedCameraAlerts: !prev.speedCameraAlerts }))}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      settings.speedCameraAlerts ? 'bg-[#a8c7fa]' : 'bg-[#191c20]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.speedCameraAlerts ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#e1e2e8] block">Audio Voice & Turn Prompts</span>
                    <span className="text-[11px] text-[#c3c6cf]">Route audio guidance to helmet headset</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings((prev) => ({ ...prev, audioChimesEnabled: !prev.audioChimesEnabled }))}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      settings.audioChimesEnabled ? 'bg-[#a8c7fa]' : 'bg-[#191c20]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.audioChimesEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. CONNECTIVITY & INTERCOM */}
          {activeSection === 'connectivity' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#e1e2e8] flex items-center gap-2">
                <Bluetooth className="w-4 h-4 text-[#a8c7fa]" />
                Wireless Projection & Helmet Audio
              </h3>

              {/* Helmet Intercom */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#e1e2e8] block">
                      {settings.helmetDeviceName}
                    </span>
                    <span className="text-[11px] text-[#a8c7fa]">
                      Connected (A2DP + HFP Intercom)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Sena 50S Intercom is active and connected.')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#191c20] text-[#e1e2e8] border border-[#43474e]/30 hover:bg-[#272a2f] cursor-pointer"
                >
                  Configure
                </button>
              </div>

              {/* Android Auto Phone */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#e1e2e8] block">
                      {settings.phoneDeviceName}
                    </span>
                    <span className="text-[11px] text-[#a8c7fa]">
                      Wireless Android Auto 5GHz Link
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#191c20] border border-[#43474e]/30 text-[11px] font-mono-num text-[#c3c6cf]">
                  Battery: {telemetry.phoneBatteryPercent}%
                </span>
              </div>
            </div>
          )}

          {/* 4. GNSS & SYSTEM */}
          {activeSection === 'gnss' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#e1e2e8] flex items-center gap-2">
                <Satellite className="w-4 h-4 text-[#a8c7fa]" />
                GNSS Sensor & System Status
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                  <span className="text-[#8d9199] block text-[10px]">FIX STATUS</span>
                  <span className="text-[#a8c7fa] font-bold text-sm">3D FIX (GNSS)</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                  <span className="text-[#8d9199] block text-[10px]">SATELLITES</span>
                  <span className="text-[#e1e2e8] font-bold text-sm">{telemetry.satellitesLocked} Locked</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                  <span className="text-[#8d9199] block text-[10px]">ELEVATION</span>
                  <span className="text-[#e1e2e8] font-bold text-sm">{telemetry.altitudeM} m ASL</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                  <span className="text-[#8d9199] block text-[10px]">ACCURACY</span>
                  <span className="text-[#e1e2e8] font-bold text-sm">±{telemetry.gpsAccuracyM} meters</span>
                </div>
              </div>

              {/* OTA Firmware Update */}
              <div className="p-3.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#e1e2e8] block">Firmware Update</span>
                  <span className="text-[11px] text-[#c3c6cf]">
                    {otaSuccess ? 'Your AeroHUD unit is up to date' : 'Check for latest automotive OTA updates'}
                  </span>
                </div>

                <button
                  type="button"
                  id="hud-check-ota-btn"
                  onClick={handleOtaCheck}
                  disabled={isCheckingOta}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#a8c7fa] text-[#062e6f] hover:bg-[#d3e3fd] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isCheckingOta ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : otaSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Latest</span>
                    </>
                  ) : (
                    <span>Check Updates</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
