import React, { useState, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { NavRail, ScreenId } from './components/NavRail';
import { HomeScreen } from './components/screens/HomeScreen';
import { NavigationScreen } from './components/screens/NavigationScreen';
import { DocsScreen } from './components/screens/DocsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { 
  INITIAL_TELEMETRY, 
  INITIAL_NAV_MANEUVER, 
  NAV_MANEUVER_SEQUENCE, 
  PLAYLIST, 
  DEFAULT_SETTINGS 
} from './data/initialData';
import { StandaloneHudTelemetry, NavManeuver, MusicTrack, HudSettings } from './types/hud';

export function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [telemetry, setTelemetry] = useState<StandaloneHudTelemetry>(INITIAL_TELEMETRY);
  const [navIndex, setNavIndex] = useState(0);
  const [navManeuver, setNavManeuver] = useState<NavManeuver>(INITIAL_NAV_MANEUVER);
  
  // Media Player State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(PLAYLIST[0]);

  // Settings & Theme
  const [settings, setSettings] = useState<HudSettings>(DEFAULT_SETTINGS);

  // Simulation State
  const [isSimulatingRide, setIsSimulatingRide] = useState(true);

  // Time Readout
  const [currentTime, setCurrentTime] = useState('12:45 PM');

  // Clock Timer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Media playback ticker
  useEffect(() => {
    if (!currentTrack.isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTrack((prev) => {
        if (prev.currentTimeSec >= prev.durationSec) {
          // loop or next track
          return { ...prev, currentTimeSec: 0 };
        }
        return { ...prev, currentTimeSec: prev.currentTimeSec + 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTrack.isPlaying]);

  // Ride Simulation Loop (Vehicle-Agnostic GPS telemetry)
  useEffect(() => {
    if (!isSimulatingRide) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Natural speed variation (e.g. 42 to 58 km/h)
        const speedDelta = (Math.random() - 0.48) * 3;
        const newSpeed = Math.max(20, Math.min(68, Math.round(prev.speed + speedDelta)));
        
        // Slight heading wander
        const headingDelta = (Math.random() - 0.5) * 2;
        let newHeading = Math.round((prev.headingDeg + headingDelta + 360) % 360);
        
        // Cardinal calculation
        const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const cardIndex = Math.round(newHeading / 45) % 8;
        const newCardinal = cardinals[cardIndex];

        // Increment trip distance (speed in km/h -> km per sec)
        const distanceIncrement = newSpeed / 3600;
        const newTripDist = Number((prev.tripDistanceKm + distanceIncrement).toFixed(2));
        const newOdo = Number((prev.odometerKm + distanceIncrement).toFixed(1));

        return {
          ...prev,
          speed: newSpeed,
          headingDeg: newHeading,
          cardinal: newCardinal,
          tripDistanceKm: newTripDist,
          odometerKm: newOdo,
          maxSpeedKm: Math.max(prev.maxSpeedKm, newSpeed),
          avgSpeedKm: Math.round((prev.avgSpeedKm * 9 + newSpeed) / 10),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulatingRide]);

  // Nav maneuver cycling
  const handleCycleNavStep = () => {
    const nextIdx = (navIndex + 1) % NAV_MANEUVER_SEQUENCE.length;
    setNavIndex(nextIdx);
    setNavManeuver(NAV_MANEUVER_SEQUENCE[nextIdx]);
  };

  // Select POI destination from Navigation Screen
  const handleSelectDestination = (name: string, distance: string, eta: string) => {
    setNavManeuver((prev) => ({
      ...prev,
      destinationName: name,
      distanceToManeuver: '120 m',
      instruction: `In 120 m, head towards ${name}`,
      roadName: `${name} • Access Way`,
      remainingDistance: distance,
      eta: `${eta} (${distance})`,
    }));
  };

  // Media Controls
  const handleTogglePlayPause = () => {
    setCurrentTrack((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTrack({ ...PLAYLIST[nextIdx], isPlaying: true });
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTrack({ ...PLAYLIST[prevIdx], isPlaying: true });
  };

  const handleResetTrip = () => {
    setTelemetry((prev) => ({
      ...prev,
      tripDistanceKm: 0.0,
      tripDurationMin: 0,
      avgSpeedKm: prev.speed,
    }));
  };

  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const isLight = settings.themeMode === 'light';

  return (
    <div 
      id="hud-viewport-root"
      className={`w-screen h-screen flex flex-col overflow-hidden select-none bg-[#111318] text-[#e1e2e8] ${
        isLight ? 'theme-light' : ''
      }`}
    >
      {/* 1. TOP STATUS BAR (Material 3 standard) */}
      <StatusBar 
        telemetry={telemetry}
        settings={settings}
        currentTime={currentTime}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. MAIN ACTIVE HUD SCREEN VIEWPORT */}
      <main id="hud-main-display" className="flex-1 w-full min-h-0 relative overflow-hidden bg-[#111318]">
        {activeScreen === 'home' && (
          <HomeScreen
            telemetry={telemetry}
            navManeuver={navManeuver}
            currentTrack={currentTrack}
            settings={settings}
            onCycleNavStep={handleCycleNavStep}
            onOpenFullMap={() => setActiveScreen('navigation')}
            onTogglePlayPause={handleTogglePlayPause}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            onResetTrip={handleResetTrip}
          />
        )}

        {activeScreen === 'navigation' && (
          <NavigationScreen
            telemetry={telemetry}
            navManeuver={navManeuver}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {activeScreen === 'docs' && (
          <DocsScreen />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            telemetry={telemetry}
            onUpdateSettings={setSettings}
          />
        )}
      </main>

      {/* 3. MATERIAL 3 NAVIGATION RAIL (Bottom navigation bar) */}
      <NavRail
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />
    </div>
  );
}

export default App;
