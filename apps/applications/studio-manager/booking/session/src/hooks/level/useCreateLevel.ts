import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLevelAPI, levelKeys } from "@bsport/api-core";
import type { Level } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const createLevel = createLevelAPI.bind(null, fetch);

export const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { data: Omit<Level, "id"> }) => createLevel(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.all });
    },
  });
};
