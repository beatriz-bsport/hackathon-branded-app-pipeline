import React, { useEffect } from "react";

import {
  MEMBER_STATUS,
  MemberStatuses,
} from "@bsport/common/lib/master-data/member";
import { Alert, Body, Modal } from "@bsport/kaizen-primitive-core";
import {
  interrogateMemberRegularityAction,
  selectIrregularities,
  useMemberStore,
} from "@bsport/store-core-data-member";

import { useArchiveMember } from "#src/hooks/useArchiveMember";
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

  const { isLoading, handleArchive } = useArchiveMember({
    fetchMembers: refreshPageList,
    handleCloseModal: onClose,
  });

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
        onClick: () => handleArchive({ memberId }),
        disabled: isLoading,
      }}
      cancelButton={{
        label: t("listPage.archiveModal.buttons.cancel"),
        onClick: onClose,
        disabled: isLoading,
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
          <Alert type="weak" status="warning" className="mt-xs">
            <Body htmlVariant="p" color="warning" weight="weak">
              {t(
                "listPage.archiveModal.alertIrregularity.adviseRegularization",
              )}
            </Body>
            <ul className="list-disc pl-md text-onsurface-status-warning-weak">
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
