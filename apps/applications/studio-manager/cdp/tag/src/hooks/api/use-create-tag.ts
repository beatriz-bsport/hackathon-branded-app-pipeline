import { Tag, createTagAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseCreateTagParams = {
  onSuccess?: (createdTag: Tag) => void;
  onFailure?: (error: Error) => void;
};

const createTag = createTagAction.bind(null, fetch);

/**
 * Hook for creating a tag
 * @param params - Parameters for creating a tag
 * @param params.onSuccess - Callback function to be called when a tag is created successfully
 * @param params.onFailure - Callback function to be called when a tag creation fails
 * @returns Object containing the loading state and the create tag  function
 */
export function useCreateTag({
  onSuccess,
  onFailure,
}: UseCreateTagParams = {}) {
  const [{ isLoading }, triggerCreateTag] = useAsync<typeof createTag>({
    asyncFn: createTag,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    createTag: triggerCreateTag,
  };
}
