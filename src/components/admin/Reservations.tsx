import React from "react";

import DomainVerificationSharpIcon from "@mui/icons-material/DomainVerificationSharp";
import { RouteComponentProps } from "@reach/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useReservations } from "../../hooks/useReservations";
import { createReservation } from "../../services/reservations";
import * as S from "./Reservations.styled";

const Reservations = (_: RouteComponentProps) => {
  const { data: reservations = [] } = useReservations();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createReservation({
        name: Math.random().toString(36).substring(7),
        date: new Date(
          new Date().getFullYear(),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 31)
        ).toISOString(),
        time: new Date().toISOString().split("T")[1],
        persons: Math.floor(Math.random() * 6),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useReservations.getKey() });
    },
  });

  const formattedReservations = reservations.map((reservation) => {
    const date = new Date(reservation.date);
    const time = new Date(reservation.time);

    return {
      ...reservation,
      date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
      time: `${time.getHours()}:${time.getMinutes()}`,
    };
  });

  console.log(formattedReservations);
  return (
    <S.Wrapper>
      <S.Header variant='h3'>
        <DomainVerificationSharpIcon sx={{ fontSize: 60, color: "green" }} />
        Reservations
      </S.Header>
      <button onClick={() => mutation.mutate()}>Click to create</button>
      <ul>
        {reservations?.map((reservation) => (
          <li key={reservation.id}>
            {reservation.name} - {reservation.date} - {reservation.time}
          </li>
        ))}
      </ul>
    </S.Wrapper>
  );
};

export default Reservations;
