export enum BookingType {
  BRUNCH = "Brunch",
  LUNCH = "Lunch",
  APERO = "Apéro",
  DINNER = "Dinner",
}

export type Reservation = {
  bookingType?: BookingType;
  canceled: boolean;
  disableParallelBookings: boolean;
  date: number;
  durationHours?: number;
  edited?: boolean;
  email: string;
  eventInfo?: string;
  eventTitle?: string;
  firstName: string;
  id: string;
  isEvent: boolean;
  isOwnEvent: boolean;
  lastName: string;
  notes: string;
  persons: number;
  telephone: string;
  time: string;
};
