import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Search, 
  Compass, 
  Plus, 
  Minus, 
  Layers, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  ChevronRight,
  Sparkles,
  Crosshair,
  Coffee,
  Fuel,
  Zap,
  Wrench
} from 'lucide-react';
import { motion } from 'motion/react';
import { NavManeuver, StandaloneHudTelemetry } from '../../types/hud';

interface NavigationScreenProps {
  telemetry: StandaloneHudTelemetry;
  navManeuver: NavManeuver;
  onSelectDestination: (name: string, distance: string, eta: string) => void;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({
  telemetry,
  navManeuver,
  onSelectDestination,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showTraffic, setShowTraffic] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const quickPOIs = [
    { name: 'Shell Fuel Station', type: 'fuel', dist: '1.2 km', eta: '4 min', icon: Fuel },
    { name: 'EV Fast Charger (Universal)', type: 'ev', dist: '2.8 km', eta: '7 min', icon: Zap },
    { name: 'Cafe & Rider Rest Stop', type: 'rest', dist: '3.5 km', eta: '9 min', icon: Coffee },
    { name: 'Two-Wheeler Service & Tyre Care', type: 'service', dist: '4.1 km', eta: '11 min', icon: Wrench },
  ];

  return (
    <div 
      id="hud-navigation-screen" 
      className="w-full h-full relative overflow-hidden select-none bg-[#111318] flex flex-col text-[#e1e2e8]"
    >
      {/* MAP BACKGROUND CANVAS / VECTOR RENDERING */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out origin-center"
        style={{
          transform: `scale(${zoomLevel}) ${is3DMode ? 'perspective(800px) rotateX(16deg)' : ''}`,
          transformOrigin: '50% 60%',
        }}
      >
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Land Background */}
          <rect width="1000" height="600" fill="#12151b" />
          <rect width="1000" height="600" fill="url(#mapGrid)" />

          {/* Open green spaces */}
          <polygon points="120,40 240,60 220,180 90,140" fill="#172e21" opacity="0.5" />
          <polygon points="680,100 890,90 860,250 670,220" fill="#172e21" opacity="0.5" />
          <polygon points="340,360 480,340 460,480 320,470" fill="#172e21" opacity="0.4" />

          {/* City Secondary Arterial Roads */}
          <path d="M 0,220 L 1000,280" stroke="#252932" strokeWidth="14" fill="none" />
          <path d="M 180,0 L 260,600" stroke="#252932" strokeWidth="12" fill="none" />
          <path d="M 820,0 L 760,600" stroke="#252932" strokeWidth="12" fill="none" />
          <path d="M 0,420 L 1000,380" stroke="#252932" strokeWidth="14" fill="none" />
          <path d="M 500,0 L 480,600" stroke="#2c313c" strokeWidth="16" fill="none" />

          {/* Planned GPS Navigation Route */}
          <path 
            d="M 500,560 L 500,380 Q 500,320 540,300 L 740,240 Q 780,220 800,160 L 800,120" 
            stroke="#a8c7fa" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />

          {/* Live traffic overlay segments */}
          {showTraffic && (
            <>
              <path d="M 500,450 L 500,380" stroke="#ffb4ab" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 540,300 L 640,270" stroke="#ffd899" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* POI Markers */}
          <g transform="translate(420, 260)">
            <circle cx="0" cy="0" r="14" fill="#0842a0" />
            <text x="0" y="4" textAnchor="middle" fill="#d3e3fd" fontSize="10" fontWeight="bold">⛽</text>
          </g>

          <g transform="translate(680, 200)">
            <circle cx="0" cy="0" r="14" fill="#1b4231" />
            <text x="0" y="4" textAnchor="middle" fill="#8bf8b8" fontSize="10" fontWeight="bold">☕</text>
          </g>

          {/* Destination Pin */}
          <g transform="translate(800, 120)">
            <circle cx="0" cy="0" r="16" fill="#a8c7fa" />
            <circle cx="0" cy="0" r="8" fill="#062e6f" />
            <text x="22" y="5" fill="#e1e2e8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              {navManeuver.destinationName}
            </text>
          </g>

          {/* Rider GPS Location Chevron */}
          <g transform="translate(500, 520)">
            <circle cx="0" cy="0" r="28" fill="rgba(168, 199, 250, 0.15)" />
            <circle cx="0" cy="0" r="16" fill="#0842a0" stroke="#a8c7fa" strokeWidth="3" />
            <polygon points="0,-9 7,7 0,3 -7,7" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* TOP FLOATING M3 NAVIGATION HEADER */}
      <div className="relative z-20 p-3 sm:p-4 flex flex-col gap-2 max-w-xl">
        {/* Maneuver Tonal Card */}
        <div className="p-3.5 sm:p-4 rounded-[24px] bg-[#1d2024]/95 backdrop-blur-md border border-[#43474e]/30 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center shrink-0">
              <Navigation className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold font-mono-num text-[#e1e2e8]">
                  {navManeuver.distanceToManeuver}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#272a2f] text-[#a8c7fa] font-bold">
                  {navManeuver.remainingDistance}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#e1e2e8] line-clamp-1">
                {navManeuver.instruction}
              </p>
              <span className="text-[11px] text-[#c3c6cf] block truncate">
                {navManeuver.roadName}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#8d9199] block font-medium">ETA</span>
            <span className="text-xs sm:text-sm font-bold text-[#e1e2e8] font-mono-num">
              {navManeuver.eta}
            </span>
          </div>
        </div>

        {/* Quick POI Chips (Material 3 Filter Chips) */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {quickPOIs.map((poi, idx) => {
            const Icon = poi.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDestination(poi.name, poi.dist, poi.eta)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1d2024]/90 hover:bg-[#272a2f] border border-[#43474e]/30 text-xs text-[#e1e2e8] shrink-0 transition-colors shadow-sm cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-[#a8c7fa]" />
                <span className="font-medium">{poi.name}</span>
                <span className="text-[10px] text-[#8d9199] font-mono-num">({poi.dist})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE FLOATING M3 MAP CONTROLS */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* 2D / 3D Toggle Button */}
        <button
          type="button"
          onClick={() => setIs3DMode(!is3DMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-colors cursor-pointer border border-[#43474e]/30 ${
            is3DMode ? 'bg-[#0842a0] text-[#d3e3fd]' : 'bg-[#1d2024] text-[#c3c6cf]'
          }`}
          title="Toggle 2D / 3D Perspective"
        >
          {is3DMode ? '3D' : '2D'}
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
          className="w-10 h-10 rounded-full bg-[#1d2024] hover:bg-[#272a2f] border border-[#43474e]/30 text-[#e1e2e8] flex items-center justify-center shadow-md cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
          className="w-10 h-10 rounded-full bg-[#1d2024] hover:bg-[#272a2f] border border-[#43474e]/30 text-[#e1e2e8] flex items-center justify-center shadow-md cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Traffic Layer Toggle */}
        <button
          type="button"
          onClick={() => setShowTraffic(!showTraffic)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer border border-[#43474e]/30 ${
            showTraffic ? 'bg-[#0842a0] text-[#d3e3fd]' : 'bg-[#1d2024] text-[#8d9199]'
          }`}
          title="Toggle Live Traffic Layer"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Mute Voice Guidance */}
        <button
          type="button"
          onClick={() => setIsVoiceMuted(!isVoiceMuted)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer border border-[#43474e]/30 ${
            isVoiceMuted ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#1d2024] text-[#c3c6cf]'
          }`}
          title="Mute / Unmute Voice Alerts"
        >
          {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* BOTTOM COMPASS & SPEED CHIP */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-[#1d2024]/90 backdrop-blur-sm border border-[#43474e]/30 text-xs text-[#e1e2e8] font-mono-num font-bold flex items-center gap-1.5 shadow-md">
          <Compass className="w-4 h-4 text-[#a8c7fa]" />
          <span>{telemetry.headingDeg}° {telemetry.cardinal}</span>
          <span className="text-[#8d9199]">•</span>
          <span>{telemetry.speed} km/h</span>
        </div>
      </div>
    </div>
  );
};
