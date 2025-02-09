import { BookingType } from "../components/booking-modal/types";

const BookingTypeHourLimits = {
  [BookingType.BRUNCH]: [8, 12],
  [BookingType.LUNCH]: [12, 16],
  [BookingType.DINNER]: [16, 22],
};

export const createTimeOptions = (from = 8, to = 22) => {
  // create options every 15 minutes
  const options = [];

  for (let i = from; i < to; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hours = `${i}`.padStart(2, "0");
      const minutes = `${j}`.padStart(2, "0");
      options.push(`${hours}:${minutes}`);
    }
  }
  // Don't add the final hour if it's the closing time
  return options;
};

export const getDateInOneYear = () => {
  const today = new Date();

  return new Date(today.setFullYear(today.getFullYear() + 1));
};

export const createTimeOptionsFromOpeningHours = (
  openingHours: {
    start: string;
    end: string;
  },
  bookingType: BookingType | null,
  timeInZurichNow: string | null,
) => {
  if (!openingHours || !bookingType) {
    return [];
  }

  const [startHour, startMinute] = openingHours.start.split(":").map(Number);
  const [endHour, endMinute] = openingHours.end.split(":").map(Number);

  // Get all possible time slots between start and end hours
  const allTimeSlots = createTimeOptions(startHour, endHour);

  // Filter out times before the start minute in the first hour
  const timeSlots = allTimeSlots.filter((time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour === startHour ? minute >= startMinute : true;
  });

  // Filter based on booking type limits
  const [minHour, maxHour] = BookingTypeHourLimits[bookingType];

  const filteredByType = timeSlots.filter((time) => {
    const [hour, minute] = time.split(":").map(Number);

    // Check if within booking type hours and at least 30 min before closing
    if (hour < minHour || hour >= maxHour) {
      return false;
    }

    // Convert current time to minutes since midnight
    const timeInMinutes = hour * 60 + minute;
    const closingTimeInMinutes = endHour * 60 + endMinute;

    // Ensure at least 30 minutes before closing time
    return timeInMinutes <= closingTimeInMinutes - 30;
  });

  // If no current time provided, return all slots
  if (!timeInZurichNow) {
    return filteredByType;
  }

  // Filter out times less than 1 hour from now
  const [currentHour, currentMinute] = timeInZurichNow.split(":").map(Number);

  return filteredByType.filter((time) => {
    const [slotHour, slotMinute] = time.split(":").map(Number);

    // If hours differ by more than 1, slot is valid
    if (slotHour > currentHour + 1) {
      return true;
    }

    // If exactly 1 hour difference, check minutes
    if (slotHour === currentHour + 1) {
      return slotMinute >= currentMinute;
    }

    return false;
  });
};
