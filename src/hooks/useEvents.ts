import { getAllEvents } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

export const useEvents = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
    queryKey: getKey(),
    queryFn,
    ...config,
  });

const getKey = () => [
  {
    domain: "admin",
    scope: "events",
    entity: "list",
  },
];

const queryFn = () => {
  return getAllEvents();
};

useEvents.getKey = getKey;
useEvents.queryFn = queryFn;
