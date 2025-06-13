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

import { fetch } from "#src/utils/fetch";
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

  // ----- State -----

  const memberIrregularities: MemberStatuses[] =
    useMemberStore(selectIrregularities);

  // ----- Handlers -----

  const handleRestore = useCallback(async () => {
    // Restore the member
    const response = await restoreMemberAction(fetch, { memberId });

    const onSuccess = () => {
      // Refresh the list
      refreshPageList();

      // Display a toast to inform about the success
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("toasts.messageUndone.success"),
        buttonIcon: "x-close",
      });
    };

    const onFailure = (error: Error) => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "reverse-left",
        title: t("toasts.messageUndone.error"),
        buttonIcon: "x-close",
      });

      // Debugging
      console.error(error);
    };

    response.fold(onSuccess, onFailure);
  }, [refreshPageList, memberId, t]);

  const handleArchive = useCallback(async () => {
    // Archive the Member
    const response = await archiveMemberAction(fetch, { memberId });

    const onSuccess = () => {
      // Refresh the list page
      refreshPageList();

      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "archive",
        title: t("toasts.messageArchived.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: handleRestore,
      });

      // Close the modal
      onClose();
    };

    const onFailure = (error: Error) => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "archive",
        title: t("toasts.messageArchived.error"),
        buttonIcon: "x-close",
      });

      // Debugging
      console.error(error);

      // Close the modal
      onClose();
    };

    response.fold(onSuccess, onFailure);
  }, [refreshPageList, handleRestore, memberId, onClose, t]);

  // ----- Load data -----

  useEffect(() => {
    if (memberId) {
      interrogateMemberRegularityAction(fetch, { memberId });
    }
  }, [memberId]);

  return (
    <Modal
      open
      confirmButton={{
        label: t("listPage.archiveModal.buttons.archive"),
        color: "critical",
        onClick: handleArchive,
      }}
      cancelButton={{
        label: t("listPage.archiveModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
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
