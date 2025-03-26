import { useState } from "react";
import { ListLayout, Button, Tooltip } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";
import { GiftcardListContent } from "./GiftcardListContent";
import { GiftcardImageUploadModal } from "./GiftcardImageUploadModal";

export const GiftcardListPage: React.FC = () => {
  const { t } = useTranslation("common");
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

  const navigateToCreatePage = () => console.log("Create giftcard");

  const navigateToArchivePage = () => window.location.assign("/archived");

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
              iconLeft="box"
              intent="default"
              color="main"
              size="md"
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
