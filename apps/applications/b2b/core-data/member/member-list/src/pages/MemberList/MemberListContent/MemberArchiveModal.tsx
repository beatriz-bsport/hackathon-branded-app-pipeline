import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "#src/utils/i18n";
import { Alert, Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  MEMBER_STATUS,
  MemberStatuses,
} from "@bsport/common/lib/master-data/member";
import {
  archiveMember,
  restoreMember,
  interrogateMemberRegularity,
} from "#src/store-api-pkg";
import { Trans } from "#src/utils/i18n";

type MemberArchiveModalProps = {
  memberId: number;
  memberName: string;
  onClose: () => void;
  refreshPageList: () => void;
};

const MEMBER_IRREGULARITY_TO_TRANSLATION = {
  [MEMBER_STATUS.HAS_NEGATIVE_CREDIT_ACCOUNT]: "negativeBalance",
  [MEMBER_STATUS.HAS_UNPAID_INVOICE]: "unpaidInvoices",
  [MEMBER_STATUS.HAS_ON_GOING_SUBSCRIPTION]: "currentSubscription",
  [MEMBER_STATUS.HAS_AUTO_RENEW_SUBSCRIPTION]: "autorenewalSubscriptions",
  [MEMBER_STATUS.HAS_FUTURE_BOOKINGS]: "futureBookings",
  [MEMBER_STATUS.HAS_RECCURENT_BOOKING]: "recurringBookings",
  [MEMBER_STATUS.HAS_PRIVATE_BOOKING]: "scheduledAppointments",
};

export const MemberArchiveModal: React.FC<MemberArchiveModalProps> = ({
  memberId,
  memberName,
  onClose,
  refreshPageList,
}) => {
  const { t } = useTranslation("common");
  const [memberIrregularities, setMemberIrregularities] = useState<
    MemberStatuses[]
  >([]);

  // ----- Handlers -----

  const handleRestore = useCallback(async () => {
    // Restore the member
    await restoreMember({ memberId });

    // Once executed, refresh the list
    await refreshPageList();
  }, [refreshPageList, restoreMember, memberId]);

  const handleArchive = useCallback(async () => {
    // Archive the Member
    await archiveMember({ memberId });

    // Refresh the list page once the request has finished
    refreshPageList();

    // Display a toast to "undo" the action
    toast({
      status: "default",
      icon: "archive",
      title: t("listPage.archiveModal.toasts.messageArchived", {
        name: memberName,
      }),
      buttonLabel: t("listPage.archiveModal.toasts.actionUndo"),
      onButtonClick: handleRestore,
    });

    // Close the modal
    onClose();
  }, [archiveMember, refreshPageList, handleRestore, memberId, toast]);

  // ----- On load -----

  useEffect(() => {
    if (memberId) {
      const getIrregularity = async () => {
        const response = await interrogateMemberRegularity({ memberId });
        setMemberIrregularities(response);
      };
      getIrregularity();
    }
  }, [memberId]);

  return (
    <Modal
      open
      onConfirmClick={handleArchive}
      onCancelClick={onClose}
      onCrossButtonClick={onClose}
      confirmColor="critical"
      confirmLabel={t("listPage.archiveModal.buttons.archive")}
      cancelLabel={t("listPage.archiveModal.buttons.cancel")}
      title={t("listPage.archiveModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <>
        <Body htmlVariant="p">
          <Trans
            i18nKey="listPage.archiveModal.description.action"
            values={{ name: memberName }}
          />
        </Body>
        <br />
        <Body htmlVariant="p">
          {t("listPage.archiveModal.description.effect")}
        </Body>
        {memberIrregularities.length > 0 && (
          <Alert
            type="weak"
            status="warning"
            onButtonClick={() => {}}
            onClearClick={() => {}}
            isClearable={false}
          >
            <Body htmlVariant="p" color="warning" weight="weak">
              {t(
                "listPage.archiveModal.alertIrregularity.adviseRegularization",
              )}
            </Body>
            <ul className="list-disc pl-md">
              {memberIrregularities.map((identifier) => (
                <li key={`regularization-advice-${identifier}`}>
                  {t(
                    `listPage.archiveModal.alertIrregularity.items.${MEMBER_IRREGULARITY_TO_TRANSLATION[identifier]}`,
                  )}
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </>
    </Modal>
  );
};
