import React, { useEffect, useCallback } from 'react';

import { WithTranslation, useTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import MemberVisitWarningsComponent from '#libs/access-control/components/MemberVisit/MemberVisitWarnings.component';

// Selectors

import {
  getAllEstablishmentsDict,
  getAssociatedEstablishmentGroup,
  getEstablishmentsSelectedInRole,
} from '#libs/establishment/selectors';
import { getMemberVisitIsLoading } from '#libs/access-control/selectors';
import { getAllBookingAndPrivateBooking } from '#libs/consumer-space/selectors';

// Actions

import {
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#libs/establishment/actions';
import { search } from '#libs/member/actions';
import {
  checkMemberInEstablishment as checkMemberInEstablishmentAction,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAction,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAction,
} from '#libs/access-control/actions';
import {
  fetchBookingsAndPrivateBookings as fetchBookingsAndPrivateBookingsAction,
  BookingsAndPrivateBookingsTypeEnum,
} from '#libs/consumer-space/actions';

// Components

import MemberVisitPlaceHolder from '#libs/access-control/components/MemberVisit/EmptyState/MemberVisitPlaceHolder.component';
import MemberVisitSearchMemberComponent from '#libs/access-control/components/MemberVisit/EmptyState/MemberVisitSearchMember.component';
import MemberVisitDetailsCard from '#libs/access-control/components/MemberVisit/MemberVisitDetailsCard/MemberVisitDetailsCard.component';
import MemberVisitHeadButtons from '#libs/access-control/components/MemberVisit/MemberVisitHeadButtons.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import AccessStatusChangedSuccessModal from '#libs/access-control/components/MemberVisit/AccessStatusChangedSuccessModal.component';
import EntryStatusChangedModalComponent from '#libs/access-control/components/MemberVisit/EntryStatusChangedModal.component';
import StaffLocationBlocker from '#libs/access-control/components/MemberVisit/StaffLocationBlocker.component';

// Constants

import { AccessStatus, EntryStatus } from '#libs/access-control/constants';

// Types

import type { RootState } from '../../reducers';

// Hooks

import { useAccessControlBroadcastChannel } from '#libs/access-control/hooks/broadcastChannel';
import { useCheckAccessControlLocationSetup } from '#libs/access-control/hooks/checkLocationSetup';

import type { MemberVisitREST } from '#libs/access-control/types';

export type Props = ConnectedProps<typeof connector> & WithTranslation;

export const useMemberVisitPageDataManager = ({
  checkMemberInEstablishment,
  establishmentGroups,
  establishmentsData,
  establishmentsSelectedInRole,
  fetchAllEstablishmentGroup,
  fetchBookingsAndPrivateBookings,
  fetchEstablishmentBulk,
  refreshMemberVisitAccessStatus,
  setMemberVisitEntryStatus,
  theme,
}: Pick<
  Props,
  | 'checkMemberInEstablishment'
  | 'establishmentGroups'
  | 'establishmentsData'
  | 'establishmentsSelectedInRole'
  | 'fetchAllEstablishmentGroup'
  | 'fetchBookingsAndPrivateBookings'
  | 'fetchEstablishmentBulk'
  | 'refreshMemberVisitAccessStatus'
  | 'setMemberVisitEntryStatus'
  | 'theme'
>) => {
  /** -------------- STATE --------------- */

  const [isEmptyState, setIsEmptyState] = React.useState(true);

  const [memberVisit, setMemberVisit] = React.useState<MemberVisitREST | null>(
    null,
  );

  // Modals
  const [showStatusChangeSuccessModal, setShowStatusChangeSuccessModal] =
    React.useState(false);
  const [showEntryStatusChangedModal, setShowEntryStatusChangedModal] =
    React.useState(false);

  /** -------------- BROADCAST CHANNEL --------------- */

  const sendToAccessControlBroadcastChannel = useAccessControlBroadcastChannel(
    (_memberVisit: MemberVisitREST) => {
      if (_memberVisit) {
        setMemberVisit(_memberVisit);
        setIsEmptyState(false);
      }
    },
  );

  /** ------------- EFFECTS --------------- */

  // Fetch data on component mount
  useEffect(() => {
    fetchEstablishmentBulk(establishmentsSelectedInRole);
    if (theme.enable_multi_localization) {
      fetchAllEstablishmentGroup();
    }
  }, [
    fetchEstablishmentBulk,
    establishmentsSelectedInRole,
    theme,
    fetchAllEstablishmentGroup,
  ]);

  // Fetch member data after check-in
  useEffect(() => {
    if (memberVisit?.member?.id) {
      fetchBookingsAndPrivateBookings({
        member: memberVisit.member.id,
        date_start: null,
        type: BookingsAndPrivateBookingsTypeEnum.todayNextBookingUntil2amOnly,
        mine: false,
        forceRefetch: true,
      });
    }
  }, [fetchBookingsAndPrivateBookings, memberVisit?.member?.id]);

  /** -------------- HANDLERS --------------- */

  // Modals

  const handleCloseAccessStatusChangeSuccessModal = useCallback(() => {
    setShowStatusChangeSuccessModal(false);
  }, [setShowStatusChangeSuccessModal]);

  const handleCloseEntryStatusChangedModal = useCallback(() => {
    setShowEntryStatusChangedModal(false);
  }, [setShowEntryStatusChangedModal]);

  // Actions on member

  const handleMemberProfileClick = useCallback(() => {
    if (memberVisit?.member?.id) {
      window.open(`/member/${memberVisit.member.id}`);
    }
  }, [memberVisit]);

  const handleMemberBillClick = useCallback(() => {
    if (memberVisit?.member?.id) {
      window.open(`/invoice/bill-member/${memberVisit.member.id}`);
    }
  }, [memberVisit]);

  // Header actions

  const handleCloseMemberVisit = useCallback(() => {
    setMemberVisit(null);
    setIsEmptyState(true);
  }, []);

  const handleRefreshMemberVisitAccessStatus = useCallback(() => {
    refreshMemberVisitAccessStatus(memberVisit.id, {
      onSuccess: (data: MemberVisitREST) => {
        sendToAccessControlBroadcastChannel(data);
        if (
          data.access_status !== data.initial_access_status &&
          data.access_status === AccessStatus.GREEN
        ) {
          setShowStatusChangeSuccessModal(true);
        }
      },
    });
    fetchBookingsAndPrivateBookings({
      member: memberVisit.member.id,
      date_start: null,
      type: BookingsAndPrivateBookingsTypeEnum.todayNextBookingUntil2amOnly,
      mine: false,
      forceRefetch: true,
    });
  }, [
    refreshMemberVisitAccessStatus,
    sendToAccessControlBroadcastChannel,
    memberVisit,
    fetchBookingsAndPrivateBookings,
  ]);

  // Member check-in

  const handleCheckInMember = useCallback(
    (memberId: number) => {
      checkMemberInEstablishment(
        {
          memberId,
          establishmentIds: establishmentsSelectedInRole,
        },
        {
          onSuccess: (data: MemberVisitREST) => {
            sendToAccessControlBroadcastChannel(data);
            setMemberVisit(data);
          },
        },
      );
      setIsEmptyState(false);
    },
    [
      establishmentsSelectedInRole,
      checkMemberInEstablishment,
      sendToAccessControlBroadcastChannel,
    ],
  );

  // Manual entry

  const handleAllowManualEntry = useCallback(() => {
    setMemberVisitEntryStatus(memberVisit.id, EntryStatus.ENTERED, {
      onSuccess: (data: MemberVisitREST) => {
        sendToAccessControlBroadcastChannel(data);
        setMemberVisit(data);
        setShowEntryStatusChangedModal(true);
      },
    });
  }, [
    memberVisit,
    setMemberVisitEntryStatus,
    sendToAccessControlBroadcastChannel,
  ]);

  const handleRefuseManualEntry = useCallback(() => {
    setMemberVisitEntryStatus(memberVisit.id, EntryStatus.NOT_ENTERED, {
      onSuccess: (data: MemberVisitREST) => {
        sendToAccessControlBroadcastChannel(data);
        setMemberVisit(data);
        setShowEntryStatusChangedModal(true);
      },
    });
  }, [
    memberVisit,
    setMemberVisitEntryStatus,
    sendToAccessControlBroadcastChannel,
  ]);

  const {
    showLocationBlocker,
    establishmentObjects: establishmentsInRole,
    staffLocationEstablishmentGroup,
    staffLocationAddress,
  } = useCheckAccessControlLocationSetup({
    establishmentsData,
    establishmentsToCheck: establishmentsSelectedInRole,
    establishmentGroups,
    enableMultilocalization: theme.enable_multi_localization,
  });

  return {
    establishmentsInRole,
    handleAllowManualEntry,
    handleCheckInMember,
    handleCloseAccessStatusChangeSuccessModal,
    handleCloseEntryStatusChangedModal,
    handleCloseMemberVisit,
    handleMemberBillClick,
    handleMemberProfileClick,
    handleRefreshMemberVisitAccessStatus,
    handleRefuseManualEntry,
    isEmptyState,
    memberVisit,
    showEntryStatusChangedModal,
    showLocationBlocker,
    showStatusChangeSuccessModal,
    staffLocationAddress,
    staffLocationEstablishmentGroup,
  };
};

const MemberVisit: React.FC<Props> = React.memo(
  ({
    bookingAndPrivateBooking,
    checkMemberInEstablishment,
    establishmentGroups,
    establishmentsData,
    establishmentsSelectedInRole,
    fetchAllEstablishmentGroup,
    fetchBookingsAndPrivateBookings,
    fetchEstablishmentBulk,
    memberVisitIsLoading,
    refreshMemberVisitAccessStatus,
    searchMembers,
    setMemberVisitEntryStatus,
    theme,
  }) => {
    const classes = useStyles();
    const { t } = useTranslation('accessControl');

    const {
      establishmentsInRole,
      handleAllowManualEntry,
      handleCheckInMember,
      handleCloseAccessStatusChangeSuccessModal,
      handleCloseEntryStatusChangedModal,
      handleCloseMemberVisit,
      handleMemberBillClick,
      handleMemberProfileClick,
      handleRefreshMemberVisitAccessStatus,
      handleRefuseManualEntry,
      isEmptyState,
      memberVisit,
      showEntryStatusChangedModal,
      showLocationBlocker,
      showStatusChangeSuccessModal,
      staffLocationAddress,
      staffLocationEstablishmentGroup,
    } = useMemberVisitPageDataManager({
      checkMemberInEstablishment,
      establishmentGroups,
      establishmentsData,
      establishmentsSelectedInRole,
      fetchAllEstablishmentGroup,
      fetchBookingsAndPrivateBookings,
      fetchEstablishmentBulk,
      refreshMemberVisitAccessStatus,
      setMemberVisitEntryStatus,
      theme,
    });

    return (
      <div className={classes.root}>
        {isEmptyState ? (
          <>
            <MemberVisitPlaceHolder
              enableMultiLocalization={theme.enable_multi_localization}
              establishments={establishmentsInRole}
              staffLocationAddress={staffLocationAddress}
              staffLocationEstablishmentGroup={staffLocationEstablishmentGroup}
            />
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="member.allowed_actions.search"
            >
              <>
                <Divider />
                <MemberVisitSearchMemberComponent
                  onMemberClick={handleCheckInMember}
                  searchMembers={searchMembers}
                  title={t('memberVisit.emptyState.or')}
                />
              </>
            </ObjectLevelPermissionWrapper>
          </>
        ) : (
          <>
            <MemberVisitHeadButtons
              accessStatus={memberVisit?.access_status || AccessStatus.GREEN}
              isLoading={memberVisitIsLoading}
              onClose={handleCloseMemberVisit}
              onRefresh={handleRefreshMemberVisitAccessStatus}
            />
            <MemberVisitDetailsCard
              isLoading={memberVisitIsLoading}
              memberVisit={memberVisit}
              // @ts-expect-error
              nextBooking={bookingAndPrivateBooking?.[0]}
              onAllowManualEntry={handleAllowManualEntry}
              onMemberBillClick={handleMemberBillClick}
              onMemberProfileClick={handleMemberProfileClick}
              onRefuseManualEntry={handleRefuseManualEntry}
            />
            <MemberVisitWarningsComponent
              isLoading={memberVisitIsLoading}
              memberVisit={memberVisit}
            />
          </>
        )}
        <AccessStatusChangedSuccessModal
          onClose={handleCloseAccessStatusChangeSuccessModal}
          open={showStatusChangeSuccessModal}
        />
        <EntryStatusChangedModalComponent
          entryStatus={memberVisit?.entry_status || EntryStatus.UNKNOWN}
          onCloseMemberPage={handleCloseMemberVisit}
          onStayOnMemberPage={handleCloseEntryStatusChangedModal}
          open={showEntryStatusChangedModal}
        />
        <StaffLocationBlocker open={showLocationBlocker} />
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const connector = connect(
  (state: RootState) => ({
    bookingAndPrivateBooking: getAllBookingAndPrivateBooking(state),
    establishmentGroups: getAssociatedEstablishmentGroup(state),
    establishmentsData: getAllEstablishmentsDict(state),
    establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
    memberVisitIsLoading: getMemberVisitIsLoading(state),
    theme: state.theme.theme,
  }),
  {
    checkMemberInEstablishment: checkMemberInEstablishmentAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchBookingsAndPrivateBookings: fetchBookingsAndPrivateBookingsAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    refreshMemberVisitAccessStatus: refreshMemberVisitAccessStatusAction,
    searchMembers: search,
    setMemberVisitEntryStatus: setMemberVisitEntryStatusAction,
  },
);

export default compose(connector)(MemberVisit);
