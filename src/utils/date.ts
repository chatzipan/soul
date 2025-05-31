import { format } from "date-fns";
import moment from "moment-timezone";

import {
  DayOfWeek,
  RestaurantSettings,
} from "../../functions/src/types/settings";
import { getZurichTimeNow } from "../components/booking-form/BookingForm";
import { BookingType } from "../components/booking-form/types";

const BookingTypeHourLimits = {
  [BookingType.BRUNCH]: ["08:00", "11:30"],
  [BookingType.LUNCH]: ["11:30", "14:00"],
  [BookingType.APERO]: ["14:00", "20:00"],
  [BookingType.DINNER]: ["17:00", "22:00"],
};

const getBookingTypeHourLimits = (
  bookingType: BookingType,
  isDinnerDay: boolean,
) => {
  if (bookingType === BookingType.APERO && isDinnerDay) {
    // on dinner days, apero is only until 5pm, then dinner starts
    return ["14:00", "17:00"];
  }
  return BookingTypeHourLimits[bookingType];
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
  isDinnerDay,
  currentDayOfWeek,
  selectedDate,
  settings,
}: {
  bookingType: BookingType | null;
  currentDayOfWeek: DayOfWeek;
  isDinnerDay: boolean;
  selectedDate: Date;
  settings: RestaurantSettings;
}) => {
  const openingHours = settings?.openingDays?.[currentDayOfWeek]?.openingHours;
  const isToday =
    format(selectedDate, "yyyy-MM-dd") ===
    moment.tz("Europe/Zurich").format("yyyy-MM-DD");
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
  const [minTime, maxTime] = getBookingTypeHourLimits(bookingType, isDinnerDay);
  const [minHour, minMinute] = minTime.split(":").map(Number);
  const [maxHour, maxMinute] = maxTime.split(":").map(Number);

  const filteredByType = timeSlots.filter((time) => {
    const [hour, minute] = time.split(":").map(Number);
    const timeInMinutes = hour * 60 + minute;
    const minTimeInMinutes = minHour * 60 + minMinute;
    const maxTimeInMinutes = maxHour * 60 + maxMinute;

    // Check if within booking type hours and at least 30 min before closing
    if (timeInMinutes < minTimeInMinutes || timeInMinutes >= maxTimeInMinutes) {
      return false;
    }

    // Convert current time to minutes since midnight
    const closingTimeInMinutes = endHour * 60 + endMinute;

    // Ensure at least 30 minutes before closing time, but on Dinner days 75 minutes
    return timeInMinutes <= closingTimeInMinutes - (isDinnerDay ? 75 : 30);
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
