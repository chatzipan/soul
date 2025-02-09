import {
  DayOfWeek,
  RestaurantSettings,
} from "../../functions/src/types/settings";
import { getZurichTimeNow } from "../components/booking-modal/BookingModal";
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

export const createTimeOptionsFromOpeningHours = ({
  bookingType,
  currentDayOfWeek,
  selectedDate,
  settings,
}: {
  bookingType: BookingType | null;
  currentDayOfWeek: DayOfWeek;
  selectedDate: Date;
  settings: RestaurantSettings;
}) => {
  const openingHours = settings?.openingDays?.[currentDayOfWeek]?.openingHours;
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const timeInZurichNow = getZurichTimeNow().split(" ")[1];
  const earliestBookingTime = isToday ? timeInZurichNow : null;

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

  // Filter out times that fall within recurring blocks for the current day
  const filteredByRecurringBlocks =
    currentDayOfWeek && settings?.recurringBlocks?.length
      ? filteredByType.filter((time) => {
          const [hour, minute] = time.split(":").map(Number);
          const timeInMinutes = hour * 60 + minute;

          // Check if time falls within any recurring block for this day
          const isBlocked = settings?.recurringBlocks.some((block) => {
            if (block.dayOfWeek !== currentDayOfWeek) {
              return false;
            }

            const [blockStartHour, blockStartMinute] = block.start
              .split(":")
              .map(Number);
            const [blockEndHour, blockEndMinute] = block.end
              .split(":")
              .map(Number);

            const blockStartMinutes = blockStartHour * 60 + blockStartMinute;
            const blockEndMinutes = blockEndHour * 60 + blockEndMinute;

            return (
              timeInMinutes >= blockStartMinutes &&
              timeInMinutes < blockEndMinutes
            );
          });

          return !isBlocked;
        })
      : filteredByType;

  // Filter out times that fall within single blocks for the selected date
  const filteredByAllBlocks =
    selectedDate && settings?.singleBlocks?.length
      ? filteredByRecurringBlocks.filter((time) => {
          const [hour, minute] = time.split(":").map(Number);
          const timeInMinutes = hour * 60 + minute;

          // Check if time falls within any single block for this date
          const isBlocked = settings?.singleBlocks.some((block) => {
            const blockDate = new Date(block.date);
            if (blockDate.toDateString() !== selectedDate.toDateString()) {
              return false;
            }

            const [blockStartHour, blockStartMinute] = block.start
              .split(":")
              .map(Number);
            const [blockEndHour, blockEndMinute] = block.end
              .split(":")
              .map(Number);

            const blockStartMinutes = blockStartHour * 60 + blockStartMinute;
            const blockEndMinutes = blockEndHour * 60 + blockEndMinute;

            return (
              timeInMinutes >= blockStartMinutes &&
              timeInMinutes < blockEndMinutes
            );
          });

          return !isBlocked;
        })
      : filteredByRecurringBlocks;

  // If no current time provided, return filtered slots
  if (!earliestBookingTime) {
    return filteredByAllBlocks;
  }

  // Filter out times less than 1 hour from now
  const [currentHour, currentMinute] = earliestBookingTime
    .split(":")
    .map(Number);

  return filteredByAllBlocks.filter((time) => {
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
