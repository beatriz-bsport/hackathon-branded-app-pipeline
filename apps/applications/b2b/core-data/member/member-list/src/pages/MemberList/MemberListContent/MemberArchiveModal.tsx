import React, { useCallback, useEffect } from "react";

import {
  MEMBER_STATUS,
  MemberStatuses,
} from "@bsport/common/lib/master-data/member";
import { Alert, Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archiveMemberAction,
  interrogateMemberRegularityAction,
  restoreMemberAction,
  selectIrregularities,
  useMemberStore,
} from "@bsport/store-core-data-member";

import fetch from "#src/utils/fetch";
import { Trans, useTranslation } from "#src/utils/i18n";

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
} as const;

export const MemberArchiveModal: React.FC<MemberArchiveModalProps> = ({
  memberId,
  memberName,
  onClose,
  refreshPageList,
}) => {
  const { t } = useTranslation("common");
  const memberIrregularities: MemberStatuses[] =
    useMemberStore(selectIrregularities);

  // ----- Handlers -----

  const handleRestore = useCallback(async () => {
    // Restore the member
    await restoreMemberAction(fetch, { memberId });

    // Once executed, refresh the list
    await refreshPageList();
  }, [refreshPageList, memberId]);

  const handleArchive = useCallback(async () => {
    // Archive the Member
    await archiveMemberAction(fetch, { memberId });

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
  }, [refreshPageList, handleRestore, memberId, toast]);

  // ----- On load -----

  useEffect(() => {
    if (memberId) {
      interrogateMemberRegularityAction(fetch, { memberId });
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
          <Alert type="weak" status="warning">
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
