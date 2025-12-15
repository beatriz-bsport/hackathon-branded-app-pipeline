import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLevelAPI } from "@bsport/api-core";
import type { Level } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const createLevel = createLevelAPI.bind(null, fetch);

export const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { data: Level }) => createLevel(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
};
