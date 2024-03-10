import { Reservation } from "../types";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const createReservation = async (
  reservation: Omit<Reservation, "id">
) => {
  try {
    const res = await fetch(`${process.env.GATSBY_API_URL}/reservations/v1`, {
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
    const res = await fetch(
      `${process.env.GATSBY_API_URL}/reservations/v1/${reservationId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );

    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllReservations = async () => {
  try {
    const res = await fetch(`${process.env.GATSBY_API_URL}/reservations/v1`, {
      method: "GET",
      headers: getHeaders(),
    });

    const response = (await res.json()) as Reservation[];
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updateReservation = async (reservation: Reservation) => {
  try {
    const res = await fetch(
      `${process.env.GATSBY_API_URL}/reservations/v1/${reservation.id}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(reservation),
      }
    );

    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
