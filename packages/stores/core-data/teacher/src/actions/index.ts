import { Result } from "typescript-result";

import {
  type Action,
  type HTTPException,
  type PaginatedResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  type FetchTeachersParams,
  type FuzzySearchParams,
  archiveTeacherAPI,
  fetchTeachersAPI,
  fuzzySearchTeachersAPI,
  linkByEmailAPI,
  restoreTeacherAPI,
} from "#src/api";
import type { Teacher } from "#src/types";

import {
  setFlatTeachers,
  setFuzzySearchTeachers,
  setTeachers,
  updateTeacher,
} from "./store";

/**
 * Fetch a paginated list of Teachers (AssociatedCoach), with additional filters.
 * @param associated_coach__in [Optional] List of Associated Coach id to filter in.
 * @param company [Optional] Filter AssociatedCoaches belonging to the company.
 * @param disabled [Optional] Whether to look at archived Associated Coaches
 * @param has_coach_payment_rule_group [Optional] Filter on coaches with or without payment rule group
 * @param id__in [Optional] List of Coach id to filter in.
 * @param id__not_in [Optional] List of Associated Coach id to filter out.
 * @param page The page number.
 * @param page_size The number of items per page.
 * @param with_workshop [Optional] Whether an Associated Coach has an incoming workshop
 * @note page and page_size must be provided together to activate pagination
 */
export const fetchTeachersAction: Action<
  FetchTeachersParams &
    Required<Pick<FetchTeachersParams, "page" | "page_size">>,
  PaginatedResponse<Teacher>
> = async (fetch, params) => {
  const [uri, init] = fetchTeachersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setTeachers({
        teachers: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch teachers",
        params,
      }),
  );
};

/**
 * Fetch a flat list of Teachers (AssociatedCoach), based on filters.
 * @param associated_coach__in [Optional] List of Associated Coach id to filter in.
 * @param company [Optional] Filter AssociatedCoaches belonging to the company.
 * @param disabled [Optional] Whether to look at archived Associated Coaches
 * @param has_coach_payment_rule_group [Optional] Filter on coaches with or without payment rule group
 * @param id__in [Optional] List of Coach id to filter in.
 * @param id__not_in [Optional] List of Associated Coach id to filter out.
 * @param with_workshop [Optional] Whether an Associated Coach has an incoming workshop
 */
export const fetchFlatTeachersAction: Action<
  Omit<FetchTeachersParams, "page" | "page_size">,
  Array<Teacher>,
  HTTPException
> = async (fetch, params) => {
  const [uri, init] = fetchTeachersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setFlatTeachers({
        teachers: data,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch teachers",
        params,
      }),
  );
};

export const fuzzySearchTeachersAction: Action<
  FuzzySearchParams,
  PaginatedResponse<Teacher>,
  HTTPException
> = async (fetch, params) => {
  const [uri, init] = fuzzySearchTeachersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setFuzzySearchTeachers({
        teachers: data.results,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fuzzy search teachers",
        params,
      }),
  );
};

/**
 * Archive an active Teacher (AssociatedCoach)
 * @param id Id of the Teacher to archive
 */
export const archiveTeacherAction: Action<
  { id: number },
  Teacher,
  HTTPException
> = async (fetch, params) => {
  const [uri, init] = archiveTeacherAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateTeacher(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to archive teacher n°${params.id}`,
        params,
      }),
  );
};

/**
 * Restore an archived Teacher (AssociatedCoach)
 * @param id Id of the Teacher to archive
 */
export const restoreTeacherAction: Action<
  { id: number },
  Teacher,
  HTTPException
> = async (fetch, params) => {
  const [uri, init] = restoreTeacherAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateTeacher(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to restore teacher n°${params.id}`,
        params,
      }),
  );
};

/**
 * Create or Link a Teacher into the company based on the provided email.
 * @param email
 */
export const linkByEmailAction: Action<
  { email: string },
  Teacher,
  HTTPException
> = async (fetch, params) => {
  const [uri, init] = linkByEmailAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updateTeacher(data);

      return data;
    },
    (error) => {
      return createErrorWithContext(error, {
        message: `Failed to link teacher with email ${params.email}`,
        params,
      });
    },
  );
};
