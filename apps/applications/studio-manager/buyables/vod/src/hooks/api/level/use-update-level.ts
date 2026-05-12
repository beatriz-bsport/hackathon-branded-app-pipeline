import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLevelAPI } from "@bsport/api-core";
import type { Level } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { LEVEL_QUERY_KEY } from "./constants";

const updateLevel = updateLevelAPI.bind(null, fetch);

export const useUpdateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { data: Level }) => updateLevel(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEVEL_QUERY_KEY] });
    },
  });
};
