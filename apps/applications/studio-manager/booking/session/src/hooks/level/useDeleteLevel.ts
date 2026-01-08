import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLevelAPI } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { LEVEL_QUERY_KEY } from "./constants";

const deleteLevel = deleteLevelAPI.bind(null, fetch);

export const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number }) => deleteLevel(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEVEL_QUERY_KEY] });
    },
  });
};
