import { useNavigate } from "react-router";

import {
  Button,
  type ButtonProps,
  ListLayout,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { GiftcardCreateModal } from "#src/features/giftcard-create-modal";
import { useDisclosure } from "#src/hooks/useDisclosure";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardImageUploadModal } from "./GiftcardImageUploadModal";
import { GiftcardListContent } from "./GiftcardListContent";

export const GiftcardListPage: React.FC = () => {
  const { t } = useTranslation("common");

  const {
    isOpen: isImageModalOpen,
    onClose: closeImageModal,
    onOpen: openImageModal,
  } = useDisclosure();

  const {
    isOpen: isCreateModalOpen,
    onClose: closeCreateModal,
    onOpen: openCreateModal,
  } = useDisclosure();

  const navigate = useNavigate();

  const navigateToArchivePage = () => navigate(ROUTES.ARCHIVED);

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedListButton
        key="btn-to-navigate-to-archive-page"
        kind="icon-button"
        icon="box"
        intent="default"
        color="main"
        size="md"
        label={t("pages.archivedList")}
        onClick={navigateToArchivePage}
      />,
      <Button
        key="bt-open-button-bank-image"
        iconLeft="gift-02"
        intent="default"
        color="main"
        size="md"
        label={t("listPage.header.buttons.openBankImage")}
        onClick={openImageModal}
      />,
    ],
  });

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.list")}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("listPage.header.buttons.addGiftcard")}
            onClick={openCreateModal}
          />
        }
        endGroupActions={endGroupActions}
      />
      <ListLayout.Content>
        <GiftcardListContent onAddGiftcardClick={openCreateModal} />
      </ListLayout.Content>

      {isImageModalOpen && (
        <GiftcardImageUploadModal
          isOpen={isImageModalOpen}
          onCloseModal={closeImageModal}
        />
      )}

      <GiftcardCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
    </ListLayout>
  );
};

function GoToArchivedListButton(props: ButtonProps) {
  const { t } = useTranslation("common");

  return (
    <Tooltip label={t("pages.archivedList")} placement="bottom-left">
      <Button {...props} />
    </Tooltip>
  );
}
