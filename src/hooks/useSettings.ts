import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "../services/settings";
import { useQueryWrapper } from "./useQuery";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getKey() });
    },
  });
};

const getKey = () => [
  {
    domain: "admin",
    scope: "settings",
    entity: "item",
  },
];

const queryFn = () => {
  return getSettings();
};

export const useSettings = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
    queryKey: getKey(),
    queryFn,
    ...config,
  });

useSettings.getKey = getKey;
useSettings.queryFn = queryFn;
