import { Reservation } from "../types";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const API_URL = process.env.GATSBY_API_URL;

export const createReservation = async (
  reservation: Omit<Reservation, "id" | "time">
) => {
  try {
    const res = await fetch(`${API_URL}/reservations/v1`, {
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
    const res = await fetch(`${API_URL}/reservations/v1/${reservationId}`, {
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
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes === 0 ? "00" : minutes}`;
};

export const getAllReservations = async () => {
  try {
    const res = await fetch(`${API_URL}/reservations/v1`, {
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

export const getAllEvents = async () => {
  try {
    const res = await fetch(`${API_URL}/reservations/v1`, {
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
  reservation: Omit<Reservation, "time">
) => {
  try {
    const res = await fetch(`${API_URL}/reservations/v1/${reservation.id}`, {
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
