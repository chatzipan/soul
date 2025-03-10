import { getAllFutureReservations } from "../services/reservations";
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
    scope: "reservations-future",
    entity: "list",
  },
];

const queryFn = () => {
  return getAllFutureReservations();
};

useReservations.getKey = getKey;
useReservations.queryFn = queryFn;
