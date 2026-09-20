import React from 'react';
import { 
  Navigation as NavIcon, 
  ChevronRight, 
  Radio, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Compass,
  Mountain,
  Clock,
  RotateCcw,
  Disc3,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { StandaloneHudTelemetry, NavManeuver, MusicTrack, HudSettings } from '../../types/hud';

interface HomeScreenProps {
  telemetry: StandaloneHudTelemetry;
  navManeuver: NavManeuver;
  currentTrack: MusicTrack;
  settings: HudSettings;
  onCycleNavStep: () => void;
  onOpenFullMap: () => void;
  onTogglePlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onResetTrip: () => void;
}

// Trigonometric helpers for mathematically exact SVG gauge arcs
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSvgArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const sweep = endAngle - startAngle;
  const largeArcFlag = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  telemetry,
  navManeuver,
  currentTrack,
  settings,
  onCycleNavStep,
  onOpenFullMap,
  onTogglePlayPause,
  onNextTrack,
  onPrevTrack,
  onResetTrip,
}) => {
  // Speedometer math
  const maxDisplaySpeed = 120;
  const speedPercentage = Math.min(100, Math.max(0, (telemetry.speed / maxDisplaySpeed) * 100));
  const isOverspeed = telemetry.speed > telemetry.speedLimit;

  // Maneuver Icon helper
  const renderManeuverIcon = () => {
    switch (navManeuver.icon) {
      case 'turn-right':
        return (
          <svg className="w-12 h-12 text-[#a8c7fa]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 38V22a8 8 0 0 1 8-8h16" />
            <path d="m30 6 8 8-8 8" />
          </svg>
        );
      case 'turn-left':
        return (
          <svg className="w-12 h-12 text-[#a8c7fa]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M34 38V22a8 8 0 0 0-8-8H10" />
            <path d="m18 6-8 8 8 8" />
          </svg>
        );
      case 'roundabout':
        return (
          <svg className="w-12 h-12 text-[#a8c7fa]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="24" r="10" />
            <path d="M24 38v-4" />
            <path d="M38 24h-4" />
            <path d="M28 14l6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-[#a8c7fa]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 38V10" />
            <path d="m14 20 10-10 10 10" />
          </svg>
        );
    }
  };

  return (
    <div 
      id="hud-home-screen" 
      className="w-full h-full p-2 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch overflow-y-auto md:overflow-hidden"
    >
      {/* 1. LEFT CARD: TURN-BY-TURN NAVIGATION CARD (Span 3 cols on desktop/tablet) */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        id="hud-card-navigation"
        onClick={onCycleNavStep}
        className="md:col-span-3 bg-[#1d2024] rounded-[28px] border border-[#43474e]/25 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#a8c7fa]/40 cursor-pointer group shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center">
              <NavIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#e1e2e8] block">
                Google Maps
              </span>
              <span className="text-[10px] text-[#c3c6cf]">
                Android Auto Projection
              </span>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#272a2f] border border-[#43474e]/30 text-[10px] font-mono-num text-[#a8c7fa] font-semibold">
            {navManeuver.remainingDistance}
          </span>
        </div>

        {/* Big Turn Graphic & Distance */}
        <div className="my-auto py-3 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-[#272a2f] border border-[#43474e]/30 mb-2 group-hover:scale-105 transition-transform">
            {renderManeuverIcon()}
          </div>

          <span className="text-3xl sm:text-4xl font-extrabold font-mono-num text-[#e1e2e8] tracking-tight">
            {navManeuver.distanceToManeuver}
          </span>

          <h3 className="text-sm sm:text-base font-semibold text-[#e1e2e8] mt-1 line-clamp-2 px-2">
            {navManeuver.instruction}
          </h3>

          <p className="text-xs text-[#c3c6cf] mt-1 font-medium line-clamp-1">
            {navManeuver.roadName}
          </p>

          {navManeuver.nextInstructionPreview && (
            <div className="mt-3 px-3 py-1.5 rounded-2xl bg-[#272a2f] border border-[#43474e]/20 text-[11px] text-[#c3c6cf] flex items-center gap-1.5 text-left w-full">
              <span className="text-[#8d9199] font-medium shrink-0">THEN:</span>
              <span className="truncate">{navManeuver.nextInstructionPreview}</span>
            </div>
          )}
        </div>

        {/* Footer: ETA & Map Button */}
        <div className="pt-3 border-t border-[#43474e]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8d9199] block font-medium">ESTIMATED ARRIVAL</span>
            <span className="text-xs font-bold text-[#e1e2e8] font-mono-num">
              {navManeuver.eta}
            </span>
          </div>

          <button
            type="button"
            id="hud-open-full-map-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullMap();
            }}
            className="flex items-center gap-1 text-xs text-[#a8c7fa] hover:text-[#d3e3fd] font-semibold transition-all px-3 py-1.5 rounded-full bg-[#0842a0]/40 hover:bg-[#0842a0] border border-[#a8c7fa]/30 cursor-pointer"
          >
            <span>Full Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>


      {/* 2. CENTER WIDGET: STANDALONE GPS SPEEDOMETER CLUSTER (Span 6 cols) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        id="hud-card-speedometer"
        className="md:col-span-6 bg-[#1d2024] rounded-[28px] border border-[#43474e]/25 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-sm"
      >
        {/* Top telemetry row */}
        <div className="flex items-center justify-between w-full z-10">
          {/* Compass & Altitude Chip */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#272a2f] border border-[#43474e]/30 text-xs text-[#e1e2e8] font-medium font-mono-num">
              <Compass className="w-3.5 h-3.5 text-[#a8c7fa]" />
              <span>{telemetry.headingDeg}°</span>
              <span className="font-bold text-[#a8c7fa]">{telemetry.cardinal}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#272a2f] border border-[#43474e]/30 text-[11px] text-[#c3c6cf] font-mono-num hidden sm:flex">
              <Mountain className="w-3.5 h-3.5 text-[#8d9199]" />
              <span>{telemetry.altitudeM} m ASL</span>
            </div>
          </div>

          {/* Odometer & Trip Reset */}
          <div className="flex items-center gap-2">
            <div className="text-right text-xs font-mono-num">
              <span className="text-[#8d9199] text-[10px] block font-medium">ODOMETER</span>
              <span className="font-bold text-[#e1e2e8]">{telemetry.odometerKm} km</span>
            </div>
            <button
              type="button"
              id="hud-trip-reset-btn"
              onClick={onResetTrip}
              className="p-1.5 rounded-full bg-[#272a2f] hover:bg-[#32353a] text-[#8d9199] hover:text-[#e1e2e8] transition-colors border border-[#43474e]/30 cursor-pointer"
              title="Reset Trip Distance"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Circular GPS Speed Gauge */}
        <div className="relative my-auto flex flex-col items-center justify-center py-2 z-10">
          <div className="relative w-64 h-56 sm:w-72 sm:h-64 flex items-center justify-center">
            {(() => {
              const cx = 140;
              const cy = 130;
              const r = 96;
              const startAngle = 145;
              const totalSweep = 250;
              const endAngle = startAngle + totalSweep; // 395 deg

              const clampedSpeed = Math.max(0, Math.min(maxDisplaySpeed, telemetry.speed));
              const currentAngle = startAngle + (clampedSpeed / maxDisplaySpeed) * totalSweep;

              const limitSweep = (Math.min(maxDisplaySpeed, telemetry.speedLimit) / maxDisplaySpeed) * totalSweep;
              const limitAngle = startAngle + limitSweep;
              const pInner = polarToCartesian(cx, cy, r - 12, limitAngle);
              const pOuter = polarToCartesian(cx, cy, r + 12, limitAngle);

              const speedTicks = [0, 20, 40, 60, 80, 100, 120];

              return (
                <svg className="w-full h-full" viewBox="0 0 280 230">
                  {/* Outer Tick Marks & Numbers */}
                  {speedTicks.map((val) => {
                    const tickAngle = startAngle + (val / maxDisplaySpeed) * totalSweep;
                    const t1 = polarToCartesian(cx, cy, r + 8, tickAngle);
                    const t2 = polarToCartesian(cx, cy, r + 14, tickAngle);
                    const tLabel = polarToCartesian(cx, cy, r + 24, tickAngle);
                    const isMajor = val % 40 === 0;

                    return (
                      <g key={val}>
                        <line
                          x1={t1.x}
                          y1={t1.y}
                          x2={t2.x}
                          y2={t2.y}
                          stroke={isMajor ? '#8d9199' : '#43474e'}
                          strokeWidth={isMajor ? 2 : 1.5}
                          strokeLinecap="round"
                        />
                        {isMajor && (
                          <text
                            x={tLabel.x}
                            y={tLabel.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#8d9199"
                            fontSize="9"
                            fontWeight="600"
                            className="font-mono-num select-none"
                          >
                            {val}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Background Track Arc (Clean, smooth unbroken semicircle) */}
                  <path
                    d={describeSvgArc(cx, cy, r, startAngle, endAngle)}
                    fill="none"
                    stroke="#272a2f"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Active Speed Progress Arc */}
                  {clampedSpeed > 0 && (
                    <path
                      d={describeSvgArc(cx, cy, r, startAngle, currentAngle)}
                      fill="none"
                      stroke={isOverspeed ? '#ffb4ab' : '#a8c7fa'}
                      strokeWidth="11"
                      strokeLinecap="round"
                      className="transition-all duration-150"
                    />
                  )}

                  {/* Road Speed Limit Marker on Arc */}
                  <line
                    x1={pInner.x}
                    y1={pInner.y}
                    x2={pOuter.x}
                    y2={pOuter.y}
                    stroke="#ffb4ab"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              );
            })()}

            {/* Central Speed Numbers & Units */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none pt-2">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-[#e1e2e8] font-mono-num leading-none">
                {telemetry.speed}
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#8d9199] mt-1">
                {settings.speedUnit.toUpperCase()}
              </span>

              {/* Speed Status Chip */}
              <div className="mt-2.5">
                {isOverspeed ? (
                  <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] text-[11px] font-bold font-mono-num border border-[#ffb4ab]/40 shadow-sm">
                    <AlertCircle className="w-3 h-3" />
                    <span>LIMIT {telemetry.speedLimit}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#272a2f] text-[#c3c6cf] text-[11px] font-semibold font-mono-num border border-[#43474e]/30 shadow-sm">
                    <span>GPS SPEED</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cluster: Trip Telemetry Pills */}
        <div className="pt-3 border-t border-[#43474e]/20 grid grid-cols-4 gap-2 text-center z-10 font-mono-num">
          <div className="p-2 rounded-2xl bg-[#272a2f]/70 border border-[#43474e]/20">
            <span className="text-[10px] text-[#8d9199] block font-medium">TRIP</span>
            <span className="text-xs sm:text-sm font-bold text-[#e1e2e8]">{telemetry.tripDistanceKm} km</span>
          </div>

          <div className="p-2 rounded-2xl bg-[#272a2f]/70 border border-[#43474e]/20">
            <span className="text-[10px] text-[#8d9199] block font-medium">TIME</span>
            <span className="text-xs sm:text-sm font-bold text-[#e1e2e8]">{telemetry.tripDurationMin} min</span>
          </div>

          <div className="p-2 rounded-2xl bg-[#272a2f]/70 border border-[#43474e]/20">
            <span className="text-[10px] text-[#8d9199] block font-medium">AVG SPEED</span>
            <span className="text-xs sm:text-sm font-bold text-[#e1e2e8]">{telemetry.avgSpeedKm} km/h</span>
          </div>

          <div className="p-2 rounded-2xl bg-[#272a2f]/70 border border-[#43474e]/20">
            <span className="text-[10px] text-[#8d9199] block font-medium">MAX SPEED</span>
            <span className="text-xs sm:text-sm font-bold text-[#e1e2e8]">{telemetry.maxSpeedKm} km/h</span>
          </div>
        </div>
      </motion.div>


      {/* 3. RIGHT CARD: MUSIC & NOW PLAYING CARD (Span 3 cols) */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        id="hud-card-music"
        className="md:col-span-3 bg-[#1d2024] rounded-[28px] border border-[#43474e]/25 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#a8c7fa]/40 shadow-sm relative overflow-hidden group"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#e1e2e8] block">
                Now Playing
              </span>
              <span className="text-[10px] text-[#c3c6cf]">
                Bluetooth Intercom
              </span>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#272a2f] border border-[#43474e]/30 text-[10px] font-semibold text-[#a8c7fa]">
            {currentTrack.source}
          </span>
        </div>

        {/* Album Artwork & Track Info */}
        <div className="my-auto py-2 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border border-[#43474e]/30 mb-2.5">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {currentTrack.isPlaying && (
              <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#111318]/80 backdrop-blur-sm border border-[#43474e]/50 flex items-center justify-center">
                <Disc3 className="w-4 h-4 text-[#a8c7fa] animate-spin" />
              </div>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#e1e2e8] line-clamp-1">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-[#c3c6cf] line-clamp-1 mt-0.5">
            {currentTrack.artist}
          </p>
          <span className="text-[10px] text-[#8d9199] truncate max-w-full mt-0.5">
            {currentTrack.album}
          </span>

          {/* M3 Progress bar */}
          <div className="w-full mt-3">
            <div className="w-full h-1.5 bg-[#272a2f] rounded-full overflow-hidden border border-[#43474e]/20">
              <div 
                className="h-full bg-[#a8c7fa] rounded-full transition-all"
                style={{ width: `${(currentTrack.currentTimeSec / currentTrack.durationSec) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono-num text-[#8d9199] mt-1">
              <span>{Math.floor(currentTrack.currentTimeSec / 60)}:{String(currentTrack.currentTimeSec % 60).padStart(2, '0')}</span>
              <span>{Math.floor(currentTrack.durationSec / 60)}:{String(currentTrack.durationSec % 60).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Media Controls (M3 Pill FAB Controls) */}
        <div className="pt-3 border-t border-[#43474e]/20 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#c3c6cf] text-xs">
            <Volume2 className="w-3.5 h-3.5 text-[#a8c7fa]" />
            <span className="text-[10px] font-mono-num">{currentTrack.volume}%</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="hud-media-prev-btn"
              onClick={onPrevTrack}
              className="w-8 h-8 rounded-full bg-[#272a2f] hover:bg-[#32353a] border border-[#43474e]/30 flex items-center justify-center text-[#c3c6cf] hover:text-[#e1e2e8] active:scale-95 transition-all cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause M3 Filled Pill Button */}
            <button
              type="button"
              id="hud-media-play-pause-btn"
              onClick={onTogglePlayPause}
              className="w-11 h-8 rounded-full bg-[#a8c7fa] hover:bg-[#d3e3fd] text-[#062e6f] flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
              title={currentTrack.isPlaying ? 'Pause' : 'Play'}
            >
              {currentTrack.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              id="hud-media-next-btn"
              onClick={onNextTrack}
              className="w-8 h-8 rounded-full bg-[#272a2f] hover:bg-[#32353a] border border-[#43474e]/30 flex items-center justify-center text-[#c3c6cf] hover:text-[#e1e2e8] active:scale-95 transition-all cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
