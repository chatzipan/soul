import { useQuery } from "@tanstack/react-query";

import { getAllReservations } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

export const useReservations = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
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
