import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAutoReplySettings,
  updateAutoReplySettings,
} from "../services/settings";
import { useQueryWrapper } from "./useQuery";

const getKey = () => [
  {
    domain: "admin",
    scope: "settings",
    entity: "autoReply",
  },
];

const queryFn = () => {
  return getAutoReplySettings();
};

export const useUpdateAutoReplySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAutoReplySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getKey() });
    },
  });
};

export const useAutoReplySettings = (config = {} as { enable: boolean }) =>
  useQueryWrapper({
    queryKey: getKey(),
    queryFn,
    ...config,
  });

useAutoReplySettings.getKey = getKey;
useAutoReplySettings.queryFn = queryFn;
