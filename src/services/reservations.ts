import moment from "moment-timezone";

import { Reservation } from "../../functions/src/types/reservation";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = process.env.GATSBY_API_URL;

export const createReservation = async (
  reservation: Omit<Reservation, "id" | "time">,
) => {
  try {
    return await fetchWithAuth(`${API_URL}/v1/reservations`, {
      method: "POST",
      body: JSON.stringify(reservation),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createReservationPublic = async (
  reservation: Omit<Reservation, "id"> & { bookingType: string },
) => {
  try {
    return await fetchWithAuth(`${API_URL}/v1/public/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    return await fetchWithAuth(`${API_URL}/v1/reservations/${reservationId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTimeFromDate = (date: Date) => {
  const zurichTime = moment(date).tz("Europe/Zurich");
  const hours = zurichTime.hours();
  const minutes = zurichTime.minutes();

  return `${hours}:${minutes === 0 ? "00" : minutes}`;
};

const addQueryParams = (url: string, params: Record<string, string>) => {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      urlObj.searchParams.append(key, value);
    }
  });
  return urlObj.toString();
};

export const getReservationsWithDateRange = async (
  dateFrom?: number,
  dateUntil?: number,
) => {
  try {
    const url = addQueryParams(`${API_URL}/v1/reservations`, {
      dateFrom: dateFrom?.toString() || "",
      dateUntil: dateUntil?.toString() || "",
    });

    const response = await fetchWithAuth<Reservation[]>(url);

    const reservationsWithTime = response?.map((reservation) => {
      const { date, ...rest } = reservation;
      return {
        ...rest,
        date,
        time: reservation.time
          ? reservation.time
          : getTimeFromDate(new Date(date)),
      };
    });

    return reservationsWithTime;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFutureReservations = async () => {
  const today = moment.tz("Europe/Zurich").toDate().setHours(0, 0, 0, 0);
  return getReservationsWithDateRange(today, undefined);
};

export const getAllPastReservations = async () => {
  const today = moment.tz("Europe/Zurich").toDate().setHours(0, 0, 0, 0);
  return getReservationsWithDateRange(undefined, today);
};

export const getSoulEvents = async () => {
  try {
    const events = await fetchWithAuth<Reservation[]>(
      `${API_URL}/v1/public/reservations/events`,
    );
    const eventsWithTime = events.map((reservation) => {
      const { date, ...rest } = reservation;
      return {
        ...rest,
        date,
        time: reservation.time
          ? reservation.time
          : getTimeFromDate(new Date(date)),
      };
    });

    return eventsWithTime;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const response = await fetchWithAuth<Reservation[]>(
      `${API_URL}/v1/reservations`,
    );

    const events = response.filter((reservation) => reservation.isEvent);
    const eventsWithTime = events.map((reservation) => {
      const { date, ...rest } = reservation;
      return {
        ...rest,
        date,
        time: reservation.time
          ? reservation.time
          : getTimeFromDate(new Date(date)),
      };
    });

    return eventsWithTime;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateReservation = async (
  reservation: Omit<Reservation, "time">,
) => {
  try {
    return await fetchWithAuth(`${API_URL}/v1/reservations/${reservation.id}`, {
      method: "PUT",
      body: JSON.stringify(reservation),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
