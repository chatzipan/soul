export enum BookingType {
  BRUNCH = "Brunch",
  LUNCH = "Lunch",
  APERO = "Apéro",
  DINNER = "Dinner",
}

export interface ContactData {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  notes: string;
}
