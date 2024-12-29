import { getSoulEvents } from "../services/reservations";
import { useQueryWrapper } from "./useQuery";

export const useSoulEvents = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
    queryKey: getKey(),
    queryFn,
    ...config,
  });

const getKey = () => [
  {
    domain: "website",
    scope: "soulEvents",
    entity: "list",
  },
];

const queryFn = () => {
  return getSoulEvents();
};

useSoulEvents.getKey = getKey;
useSoulEvents.queryFn = queryFn;
