import { memberStore } from "#src/store";
import type { Member } from "#src/types";

export const updateMember = (updatedMember: Member) => {
  memberStore.setState((state) => {
    const id = updatedMember.id;

    if (!id) return state;

    return {
      byId: { ...state.byId, [id]: updatedMember },
    };
  });
};

export const setMembers = ({
  members,
  count,
  page,
}: {
  members: Member[];
  count: number;
  page: number;
}) => {
  memberStore.setState((state) => {
    const byId = members.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, state.byId);

    return {
      ids: members.map((member) => member.id),
      byId,
      count,
      page,
    };
  });
};

export const updateIrregularities = (irregularities: number[]) => {
  memberStore.setState(() => ({
    irregularities,
  }));
};
