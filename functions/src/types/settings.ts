export interface TimeRange {
  start: string; // Format: "HH:mm"
  end: string; // Format: "HH:mm"
}

export interface RecurringBlock {
  id: string;
  dayOfWeek: DayOfWeek; // 0-6 (Sunday-Saturday)
  timeRange: TimeRange;
  active: boolean;
}

export interface BlockedDate {
  id: string;
  date: number; // Unix timestamp
  timeRange?: TimeRange; // If undefined, entire day is blocked
  reason?: string;
}

export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export interface OpeningDay {
  openingHours: TimeRange;
  isOpen: boolean;
}

export interface RestaurantSettings {
  maxCapacity: number;
  openingDays: Record<DayOfWeek, OpeningDay>;
  timeSlotDuration: number;
  // recurringBlocks: RecurringBlock[];
  // blockedDates: BlockedDate[];
}
