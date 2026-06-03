import { type FC, useCallback, useEffect, useId, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { type Establishment } from "@bsport/api-book";
import { ControlledForm } from "@bsport/form";
import {
  Body,
  DetailsLayout,
  Modal,
  type TabsProps,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { VenueArchiveModal } from "#src/components/venue-archive-modal/venue-archive-modal";
import { VenueDetailHeader } from "#src/components/venue-detail/venue-detail-header";
import { VenueEditorTab } from "#src/components/venue-detail/venue-editor-tab";
import { useVenueForm } from "#src/hooks/use-venue-form";
import { useVenuesModals } from "#src/hooks/use-venues-modals";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const VALID_TABS = ["editor", "calendar"] as const;
type VenueDetailTab = (typeof VALID_TABS)[number];

const getActiveTab = (raw: string | null): VenueDetailTab =>
  (VALID_TABS as readonly string[]).includes(raw ?? "")
    ? (raw as VenueDetailTab)
    : "editor";

type Props = {
  venue: Establishment;
};

export const VenueDetailShell: FC<Props> = ({ venue }) => {
  const { t } = useTranslation("venues-list");
  const navigate = useNavigate();
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const { modalState, openArchiveModal, closeModal } = useVenuesModals();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));

  const { methods, isPending, submit } = useVenueForm({
    venue,
    mode: "onSubmit",
  });

  const formId = `venue-editor-form-${useId()}`;
  const isDirty = methods.formState.isDirty;
  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
  }, [isDirty, toggleHasUnsavedChanges]);

  const [isDiscardOpen, setDiscardOpen] = useState(false);
  const openDiscard = useCallback(() => setDiscardOpen(true), []);
  const closeDiscard = useCallback(() => setDiscardOpen(false), []);

  function handleDiscardConfirm() {
    methods.reset();
    closeDiscard();
    toast({
      status: "default",
      icon: "flip-forward",
      buttonIcon: "x",
      description: t("detail.editor.discard.toast"),
    });
  }

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const pageTabs: TabsProps = {
    value: activeTab,
    onValueChange: handleTabChange,
    orientation: "horizontal",
    tabs: [
      { id: "editor", label: t("detail.tabs.editor") },
      { id: "calendar", label: t("detail.tabs.calendar") },
    ],
  };

  return (
    <>
      <ControlledForm {...methods} onSubmit={submit} id={formId}>
        <DetailsLayout {...detailsLayoutProps}>
          <VenueDetailHeader
            venue={venue}
            pageTabs={pageTabs}
            onArchive={openArchiveModal}
          />
          <DetailsLayout.Content>
            {activeTab === "editor" && <VenueEditorTab />}
            {activeTab === "calendar" && (
              <Body size="md" color="default">
                {t("detail.comingSoon")}
              </Body>
            )}
          </DetailsLayout.Content>
          {activeTab === "editor" && (
            <DetailsLayout.Confirmation
              onDiscard={openDiscard}
              formSubmit={{ formId, isSubmitting: isPending }}
            />
          )}
        </DetailsLayout>
      </ControlledForm>
      {modalState?.type === "archive" && (
        <VenueArchiveModal
          venue={modalState.venue}
          onClose={closeModal}
          onArchived={() => navigate(ABSOLUTE_ROUTES.ARCHIVED)}
        />
      )}
      {isDiscardOpen && (
        <Modal
          open
          size="md"
          title={t("detail.editor.discard.title")}
          onCloseButtonClick={closeDiscard}
          onClickOutside={closeDiscard}
          confirmButton={{
            label: t("detail.editor.discard.confirm"),
            color: "critical",
            onClick: handleDiscardConfirm,
          }}
          cancelButton={{
            label: t("detail.editor.discard.keepEditing"),
            onClick: closeDiscard,
          }}
        >
          <Body htmlVariant="p">{t("detail.editor.discard.description")}</Body>
        </Modal>
      )}
    </>
  );
};
