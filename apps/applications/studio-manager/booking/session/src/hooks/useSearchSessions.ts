import Fuse from "fuse.js";
import { useMemo } from "react";

import type { EnrichedSession } from "../types";

const FUSE_OPTIONS = {
  keys: ["name", "teacherName", "originalTeacherName", "establishmentName"],
  shouldSort: false,
};

export const useSearchSessions = (
  sessions: EnrichedSession[],
  searchQuery: string,
) => {
  const fuse = useMemo(() => new Fuse(sessions, FUSE_OPTIONS), [sessions]);

  const filteredSessions = useMemo(() => {
    if (!searchQuery) {
      return sessions;
    }

    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, sessions]);

  return filteredSessions;
};
