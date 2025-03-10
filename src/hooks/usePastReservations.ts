import { getAllPastReservations } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

export const usePastReservations = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
    queryKey: getKey(),
    queryFn,
    enabled: config.enable,
    staleTime: config.enable ? undefined : Infinity, // Prevent background refetches when disabled
    gcTime: config.enable ? undefined : 0, // Don't cache data when disabled
    ...config,
  });

const getKey = () => [
  {
    domain: "admin",
    scope: "reservations-past",
    entity: "list",
  },
];

const queryFn = () => {
  return getAllPastReservations();
};

usePastReservations.getKey = getKey;
usePastReservations.queryFn = queryFn;
