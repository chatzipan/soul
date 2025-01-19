import { parseISO } from "date-fns";

import {
  DayOfWeek,
  RecurringBlock,
  RestaurantSettings,
  SingleBlock,
  TimeBlock,
} from "../../../../functions/src/types/settings";

export const areBlocksOutsideHours = (
  blocks: RecurringBlock[],
  settings: RestaurantSettings
): boolean => {
  // Returns true if any block is outside its day's opening hours
  return blocks.some((block) => {
    const { dayOfWeek, start, end } = block;
    const dayOpening = settings.openingDays[dayOfWeek];
    // If no opening config, the block is effectively outside hours
    if (!dayOpening) return true;
    const openingStart = parseISO(
      `2024-01-01T${dayOpening.openingHours.start}`
    );
    const openingEnd = parseISO(`2024-01-01T${dayOpening.openingHours.end}`);
    const blockStart = parseISO(`2024-01-01T${start}`);
    const blockEnd = parseISO(`2024-01-01T${end}`);
    return blockStart < openingStart || blockEnd > openingEnd;
  });
};

export const areBlocksOverlapping = (blocks: RecurringBlock[]): boolean => {
  // Return true if any block has end <= start
  if (
    blocks.some((block) => {
      const blockStart = parseISO(`2024-01-01T${block.start}`);
      const blockEnd = parseISO(`2024-01-01T${block.end}`);
      return blockEnd <= blockStart;
    })
  ) {
    return true;
  }

  // Group blocks by dayOfWeek so we only check overlap for blocks on the same day
  const blocksByDay = blocks.reduce((acc, block) => {
    if (!acc[block.dayOfWeek]) {
      acc[block.dayOfWeek] = [];
    }
    acc[block.dayOfWeek].push(block);
    return acc;
  }, {} as Record<DayOfWeek, RecurringBlock[]>);

  // Check each day's blocks for overlap
  for (const day in blocksByDay) {
    const dailyBlocks = blocksByDay[day as DayOfWeek];

    // Sort by start time
    dailyBlocks.sort((a, b) => {
      const aTime = parseISO(`2024-01-01T${a.start}`).getTime();
      const bTime = parseISO(`2024-01-01T${b.start}`).getTime();
      return aTime - bTime;
    });

    // Check for overlapping blocks that share the same dayOfWeek
    for (let i = 0; i < dailyBlocks.length - 1; i++) {
      const currentEnd = parseISO(`2024-01-01T${dailyBlocks[i].end}`);
      const nextStart = parseISO(`2024-01-01T${dailyBlocks[i + 1].start}`);

      if (currentEnd > nextStart) {
        return true; // overlap found
      }
    }
  }

  return false;
};

export const getAvailableTimeSlots = (
  blocks: (RecurringBlock | SingleBlock)[],
  date: Date | null,
  dayOfWeek: DayOfWeek | undefined,
  settings: RestaurantSettings
): { minTime: Date; maxTime: Date }[] => {
  const baseConstraints = getTimeConstraints(
    settings,
    dayOfWeek,
    date || undefined
  );
  const startOfDay = baseConstraints.minTime;
  const endOfDay = baseConstraints.maxTime;

  // If no blocks exist, return the full day
  if (!blocks.length) {
    return [{ minTime: startOfDay, maxTime: endOfDay }];
  }

  // Sort blocks by start time
  const sortedBlocks = [...blocks].sort((a, b) => {
    const aTime = parseISO(`2024-01-01T${a.start}`);
    const bTime = parseISO(`2024-01-01T${b.start}`);
    return aTime.getTime() - bTime.getTime();
  });

  const availableSlots: { minTime: Date; maxTime: Date }[] = [];
  let currentTime = startOfDay;

  sortedBlocks.forEach((block) => {
    const blockStart = parseISO(`2024-01-01T${block.start}`);
    const blockEnd = parseISO(`2024-01-01T${block.end}`);

    // Add slot before current block if there's space
    if (currentTime < blockStart) {
      availableSlots.push({
        minTime: currentTime,
        maxTime: blockStart,
      });
    }
    currentTime = blockEnd;
  });

  // Add final slot after last block if there's space
  if (currentTime < endOfDay) {
    availableSlots.push({
      minTime: currentTime,
      maxTime: endOfDay,
    });
  }

  return availableSlots;
};

export const getTimeConstraints = (
  settings: RestaurantSettings,
  dayOfWeek?: DayOfWeek,
  date?: Date
) => {
  const day: DayOfWeek = date
    ? Object.values(DayOfWeek)[date.getDay()]
    : DayOfWeek.Friday;

  const openingHours = dayOfWeek
    ? settings.openingDays[dayOfWeek]?.openingHours
    : (settings.openingDays[day]?.openingHours as TimeBlock);

  return {
    minTime: parseISO(`2024-01-01T${openingHours.start}`),
    maxTime: parseISO(`2024-01-01T${openingHours.end}`),
  };
};
