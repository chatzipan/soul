import { useQuery } from "@tanstack/react-query";

import { getAllReservations } from "../services/reservations";

export const useReservations = (config = {} as { enable: boolean }) =>
  useQuery({
    queryKey: getKey(),
    queryFn,
    ...config,
  });

const getKey = () => [
  {
    domain: "admin",
    scope: "reservations",
    entity: "list",
  },
];

const queryFn = () => {
  return getAllReservations();
};

useReservations.getKey = getKey;
useReservations.queryFn = queryFn;
