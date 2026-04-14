import { useFuzzySearch } from "#src/hooks/useFuzzySearch";
import type { EnrichedSession } from "#src/types";

const SEARCH_KEYS: (keyof EnrichedSession)[] = [
  "name",
  "teacherName",
  "originalTeacherName",
  "establishmentName",
];

export const useSearchSessions = (
  sessions: EnrichedSession[],
  searchQuery: string,
) => useFuzzySearch(sessions, searchQuery, SEARCH_KEYS);
