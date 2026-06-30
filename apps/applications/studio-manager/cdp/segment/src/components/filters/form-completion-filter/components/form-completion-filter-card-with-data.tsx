import { useSuspenseQuery } from "@tanstack/react-query";

import {
  CUSTOM_FORM_DEFAULT_PAGE_SIZE,
  customFormsQueryOptions,
} from "@bsport/api-cdp/custom-form";

import { fetch } from "#src/utils/fetch";

import type { FormCompletionFilterCardProps } from "../types";
import { FormCompletionFilterCard } from "./form-completion-filter-card";

type FormCompletionFilterCardWithDataProps = Omit<
  FormCompletionFilterCardProps,
  "customFormOptions"
>;

/**
 * Loads active custom forms and renders the form completion filter card.
 */
export const FormCompletionFilterCardWithData = (
  props: FormCompletionFilterCardWithDataProps,
) => {
  const { data } = useSuspenseQuery(
    customFormsQueryOptions(fetch, {
      disabled: false,
      page_size: CUSTOM_FORM_DEFAULT_PAGE_SIZE,
    }),
  );

  const customFormOptions =
    data?.results?.map((customForm) => ({
      id: customForm.id,
      name: customForm.name,
    })) ?? [];

  return (
    <FormCompletionFilterCard
      {...props}
      customFormOptions={customFormOptions}
    />
  );
};
