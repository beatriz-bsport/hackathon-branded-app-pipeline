import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLevelAPI } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

const deleteLevel = deleteLevelAPI.bind(null, fetch);

export const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number }) => deleteLevel(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
};
