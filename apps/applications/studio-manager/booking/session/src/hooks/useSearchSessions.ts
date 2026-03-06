import Fuse from "fuse.js";
import { useMemo } from "react";

import type { EnrichedSession } from "../types";

const FUSE_THRESHOLD = 0.3;

const FUSE_OPTIONS = {
  keys: ["name", "teacherName", "originalTeacherName", "establishmentName"],
  shouldSort: false,
  threshold: FUSE_THRESHOLD,
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
