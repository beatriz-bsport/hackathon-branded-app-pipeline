import React, {
  type ChangeEvent,
  type ComponentProps,
  useEffect,
  useId,
  useState,
} from "react";

import { getEnv } from "@bsport/envs";
import { Body, Checkbox, Modal, TextArea } from "@bsport/kaizen-primitive-core";
import { toggleRevampedBackofficeAction } from "@bsport/store-auth";
import { useAsync } from "@bsport/use-async";

import {
  LEGACY_DEFAULT_PAGE,
  MAP_REVAMP_DEVELOPMENT_TO_LEGACY_URLS,
  MAP_REVAMP_PRODUCTION_TO_LEGACY_URLS,
} from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const toggleRevampedBackoffice = toggleRevampedBackofficeAction.bind(
  null,
  fetch,
);

/** @todo Enable the dynamic versioning (as commented below) when Data team can manage it */
const REVAMPED_BACKOFFICE_VERSION = "alpha";
// ENV variable defined in CI
// const REVAMPED_BACKOFFICE_VERSION =
//   import.meta.env.VITE_RELEASE_NAME ?? "alpha";

type FeedbackReason =
  | "slower"
  | "missingFeatures"
  | "hardToNavigate"
  | "dontLike"
  | "other";

type CheckboxValue = ComponentProps<typeof Checkbox>["value"];
type FeedbackReasonState = Record<FeedbackReason, CheckboxValue>;

const DEFAULT_SELECTED_REASONS: FeedbackReasonState = {
  slower: "unchecked",
  missingFeatures: "unchecked",
  hardToNavigate: "unchecked",
  dontLike: "unchecked",
  other: "unchecked",
};

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  disableRevampOnLegacyStore?: () => void;
}

/**
 * Handle whether or not we need to redirect, and to which location
 * If the current location is a revamped page, then we need to route to the corresponding
 * legacy page. It will automatically reloads the updated status of "show revamped BO" from the backend.
 *
 * @returns A dict containing the following values
 * - shouldRedirect : whether a redirection should be done (e.g. we are on a revamped page)
 * - performRedirection: the function to perform the redirection
 */
function handleRedirectionToLegacy(): {
  shouldRedirect: boolean;
  performRedirection: () => void;
} {
  const env = getEnv();
  const mapRevampToLegacyUrls =
    env === "production" || env === "staging"
      ? MAP_REVAMP_PRODUCTION_TO_LEGACY_URLS
      : MAP_REVAMP_DEVELOPMENT_TO_LEGACY_URLS;

  const getLegacyUrl = (currentUrl: string) => {
    if (!currentUrl || typeof currentUrl !== "string") {
      return LEGACY_DEFAULT_PAGE;
    }

    // Try first with the full URL, then with the first part of the path
    if (mapRevampToLegacyUrls.get(currentUrl)) {
      return mapRevampToLegacyUrls.get(currentUrl);
    }
    // Try then with the first segment of the URL
    const pathSegments = currentUrl.split("/").filter(Boolean);
    if (pathSegments.length > 0 && mapRevampToLegacyUrls.get(pathSegments[0])) {
      return mapRevampToLegacyUrls.get(pathSegments[0]);
    }

    return LEGACY_DEFAULT_PAGE;
  };

  if (env === "local") {
    const currentPort = window.location.host.split(":")[1];
    return {
      shouldRedirect: currentPort !== "3000",
      performRedirection: () => {
        // In local, it's unlikely we have both the host app and the saas-legacy running together
        // Thus, let's just raise an alert to inform about the behavior
        alert(
          `In deployed env, you would have been redirected to : ${getLegacyUrl(window.location.pathname)}`,
        );
      },
    };
  }

  return {
    shouldRedirect: window.location.pathname.startsWith("/studio/"),
    performRedirection: () => {
      try {
        const currentUrl = window.location.pathname.substring("/studio".length);
        window.location.assign(getLegacyUrl(currentUrl));
      } catch (error) {
        console.error("Failed to redirect to legacy URL: ", error);
        // Fallback to legacy home page
        window.location.assign(LEGACY_DEFAULT_PAGE);
      }
    },
  };
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onClose,
  disableRevampOnLegacyStore,
}) => {
  const { t, i18n } = useTranslation("feedbackDialog");
  const baseId = useId();

  const [selectedReasons, setSelectedReasons] = useState<FeedbackReasonState>(
    DEFAULT_SELECTED_REASONS,
  );
  const handleReasonToggle = (reason: FeedbackReason) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [reason]: prev[reason] === "checked" ? "unchecked" : "checked",
    }));
  };

  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalFeedback(event.target.value);
  };

  const [{ isLoading }, handleGoToLegacy] = useAsync<
    typeof toggleRevampedBackoffice
  >({
    asyncFn: toggleRevampedBackoffice,
    onSuccess: () => {
      onClose();
      const { shouldRedirect, performRedirection } =
        handleRedirectionToLegacy();
      if (shouldRedirect) {
        performRedirection();
      } else {
        // Hide the NavigationSidebar by updating the Redux store of the Legacy BO
        disableRevampOnLegacyStore?.();
      }
    },
    onFailure: console.error,
    dependencies: [onClose],
  });

  const handleConfirm = async () => {
    const selectedReasonsArray = Object.entries(selectedReasons)
      .filter(([, value]) => value === "checked")
      .map(([reason]) => reason as FeedbackReason);

    handleGoToLegacy({
      data: {
        selectedReasons: selectedReasonsArray,
        additionalFeedback,
        sourceUrl: window.location.pathname,
      },
      locale: i18n.resolvedLanguage,
      version: REVAMPED_BACKOFFICE_VERSION,
    });
  };

  useEffect(() => {
    if (!open) {
      setSelectedReasons(DEFAULT_SELECTED_REASONS);
      setAdditionalFeedback("");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      size="md"
      title={t("title")}
      confirmButton={{
        label: t("confirm"),
        onClick: handleConfirm,
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("cancel"),
        onClick: onClose,
        disabled: isLoading,
      }}
      onClose={onClose}
    >
      <div className="p-sm flex flex-col gap-xs">
        <div className="flex flex-col gap-md">
          <Body htmlVariant="p" size="md">
            {t("description")}
          </Body>

          <Body htmlVariant="p" size="md">
            {t("mainQuestion")}
          </Body>
        </div>

        <div className="flex flex-col gap-xs">
          {(Object.keys(DEFAULT_SELECTED_REASONS) as FeedbackReason[]).map(
            (reason) => (
              <Checkbox
                key={reason}
                id={`${baseId}-${reason}-checkbox`}
                value={selectedReasons[reason]}
                label={t(`reasons.${reason}`)}
                onChange={() => handleReasonToggle(reason)}
              />
            ),
          )}
        </div>

        <div className="flex flex-col gap-2xs">
          <Body htmlVariant="p" size="md">
            {t("additionalFeedbackQuestion")}
          </Body>
          <TextArea
            id={`${baseId}-additional-feedback`}
            status="default"
            value={additionalFeedback}
            onChange={handleTextAreaChange}
            placeholder={t("additionalFeedbackPlaceholder")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackDialog;

export const useFeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return { open, openDialog, closeDialog } as const;
};
