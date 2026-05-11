import { Popup, createSmartlistPopupAction } from "@bsport/store-cdp-popup";
import { useAsync } from "@bsport/use-async";

type UseCreateSmartlistPopupParams = {
  onSuccess?: (popup: Popup | null) => void;
  onFailure?: (error: Error) => void;
};

export function useCreateSmartlistPopup({
  onSuccess,
  onFailure,
}: UseCreateSmartlistPopupParams = {}) {
  const [{ isLoading }, triggerCreateSmartlistPopup] = useAsync<
    typeof createSmartlistPopupAction
  >({
    asyncFn: createSmartlistPopupAction,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });
  return {
    isLoading,
    createSmartlistPopup: triggerCreateSmartlistPopup,
  };
}
