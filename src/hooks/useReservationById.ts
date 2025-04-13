import { Reservation } from "../../functions/src/types/reservation";
import { getReservationById } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

interface ApiError {
  response?: {
    status: number;
    data?: {
      code?: string;
      message?: string;
    };
  };
}

export const useReservationById = (
  id: string | undefined,
  config = {} as { enable: boolean },
) =>
  useQueryWrapper<Reservation, ApiError>({
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
