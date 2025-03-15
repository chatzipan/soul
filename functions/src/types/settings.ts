export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export interface TimeBlock {
  start: string;
  end: string;
}

export interface OpeningHours {
  isOpen: boolean;
  offersDinner: boolean;
  openingHours: TimeBlock;
}

export interface RecurringBlock extends TimeBlock {
  dayOfWeek: DayOfWeek;
}

export interface SingleBlock extends TimeBlock {
  date: number; // timestamp
}

export interface RestaurantSettings {
  maxCapacity: number;
  timeSlotDuration: number;
  openingDays: Record<DayOfWeek, OpeningHours>;
  recurringBlocks: RecurringBlock[];
  singleBlocks: SingleBlock[];
}
