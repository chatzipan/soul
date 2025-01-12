import { getOpeningHours } from "../services/settings";
import { useQueryWrapper } from "./useQuery";

export const useOpeningHours = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
    queryKey: getKey(),
    queryFn,
    ...config,
  });

const getKey = () => [
  {
    domain: "website",
    scope: "openingHours",
    entity: "list",
  },
];

const queryFn = () => {
  return getOpeningHours();
};

useOpeningHours.getKey = getKey;
useOpeningHours.queryFn = queryFn;
