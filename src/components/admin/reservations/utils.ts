import { format, isToday, isTomorrow } from "date-fns";
import { groupBy } from "lodash";

import { Reservation } from "../../../types";

export enum TabsView {
  Today = 0,
  Upcoming = 1,
  Previous = 2,
}

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const displayDate = (date: Date) => {
  if (isToday(date)) {
    return "Today";
  }
  if (isTomorrow(date)) {
    return "Tomorrow";
  }
  return format(date, "EEEE, do");
};

export const getReservationsPerTabView = (
  reservations: Reservation[],
  view: TabsView
): Reservation[] => {
  // today at 00:00
  const today = new Date().setHours(0, 0, 0, 0);

  switch (view) {
    case TabsView.Today:
      return reservations.filter((reservation) =>
        isToday(new Date(reservation.date))
      );
    case TabsView.Upcoming:
      return reservations.filter((reservation) => {
        const date = new Date(reservation.date).setHours(0, 0, 0, 0);
        return date > today;
      });
    case TabsView.Previous:
      return reservations.filter((reservation) => {
        const date = new Date(reservation.date).setHours(0, 0, 0, 0);
        return date < today;
      });
  }
};

export const groupByDateAndTime = (
  reservations: Reservation[],
  view: TabsView
) => {
  const perTabView = getReservationsPerTabView(reservations, view);
  const sortedByDate = [...perTabView].sort(
    // sort by date and time
    (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
  );

  // Create 3 levels deep of grouping: year, month, and day
  // The result will be : { "2022": { "01": { "01": [ ... ] } } }
  const groupedByYear = groupBy(sortedByDate, (reservation) =>
    new Date(reservation.date).getFullYear()
  );

  const groupedByMonth = Object.entries(groupedByYear).reduce(
    (acc, [year, reservations]) => {
      acc[year] = groupBy(reservations, (reservation) =>
        format(new Date(reservation.date), "LLLL")
      );
      return acc;
    },
    {} as Record<string, Record<string, Reservation[]>>
  );

  const groupedByDay = Object.entries(groupedByMonth).reduce(
    (acc, [year, months]) => {
      acc[year] = Object.entries(months).reduce(
        (acc, [month, reservations]) => {
          acc[month] = groupBy(reservations, (reservation) =>
            format(new Date(reservation.date), "d")
          );
          return acc;
        },
        {} as Record<string, Record<string, Reservation[]>>
      );
      return acc;
    },
    {} as Record<string, Record<string, Record<string, Reservation[]>>>
  );

  return groupedByDay;
};

export const isValidEmail = (email: string) => {
  const test = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  return test ? false : true;
};
