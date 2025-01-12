import { BlockedDate, RecurringBlock } from "../types/settings";

export const isTimeSlotBlocked = (
  date: Date,
  time: string,
  settings: {
    blockedDates?: BlockedDate[];
    recurringBlocks?: RecurringBlock[];
  }
) => {
  const { blockedDates = [], recurringBlocks = [] } = settings;
  const dayOfWeek = date.getDay();
  const dateTimestamp = date.getTime();

  // Check recurring blocks
  const recurringBlock = recurringBlocks.find(
    (block) =>
      block.active &&
      block.dayOfWeek === dayOfWeek &&
      block.timeRange.start <= time &&
      block.timeRange.end >= time
  );

  if (recurringBlock) return true;

  // Check specific blocked dates
  const blockedDate = blockedDates.find((block) => {
    const blockDate = new Date(block.date);
    return (
      blockDate.setHours(0, 0, 0, 0) ===
        new Date(dateTimestamp).setHours(0, 0, 0, 0) &&
      (!block.timeRange ||
        (block.timeRange.start <= time && block.timeRange.end >= time))
    );
  });

  return !!blockedDate;
};
