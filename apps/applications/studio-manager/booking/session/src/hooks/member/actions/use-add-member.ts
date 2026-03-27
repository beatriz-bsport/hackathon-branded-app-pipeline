import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Member,
  type MemberPayload,
  addMemberAPI,
  memberKeys,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

const addMember = addMemberAPI.bind(null, fetch);

export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation<Member, Error, MemberPayload>({
    mutationFn: (payload) => addMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
};
