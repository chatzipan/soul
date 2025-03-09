import { getAllPastReservations } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

export const usePastReservations = (config = {} as { enable: boolean }) =>
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
  return getAllPastReservations();
};

usePastReservations.getKey = getKey;
usePastReservations.queryFn = queryFn;
