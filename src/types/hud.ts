export type GpsFixStatus = '3D_FIX' | 'DGPS' | 'ACQUIRING';

export interface StandaloneHudTelemetry {
  // GPS Telemetry (Vehicle-Agnostic)
  speed: number; // km/h (or converted by unit)
  speedLimit: number; // current road limit
  headingDeg: number; // 0 - 360
  cardinal: string; // 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'
  altitudeM: number; // meters above sea level
  gpsAccuracyM: number; // precision in meters
  gpsFixStatus: GpsFixStatus;
  satellitesLocked: number;

  // Trip Statistics
  tripDistanceKm: number;
  odometerKm: number;
  avgSpeedKm: number;
  maxSpeedKm: number;
  tripDurationMin: number;

  // Standalone Hardware & Remote Indicators
  powerSource: '12V_DC' | 'USB_PD' | 'BATTERY';
  deviceBatteryPercent: number; // Internal HUD backup battery
  phoneBatteryPercent: number;
  phoneCellularBars: number;

  // Universal Wireless TPMS (optional Bluetooth valve caps)
  tpmsFrontPsi: number;
  tpmsRearPsi: number;
}

export interface NavManeuver {
  icon: 'straight' | 'turn-right' | 'turn-left' | 'slight-right' | 'slight-left' | 'roundabout' | 'u-turn' | 'destination';
  instruction: string;
  roadName: string;
  distanceToManeuver: string;
  nextInstructionPreview?: string;
  eta: string;
  remainingDistance: string;
  speedLimit: number;
  trafficStatus: 'light' | 'moderate' | 'heavy';
  destinationName: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationSec: number;
  currentTimeSec: number;
  isPlaying: boolean;
  source: 'Spotify' | 'Android Auto' | 'Bluetooth' | 'Apple Music';
  volume: number;
}

export interface VehicleDocument {
  id: string;
  type: 'RC' | 'DL' | 'INSURANCE' | 'PUC' | 'RSA';
  title: string;
  subtitle: string;
  documentNumber: string;
  holderName: string;
  validity: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'VERIFIED';
  issuer: string;
  qrPayload: string;
  details: { label: string; value: string }[];
}

export type M3ColorSeed = 'blue' | 'emerald' | 'amber' | 'purple';

export interface HudSettings {
  themeMode: 'dark' | 'light' | 'system';
  m3ColorSeed: M3ColorSeed;
  hudBrightness: number;
  speedUnit: 'km/h' | 'mph';
  tempUnit: '°C' | '°F';
  speedAlertThreshold: number; // e.g. 80 km/h
  speedAlertsEnabled: boolean;
  speedCameraAlerts: boolean;
  audioChimesEnabled: boolean;
  bluetoothHelmetConnected: boolean;
  helmetDeviceName: string;
  phoneConnected: boolean;
  phoneDeviceName: string;
  autoAudioHandoff: boolean;
  nightModeAuto: boolean;
}
