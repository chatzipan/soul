import { format } from "date-fns";
import * as moment from "moment-timezone";

const isToday = (date: number) =>
  format(new Date(date), "yyyy-MM-dd") ===
  moment.tz("Europe/Zurich").format("yyyy-MM-DD");

export const getFormattedDate = (date: number) =>
  isToday(date)
    ? "Today"
    : moment(new Date(date)).tz("Europe/Zurich").format("MMMM D, YYYY");
