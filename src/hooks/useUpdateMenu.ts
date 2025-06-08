import { useMutation } from "@tanstack/react-query";

import { updateMenu } from "../services/menu";

export const useUpdateMenu = () => {
  return useMutation({
    mutationFn: updateMenu,
  });
};
