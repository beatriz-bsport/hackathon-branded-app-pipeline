import { Popup, editPopupAction } from "@bsport/store-cdp-popup";
import { useAsync } from "@bsport/use-async";

type UseEditPopupParams = {
  onSuccess?: (popup: Popup | null) => void;
  onFailure?: (error: Error) => void;
};

export function useEditPopup({
  onSuccess,
  onFailure,
}: UseEditPopupParams = {}) {
  const [{ isLoading }, triggerEditPopup] = useAsync<typeof editPopupAction>({
    asyncFn: editPopupAction,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });
  return {
    isLoading,
    editPopup: triggerEditPopup,
  };
}
