import { TagGroup, createTagGroupAction } from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseCreateTagGroupParams = {
  onSuccess?: (createdTagGroup: TagGroup) => void;
  onFailure?: (error: Error) => void;
};

const createTagGroup = createTagGroupAction.bind(null, fetch);

/**
 * Hook for creating a tag group
 * @param params - Parameters for creating a tag group
 * @param params.onSuccess - Callback function to be called when a tag group is created successfully
 * @param params.onFailure - Callback function to be called when a tag group creation fails
 * @returns Object containing the loading state and the create tag group function
 */
export function useCreateTagGroup({
  onSuccess,
  onFailure,
}: UseCreateTagGroupParams = {}) {
  const [{ isLoading }, triggerCreateTagGroup] = useAsync<
    typeof createTagGroup
  >({
    asyncFn: createTagGroup,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  return {
    isLoading,
    createTagGroup: triggerCreateTagGroup,
  };
}
