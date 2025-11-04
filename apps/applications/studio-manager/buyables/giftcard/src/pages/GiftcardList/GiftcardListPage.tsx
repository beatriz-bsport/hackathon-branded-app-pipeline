import { useState } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";

import { LEGACY_ROUTES, ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardImageUploadModal } from "./GiftcardImageUploadModal";
import { GiftcardListContent } from "./GiftcardListContent";

export const GiftcardListPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const navigateToCreatePage = () =>
    (window.location.href = LEGACY_ROUTES.CREATE);

  const navigateToArchivePage = () => navigate(ROUTES.ARCHIVED);

  const openImageBankModal = () => setOpenImageModal(true);

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.list")}
        callToActionButton={
          <Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            size="md"
            label={t("listPage.header.buttons.addGiftcard")}
            onClick={navigateToCreatePage}
          />
        }
        endGroupActions={[
          <Tooltip
            key="bt-navigate-to-archive-page"
            label={t("pages.archivedList")}
            placement="bottom-left"
          >
            <Button
              kind="icon-button"
              icon="box"
              intent="default"
              color="main"
              size="md"
              label={t("pages.archivedList")}
              onClick={navigateToArchivePage}
            />
          </Tooltip>,
          <Button
            key="bt-open-button-bank-image"
            iconLeft="gift-02"
            intent="default"
            color="main"
            size="md"
            label={t("listPage.header.buttons.openBankImage")}
            onClick={openImageBankModal}
          />,
        ]}
      />
      <ListLayout.Content>
        <GiftcardListContent onAddGiftcardClick={navigateToCreatePage} />
      </ListLayout.Content>
      {openImageModal && (
        <GiftcardImageUploadModal
          isOpen={openImageModal}
          onCloseModal={() => setOpenImageModal(false)}
        />
      )}
    </ListLayout>
  );
};
