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

export const setSearchMembers = ({
  members,
  archived,
}: {
  members: Member[];
  archived: boolean;
}) => {
  memberStore.setState((state) => {
    const nextList = archived ? { archived: members } : { active: members };
    return {
      search: {
        ...state.search,
        ...nextList,
      },
    };
  });
};

export const setSearchHistory = (searchedMember: Member) => {
  memberStore.setState((state) => {
    if (
      state.search.history
        .map((member) => member.id)
        .includes(searchedMember.id)
    ) {
      return state;
    }
    return {
      search: {
        ...state.search,
        history: [...state.search.history, searchedMember],
      },
    };
  });
};

export const updateMemberTag = ({
  memberId,
  tagId,
}: {
  memberId: number;
  tagId: number;
}) => {
  memberStore.setState((state) => {
    const member = state.byId[memberId];
    if (!member) return state;

    const currentTags = member.tags || [];
    const tags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId) // Remove tag if exists
      : [...currentTags, tagId]; // Add tag if not exists
    return {
      byId: {
        ...state.byId,
        [memberId]: { ...member, tags },
      },
    };
  });
};
