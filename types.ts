export enum TransportMode {
  CAR = 'Car',
  BUS = 'Bus',
  TRAIN = 'Train',
  BICYCLE = 'Bicycle',
  WALK = 'Walk',
  AUTO = 'Auto Rickshaw',
  OTHER = 'Other',
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  dateTime: string;
  endTime?: string; // Optional: To store the end time of the trip
  mode: TransportMode;
  activity: string;
  accompanying: number;
  path: { lat: number; lng: number; }[];
}

export enum Theme {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

export interface AppSettings {
  theme: Theme;
  locationEnabled: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
}

export enum View {
  DASHBOARD,
  ADD_TRIP,
  CURRENT_TRIP,
  TRIPS_MAP_VIEW,
  TRIP_DETAIL,
  SETTINGS,
  CHECKLIST,
}