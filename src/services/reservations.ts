import moment from "moment-timezone";

import { Reservation } from "../../functions/src/types/reservation";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const API_URL = process.env.GATSBY_API_URL;

export const createReservation = async (
  reservation: Omit<Reservation, "id" | "time">,
) => {
  try {
    const res = await fetch(`${API_URL}/v1/reservations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(reservation),
    });

    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    const res = await fetch(`${API_URL}/v1/reservations/${reservationId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getTimeFromDate = (date: Date) => {
  const zurichTime = moment(date).tz("Europe/Zurich");
  const hours = zurichTime.hours();
  const minutes = zurichTime.minutes();

  return `${hours}:${minutes === 0 ? "00" : minutes}`;
};

export const getAllReservations = async () => {
  try {
    const res = await fetch(`${API_URL}/v1/reservations`, {
      method: "GET",
      headers: getHeaders(),
    });

    const response = (await res.json()) as Reservation[];

    const reservationsWithTime = response.map((reservation) => {
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
  }
};

export const getSoulEvents = async () => {
  try {
    const res = await fetch(`${API_URL}/v1/public/reservations/events`, {
      method: "GET",
      headers: getHeaders(),
    });

    const events = (await res.json()) as Reservation[];
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
  }
};

export const getAllEvents = async () => {
  try {
    const res = await fetch(`${API_URL}/v1/reservations`, {
      method: "GET",
      headers: getHeaders(),
    });

    const response = (await res.json()) as Reservation[];
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
  }
};

export const updateReservation = async (
  reservation: Omit<Reservation, "time">,
) => {
  try {
    const res = await fetch(`${API_URL}/v1/reservations/${reservation.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(reservation),
    });

    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
