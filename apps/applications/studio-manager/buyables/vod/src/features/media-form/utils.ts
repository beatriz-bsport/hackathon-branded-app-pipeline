import type { Video } from "@bsport/api-buyables/video";

import type { TeacherOption } from "#src/hooks/api/use-all-teachers-query";

import { DEFAULT_RENTAL_DAYS, MEDIA_FORM_DATA_DEFAULT } from "./constants";
import type { MediaFormData } from "./types";

export function transformMediaIntoFormState(video: Video): MediaFormData {
  const rentalDays = video.rental_days;
  const isRental = rentalDays != null && rentalDays > 0;

  return {
    name: video.name,
    description: video.description ?? MEDIA_FORM_DATA_DEFAULT.description,
    credit_price: video.credit_price ?? MEDIA_FORM_DATA_DEFAULT.credit_price,
    manager_only: video.manager_only ?? MEDIA_FORM_DATA_DEFAULT.manager_only,
    is_rental: isRental,
    rental_days: isRental ? rentalDays : DEFAULT_RENTAL_DAYS,
    cover: video.cover_main ?? MEDIA_FORM_DATA_DEFAULT.cover,
    category: (video.SCT as number) ?? MEDIA_FORM_DATA_DEFAULT.category,
    level: video.level ?? MEDIA_FORM_DATA_DEFAULT.level,
    coaches: MEDIA_FORM_DATA_DEFAULT.coaches,
  };
}

export function transformFormStateIntoCreateAPIData(
  formState: MediaFormData,
): FormData {
  const formData = new FormData();

  formData.append("name", formState.name);
  formData.append("description", formState.description);
  formData.append("credit_price", String(formState.credit_price));
  formData.append("coaches", JSON.stringify(formState.coaches));
  formData.append("level", String(formState.level ?? 1));
  formData.append("manager_only", String(formState.manager_only));
  formData.append(
    "rental_days",
    String(formState.is_rental ? formState.rental_days : 0),
  );

  if (formState.category != null) {
    formData.append("SCT", String(formState.category));
  }

  if (formState.cover instanceof File) {
    formData.append("cover_main", formState.cover);
  }

  return formData;
}

export function transformFormStateIntoAPIData(
  formState: MediaFormData,
  originalVideo: Video,
): FormData {
  const formData = new FormData();

  formData.append("id", String(originalVideo.id));
  formData.append("name", formState.name);
  formData.append("description", formState.description);
  formData.append("credit_price", String(formState.credit_price));
  formData.append("coaches", JSON.stringify(formState.coaches));
  formData.append("level", String(formState.level ?? originalVideo.level));
  formData.append("manager_only", String(formState.manager_only));
  formData.append(
    "rental_days",
    String(formState.is_rental ? formState.rental_days : 0),
  );
  formData.append("duration_second", String(originalVideo.duration_second));

  const sct = formState.category ?? originalVideo.SCT;
  if (sct != null) {
    formData.append("SCT", String(sct));
  }

  if (formState.cover instanceof File) {
    formData.append("cover_main", formState.cover);
  }

  return formData;
}

/**
 * `video.coaches` from the GET endpoint contains AssociatedCoach IDs,
 * but the PATCH endpoint expects Coach IDs. This mirrors the legacy
 * `withCoach` selector + `initial.coaches.map((ac) => ac.id)` flow.
 */
export function mapAssociatedCoachIdsToCoachIds(
  associatedCoachIds: number[],
  teachersByCoachId: Map<number, TeacherOption>,
): number[] {
  const requestedSet = new Set(associatedCoachIds);
  const coachIds: number[] = [];

  for (const [coachId, teacher] of teachersByCoachId) {
    if (teacher.associatedCoachIds.some((id) => requestedSet.has(id))) {
      coachIds.push(coachId);
    }
  }

  return coachIds;
}
