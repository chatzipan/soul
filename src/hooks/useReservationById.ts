import { getReservationById } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

export const useReservationById = (
  id: string | undefined,
  config = {} as { enable: boolean },
) =>
  useQueryWrapper({
    queryKey: getKey(id),
    queryFn: () => queryFn(id),
    enabled: !!id && config.enable !== false,
    ...config,
  });

const getKey = (id: string | undefined) => [
  {
    domain: "reservation",
    scope: "details",
    entity: id || "unknown",
  },
];

const queryFn = (id: string | undefined) => {
  if (!id) {
    throw new Error("Reservation ID is required");
  }
  return getReservationById(id);
};

useReservationById.getKey = getKey;
useReservationById.queryFn = queryFn;
