import { useCallback } from "react";

import { toast } from "#src/components/Toast";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export type UseCopyToClipboardOptions = {
  /**
   * Custom message to show in the success toast.
   * If not provided, uses the default translated message.
   */
  toastMessage?: string;
  /**
   * When true, prevents the copy action.
   */
  disabled?: boolean;
  /**
   * Callback function invoked after successful copy.
   */
  onSuccess?: (value: string) => void;
  /**
   * Callback function invoked if copy fails.
   */
  onError?: (error: ClipboardError) => void;
};

export type UseCopyToClipboardReturn = {
  /**
   * Function to copy a value to the clipboard.
   * Shows a toast notification on success or failure.
   */
  copyToClipboard: (value: string) => Promise<void>;
};

/**
 * Hook that provides clipboard copy functionality with toast notifications.
 *
 * Features:
 * - Copies text to clipboard using modern Clipboard API with fallback for older browsers
 * - Shows success/error toast notifications with i18n support
 * - Supports custom success/error callbacks
 * - Can be disabled programmatically
 * - Preserves user text selection after copy (fallback mode)
 *
 * @param options - Configuration options for the hook
 * @returns An object containing the `copyToClipboard` function
 *
 * @example
 * // Basic usage
 * const { copyToClipboard } = useCopyToClipboard();
 * <button onClick={() => copyToClipboard("hello@kaizen.com")}>Copy Email</button>
 *
 * @example
 * // With custom toast message
 * const { copyToClipboard } = useCopyToClipboard({
 *   toastMessage: "Phone number copied!"
 * });
 *
 * @example
 * // With custom callbacks (e.g., for dropdown menu items)
 * const { copyToClipboard } = useCopyToClipboard({
 *   onSuccess: (value) => {
 *     console.log(`Copied: ${value}`);
 *     closeDropdown();
 *   },
 *   onError: (error) => {
 *     console.error('Copy failed:', error);
 *   }
 * });
 */
export const useCopyToClipboard = (
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn => {
  const { toastMessage, disabled, onSuccess, onError } = options;
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const copyToClipboard = useCallback(
    async (value: string) => {
      if (disabled) {
        return;
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);

          const selection = document.getSelection();
          const originalRange =
            selection && selection.rangeCount > 0
              ? selection.getRangeAt(0)
              : null;

          textarea.select();
          textarea.setSelectionRange(0, textarea.value.length);

          try {
            document.execCommand("copy");
          } catch (err) {
            console.error("Fallback: copy command failed", err);
            throw err;
          }

          document.body.removeChild(textarea);

          // Restore previous selection if possible
          if (originalRange && selection) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
          }
        }

        toast({
          status: "default",
          icon: "copy-07",
          title: toastMessage ?? t("copyToClipboard.copied"),
          buttonIcon: "x-close",
        });

        onSuccess?.(value);
      } catch (error: unknown) {
        toast({
          status: "critical",
          icon: "alert-triangle",
          title: t("copyToClipboard.failed"),
          buttonIcon: "x-close",
        });

        if (error instanceof Error) {
          onError?.(new ClipboardError(error.message));
        } else {
          onError?.(new ClipboardError());
        }
      }
    },
    [disabled, toastMessage, t, onSuccess, onError],
  );

  return { copyToClipboard };
};

class ClipboardError extends Error {
  constructor(message?: string) {
    super(message || "Clipboard operation failed");
    this.name = "ClipboardError";
  }
}
