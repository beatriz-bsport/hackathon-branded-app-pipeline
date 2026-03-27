import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Member,
  type MemberPayload,
  memberKeys,
  updateMemberAPI,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

const updateMember = updateMemberAPI.bind(null, fetch);

interface UpdateMemberVariables {
  id: number;
  data: MemberPayload;
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation<Member, Error, UpdateMemberVariables>({
    mutationFn: ({ id, data }) => updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
};
