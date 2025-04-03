import { groupBy } from "lodash";

import { format, isToday, isTomorrow } from "date-fns";

import { Reservation } from "../../../../functions/src/types/reservation";

export enum TabsView {
  Today = "Today",
  Upcoming = "Upcoming",
  Previous = "Previous",
}

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const a11yProps = (index: string) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    value: index,
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
  pastReservations: Reservation[],
  view: TabsView,
): Reservation[] => {
  // today at 00:00
  const today = new Date().setHours(0, 0, 0, 0);

  switch (view) {
    case TabsView.Today:
      return reservations.filter((reservation) =>
        isToday(new Date(reservation.date)),
      );
    case TabsView.Upcoming:
      return reservations.filter((reservation) => {
        const date = new Date(reservation.date).setHours(0, 0, 0, 0);
        return date > today;
      });
    case TabsView.Previous:
      return pastReservations;
  }
};

const getSortPerTabView = (view: TabsView, a: Reservation, b: Reservation) => {
  if ([TabsView.Upcoming, TabsView.Today].includes(view)) {
    return a.date > b.date ? 1 : -1;
  } else {
    return a.date < b.date ? 1 : -1;
  }
};

const getSortPerTabViewLegacy = (
  view: TabsView,
  a: Reservation,
  b: Reservation,
) => {
  const aDate =
    typeof a.date === "number" ? new Date(a.date).toISOString() : a.date;
  const bDate =
    typeof b.date === "number" ? new Date(b.date).toISOString() : b.date;

  if (view === TabsView.Upcoming) {
    return aDate.localeCompare(bDate) || a.time.localeCompare(b.time);
  } else {
    return bDate.localeCompare(aDate) || b.time.localeCompare(a.time);
  }
};

export const groupByDateAndTime = (
  reservations: Reservation[],
  pastReservations: Reservation[],
  view: TabsView,
) => {
  const perTabView = getReservationsPerTabView(
    reservations,
    pastReservations,
    view,
  );

  const sortedByDate = perTabView.sort(
    // sort by date and time
    (a, b) =>
      typeof a.date === "number"
        ? getSortPerTabView(view, a, b)
        : getSortPerTabViewLegacy(view, a, b),
  );

  // Create 3 levels deep of grouping: year, month, and day
  // The result will be : { "2022": { "01": { "01": [ ... ] } } }
  const groupedByYear = groupBy(sortedByDate, (reservation) =>
    new Date(reservation.date).getFullYear(),
  );

  const groupedByMonth = Object.entries(groupedByYear).reduce(
    (acc, [year, yearReservations]) => {
      acc[year] = groupBy(yearReservations, (reservation) =>
        format(new Date(reservation.date), "LLLL"),
      );
      return acc;
    },
    {} as Record<string, Record<string, Reservation[]>>,
  );

  const groupedByDay = Object.entries(groupedByMonth).reduce(
    (acc, [year, months]) => {
      acc[year] = Object.entries(months).reduce(
        (acc, [month, dayReservations]) => {
          acc[month] = groupBy(dayReservations, (reservation) => {
            return format(new Date(reservation.date), "d");
          });
          return acc;
        },
        {} as Record<string, Record<string, Reservation[]>>,
      );
      return acc;
    },
    {} as Record<string, Record<string, Record<string, Reservation[]>>>,
  );

  return groupedByDay;
};

export const isValidEmail = (email: string) => {
  const test = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  return test ? false : true;
};

export const getFormattedTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
