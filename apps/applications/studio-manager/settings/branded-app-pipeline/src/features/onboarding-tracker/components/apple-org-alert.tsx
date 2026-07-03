import { type FC, useState } from "react";

import { Alert, Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const AppleOrgAlert: FC = () => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Alert
        status="critical"
        type="weak"
        layout="banner"
        title={t("appleOrgWarning.bannerTitle")}
        buttonLabel={t("appleOrgWarning.learnMore")}
        onButtonClick={() => setIsModalOpen(true)}
      >
        {t("appleOrgWarning.bannerBody")}
      </Alert>
      <Modal
        open={isModalOpen}
        size="md"
        title={t("appleOrgWarning.modalTitle")}
        onClose={() => setIsModalOpen(false)}
        cancelButton={{ label: t("appleOrgWarning.close") }}
      >
        <div className="flex flex-col gap-sm">
          <Body size="md" weight="strong">
            {t("appleOrgWarning.mustBeOrg")}
          </Body>
          <ul className="flex list-disc flex-col gap-xs pl-lg">
            <li>
              <Body size="sm">{t("appleOrgWarning.reason1")}</Body>
            </li>
            <li>
              <Body size="sm">{t("appleOrgWarning.reason2")}</Body>
            </li>
            <li>
              <Body size="sm">{t("appleOrgWarning.reason3")}</Body>
            </li>
            <li>
              <Body size="sm">{t("appleOrgWarning.reason4")}</Body>
            </li>
          </ul>
          <Body size="sm">
            <strong>{t("appleOrgWarning.actionLabel")}</strong>{" "}
            {t("appleOrgWarning.actionDetail")}
          </Body>
        </div>
      </Modal>
    </>
  );
};
