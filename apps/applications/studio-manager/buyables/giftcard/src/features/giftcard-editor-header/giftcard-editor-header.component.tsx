import type { FC } from "react";
import { useNavigate } from "react-router";

import type { UseFormControllerOutput } from "@bsport/form";
import { useCopyPaymentLinkButton } from "@bsport/kaizen-business-components/buyables/use-copy-payment-link-button";
import { Button, DetailsLayout } from "@bsport/kaizen-primitive-core";
import type { Giftcard } from "@bsport/store-buyables-giftcard";

import { GiftcardArchiveModal } from "#src/features/giftcard-archive-modal";
import type { GiftcardFormSchema } from "#src/features/giftcard-form/types";
import { useGiftcardDetailsHeader } from "#src/hooks/layout/use-giftcard-details-header";
import { useDisclosure } from "#src/hooks/useDisclosure";
import { LEGACY_URLS, URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardEditNameModal } from "./giftcard-edit-name-modal.component";

type GiftcardEditorHeaderProps = {
  methods: UseFormControllerOutput<GiftcardFormSchema>;
  giftcard: Giftcard;
};

export const GiftcardEditorHeader: FC<GiftcardEditorHeaderProps> = ({
  methods,
  giftcard,
}) => {
  const { t } = useTranslation("giftcard-details");

  const navigate = useNavigate();

  const headerConfigs = useGiftcardDetailsHeader({
    id: giftcard.id,
    isVisible: !methods.watch("manager_only"),
  });

  const paymentLink = LEGACY_URLS.PAYMENT_LINK({
    giftcardId: giftcard.id,
    companyId: giftcard.company,
  });

  const copyPaymentLinkButton = useCopyPaymentLinkButton(paymentLink);

  const {
    isOpen: isArchiveModalOpen,
    onClose: closeArchiveModal,
    onOpen: openArchiveModal,
  } = useDisclosure();

  const {
    isOpen: isEditNameModalOpen,
    onClose: closeEditNameModal,
    onOpen: openEditNameModal,
  } = useDisclosure();

  const { endGroupActions, startGroupActions, isMobile } =
    DetailsLayout.useAdaptiveActions({
      endGroupActions: [copyPaymentLinkButton],
      startGroupActions: giftcard.is_shared_giftcard
        ? []
        : [
            <Button
              key="giftcard-editor-button-delete"
              color="default"
              intent="flat"
              size="md"
              icon="trash-01"
              kind="icon-button"
              label={t("editor.header.archiveGiftcard")}
              onClick={openArchiveModal}
            />,
          ],
      mobileOnlyActions: giftcard.is_shared_giftcard
        ? []
        : [
            <Button
              key="giftcard-editor-button-edit-name"
              color="default"
              intent="flat"
              size="md"
              icon="edit-02"
              kind="icon-button"
              label={t("editor.header.editGiftcardName")}
              onClick={openEditNameModal}
            />,
          ],
    });

  const navigateToListPage = () => {
    navigate(URLS.INDEX);
  };

  const currentGiftcardName = methods.watch("name");

  const updateName = async (newName: string) => {
    methods.setValue("name", newName, {
      shouldDirty: true,
    });
    closeEditNameModal();
  };

  /**
   * If defined, displays the edit button next to the title and assign onClick.
   * Since the mobile action is in the dropdown, make it undefined.
   * It's disabled as well when the Giftcard is shared and can't be edited.
   */
  const onEditTitleClick =
    isMobile || giftcard.is_shared_giftcard ? undefined : openEditNameModal;

  return (
    <>
      <DetailsLayout.Header
        pageTitle={currentGiftcardName}
        {...headerConfigs}
        onEditTitleClick={onEditTitleClick}
        endGroupActions={endGroupActions}
        startGroupActions={startGroupActions}
      />

      <GiftcardArchiveModal
        giftcardId={giftcard.id}
        giftcardName={currentGiftcardName}
        isOpen={isArchiveModalOpen}
        closeModal={closeArchiveModal}
        onSuccess={navigateToListPage}
      />

      <GiftcardEditNameModal
        // This forces rerender of the modal once the form value changes
        key={currentGiftcardName}
        isOpen={isEditNameModalOpen}
        onClose={closeEditNameModal}
        initialName={currentGiftcardName}
        onConfirm={updateName}
      />
    </>
  );
};
