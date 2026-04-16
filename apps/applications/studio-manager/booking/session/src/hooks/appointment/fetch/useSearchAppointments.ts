import { useFuzzySearch } from "#src/hooks/useFuzzySearch";
import type { EnrichedAppointment } from "#src/types";

const SEARCH_KEYS: (keyof EnrichedAppointment)[] = [
  "name",
  "teacherName",
  "participantName",
  "establishmentName",
  "passUsedName",
];

export const useSearchAppointments = (
  appointments: EnrichedAppointment[],
  searchQuery: string,
) => useFuzzySearch(appointments, searchQuery, SEARCH_KEYS);
