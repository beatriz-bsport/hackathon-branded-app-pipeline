import React, { useEffect, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

// Selectors

import {
  getAllEstablishmentsDict,
  getAssociatedEstablishmentGroup,
  getEstablishmentsSelectedInRole,
} from '#src/libs/establishment/selectors';
import {
  getMemberNextBookingOrPrivateBooking,
  getMemberVisitIsLoading,
  getUserPhotoUpdatesList,
} from '#src/libs/access-control/selectors';

// Actions

import { search } from '#src/libs/member/actions';
import {
  approvePhotoUpdate as approvePhotoUpdateAction,
  checkMemberInEstablishment as checkMemberInEstablishmentAction,
  getUserPhotoUpdates as getUserPhotoUpdatesAction,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAction,
  retrieveMemberNextBookingOrPrivateBooking as retrieveMemberNextBookingOrPrivateBookingAction,
  retrieveMemberVisit as retrieveMemberVisitAction,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAction,
} from '#src/libs/access-control/actions';

// Components

import MemberVisitPlaceHolder from '#src/libs/access-control/components/MemberVisit/EmptyState/MemberVisitPlaceHolder.component';
import MemberVisitSearchMemberComponent from '#src/libs/access-control/components/MemberVisit/EmptyState/MemberVisitSearchMember.component';
import MemberVisitDetailsCard from '#src/libs/access-control/components/MemberVisit/MemberVisitDetailsCard/MemberVisitDetailsCard.component';
import MemberVisitHeadButtons from '#src/libs/access-control/components/MemberVisit/MemberVisitHeadButtons.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import AccessStatusChangedSuccessModal from '#src/libs/access-control/components/MemberVisit/AccessStatusChangedSuccessModal.component';
import EntryStatusChangedModalComponent from '#src/libs/access-control/components/MemberVisit/EntryStatusChangedModal.component';
import StaffLocationBlocker from '#src/libs/access-control/components/MemberVisit/StaffLocationBlocker.component';
import MemberVisitWarnings from '#src/libs/access-control/components/MemberVisit/MemberVisitWarnings.component';
import MemberPhotoHistoryModal from '#src/libs/access-control/components/MemberVisit/MemberPhotoHistoryModal.component';

// Constants

import { AccessStatus, EntryStatus } from '#src/libs/access-control/constants';
import { BroadcastChannelMessageType } from '#src/libs/broadcast-channel/types';

// Types

import type { MemberVisitREST } from '#src/libs/access-control/types';

// Hooks / hocs

import { useBroadcastChannel } from '#src/libs/broadcast-channel/hooks';
import { useCheckAccessControlLocationSetup } from '#src/libs/access-control/hooks/checkLocationSetup';

import withQueryParamsToProps from '#src/hocs/query-params-to-props.hoc';
import type { RootState } from '../../reducers';

type OwnProps = {
  location: Location;
};

type WithQueryParamsProps = OwnProps & {
  memberVisitOverrideId: number;
};

export type Props = WithQueryParamsProps & ConnectedProps<typeof connector>;

export const useMemberVisitPageDataManager = ({
  approvePhotoUpdate,
  checkMemberInEstablishment,
  establishmentGroups,
  establishmentsData,
  establishmentsSelectedInRole,
  getMemberPhotoHistory,
  memberPhotoHistory,
  memberVisitOverrideId,
  refreshMemberVisitAccessStatus,
  retrieveMemberNextBookingOrPrivateBooking,
  retrieveMemberVisit,
  setMemberVisitEntryStatus,
}: Pick<
  Props,
  | 'approvePhotoUpdate'
  | 'checkMemberInEstablishment'
  | 'establishmentGroups'
  | 'establishmentsData'
  | 'establishmentsSelectedInRole'
  | 'getMemberPhotoHistory'
  | 'memberPhotoHistory'
  | 'memberVisitOverrideId'
  | 'refreshMemberVisitAccessStatus'
  | 'retrieveMemberNextBookingOrPrivateBooking'
  | 'retrieveMemberVisit'
  | 'setMemberVisitEntryStatus'
>) => {
  /** -------------- STATE --------------- */

  const [isEmptyState, setIsEmptyState] = React.useState(
    !memberVisitOverrideId,
  );

  const [memberVisit, setMemberVisit] = React.useState<MemberVisitREST | null>(
    null,
  );

  const [showMemberPhotoHistoryModal, setShowMemberPhotoHistoryModal] =
    React.useState(false);

  // Modals
  const [showStatusChangeSuccessModal, setShowStatusChangeSuccessModal] =
    React.useState(false);
  const [showEntryStatusChangedModal, setShowEntryStatusChangedModal] =
    React.useState(false);

  /** -------------- HOOKS --------------- */

  const sendToBroadcastChannel = useBroadcastChannel<MemberVisitREST>(
    ({ type, payload }) => {
      if (
        type === BroadcastChannelMessageType.accessControlMemberVisitCreate &&
        payload
      ) {
        setMemberVisit(payload);
        setIsEmptyState(false);
      }
    },
    { listenSelf: true },
  );

  /** ------------- EFFECTS --------------- */

  // Fetch member data after check-in
  useEffect(() => {
    if (memberVisit?.member?.id) {
      retrieveMemberNextBookingOrPrivateBooking(memberVisit.member.id);
      getMemberPhotoHistory(memberVisit.member.id);
    }
  }, [
    getMemberPhotoHistory,
    memberVisit?.member?.id,
    retrieveMemberNextBookingOrPrivateBooking,
  ]);

  // If the memberVisitOverrideId is present, fetch the member visit data
  useEffect(() => {
    if (memberVisitOverrideId) {
      retrieveMemberVisit(memberVisitOverrideId, {
        onSuccess: (data) => {
          // Remove the ?id=[number] query param from the URL, to avoid re-displaying it on page refresh
          window.history.replaceState({}, '', window.location.pathname);
          setMemberVisit(data);
          setIsEmptyState(false);
        },
      });
    }
  }, [memberVisitOverrideId, retrieveMemberVisit]);

  /** -------------- HANDLERS --------------- */

  // Modals

  const handleCloseAccessStatusChangeSuccessModal = useCallback(() => {
    setShowStatusChangeSuccessModal(false);
  }, [setShowStatusChangeSuccessModal]);

  const handleCloseEntryStatusChangedModal = useCallback(() => {
    setShowEntryStatusChangedModal(false);
  }, [setShowEntryStatusChangedModal]);

  const handleOpenMemberPhotoHistoryModal = useCallback(() => {
    setShowMemberPhotoHistoryModal(true);
  }, [setShowMemberPhotoHistoryModal]);

  const handleCloseMemberPhotoHistoryModal = useCallback(() => {
    setShowMemberPhotoHistoryModal(false);
  }, [setShowMemberPhotoHistoryModal]);

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
      onSuccess: (data) => {
        setMemberVisit(data);
        sendToBroadcastChannel({
          type: BroadcastChannelMessageType.accessControlMemberVisitRefresh,
          payload: data,
        });
        if (
          data.access_status !== data.initial_access_status &&
          data.access_status === AccessStatus.GREEN
        ) {
          setShowStatusChangeSuccessModal(true);
        }
      },
    });
    retrieveMemberNextBookingOrPrivateBooking(memberVisit.member.id);
    getMemberPhotoHistory(memberVisit.member.id);
  }, [
    getMemberPhotoHistory,
    memberVisit,
    refreshMemberVisitAccessStatus,
    retrieveMemberNextBookingOrPrivateBooking,
    sendToBroadcastChannel,
    setMemberVisit,
    setShowStatusChangeSuccessModal,
  ]);

  const handleApprovePhotoUpdate = useCallback(() => {
    if (memberPhotoHistory.length) {
      approvePhotoUpdate(memberPhotoHistory[0].uuid, {
        onSuccess: handleRefreshMemberVisitAccessStatus,
      });
    }
    handleCloseMemberPhotoHistoryModal();
  }, [
    approvePhotoUpdate,
    memberPhotoHistory,
    handleCloseMemberPhotoHistoryModal,
    handleRefreshMemberVisitAccessStatus,
  ]);

  // Member check-in

  const handleCheckInMember = useCallback(
    (memberId: number) => {
      checkMemberInEstablishment(
        {
          memberId,
          establishmentIds: establishmentsSelectedInRole,
          displaySnackbar: false,
        },
        {
          onSuccess: (data) => {
            sendToBroadcastChannel({
              type: BroadcastChannelMessageType.accessControlMemberVisitCreate,
              payload: data,
            });
            setMemberVisit(data);
          },
        },
      );
      setIsEmptyState(false);
    },
    [
      checkMemberInEstablishment,
      establishmentsSelectedInRole,
      sendToBroadcastChannel,
      setMemberVisit,
      setIsEmptyState,
    ],
  );

  // Manual entry

  const handleAllowManualEntry = useCallback(() => {
    setMemberVisitEntryStatus(memberVisit.id, EntryStatus.ENTERED, {
      onSuccess: (data: MemberVisitREST) => {
        sendToBroadcastChannel({
          type: BroadcastChannelMessageType.accessControlSetEntryStatus,
          payload: data,
        });
        setMemberVisit(data);
        setShowEntryStatusChangedModal(true);
      },
    });
  }, [memberVisit, setMemberVisitEntryStatus, sendToBroadcastChannel]);

  const handleRefuseManualEntry = useCallback(() => {
    setMemberVisitEntryStatus(memberVisit.id, EntryStatus.NOT_ENTERED, {
      onSuccess: (data: MemberVisitREST) => {
        sendToBroadcastChannel({
          type: BroadcastChannelMessageType.accessControlSetEntryStatus,
          payload: data,
        });
        setMemberVisit(data);
        setShowEntryStatusChangedModal(true);
      },
    });
  }, [memberVisit, setMemberVisitEntryStatus, sendToBroadcastChannel]);

  const {
    showLocationBlocker,
    establishmentObjects: establishmentsInRole,
    staffLocationEstablishmentGroup,
    staffLocationAddress,
  } = useCheckAccessControlLocationSetup({
    establishmentsData,
    establishmentsToCheck: establishmentsSelectedInRole,
    establishmentGroups,
  });

  return {
    establishmentsInRole,
    handleAllowManualEntry,
    handleApprovePhotoUpdate,
    handleCheckInMember,
    handleCloseAccessStatusChangeSuccessModal,
    handleCloseEntryStatusChangedModal,
    handleCloseMemberPhotoHistoryModal,
    handleCloseMemberVisit,
    handleMemberBillClick,
    handleMemberProfileClick,
    handleOpenMemberPhotoHistoryModal,
    handleRefreshMemberVisitAccessStatus,
    handleRefuseManualEntry,
    isEmptyState,
    memberVisit,
    showEntryStatusChangedModal,
    showLocationBlocker,
    showMemberPhotoHistoryModal,
    showStatusChangeSuccessModal,
    staffLocationAddress,
    staffLocationEstablishmentGroup,
  };
};

const MemberVisit: React.FC<Props> = React.memo(
  ({
    approvePhotoUpdate,
    checkMemberInEstablishment,
    establishmentGroups,
    establishmentsData,
    establishmentsSelectedInRole,
    getMemberPhotoHistory,
    memberNextBookingOrPrivateBooking,
    memberPhotoHistory,
    memberVisitIsLoading,
    memberVisitOverrideId,
    refreshMemberVisitAccessStatus,
    retrieveMemberNextBookingOrPrivateBooking,
    retrieveMemberVisit,
    searchMembers,
    setMemberVisitEntryStatus,
    theme,
  }) => {
    const classes = useStyles();
    const { t } = useTranslation('accessControl');

    const {
      establishmentsInRole,
      handleAllowManualEntry,
      handleApprovePhotoUpdate,
      handleCheckInMember,
      handleCloseAccessStatusChangeSuccessModal,
      handleCloseEntryStatusChangedModal,
      handleCloseMemberPhotoHistoryModal,
      handleCloseMemberVisit,
      handleMemberBillClick,
      handleMemberProfileClick,
      handleOpenMemberPhotoHistoryModal,
      handleRefreshMemberVisitAccessStatus,
      handleRefuseManualEntry,
      isEmptyState,
      memberVisit,
      showEntryStatusChangedModal,
      showLocationBlocker,
      showMemberPhotoHistoryModal,
      showStatusChangeSuccessModal,
      staffLocationAddress,
      staffLocationEstablishmentGroup,
    } = useMemberVisitPageDataManager({
      approvePhotoUpdate,
      checkMemberInEstablishment,
      establishmentGroups,
      establishmentsData,
      establishmentsSelectedInRole,
      getMemberPhotoHistory,
      memberPhotoHistory,
      memberVisitOverrideId,
      refreshMemberVisitAccessStatus,
      retrieveMemberNextBookingOrPrivateBooking,
      retrieveMemberVisit,
      setMemberVisitEntryStatus,
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
                  disabled={showLocationBlocker}
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
              handleOpenMemberPhotoHistoryModal={
                !!memberPhotoHistory?.length &&
                handleOpenMemberPhotoHistoryModal
              }
              isLoading={memberVisitIsLoading}
              memberVisit={memberVisit}
              nextBooking={memberNextBookingOrPrivateBooking}
              onAllowManualEntry={handleAllowManualEntry}
              onMemberBillClick={handleMemberBillClick}
              onMemberProfileClick={handleMemberProfileClick}
              onRefuseManualEntry={handleRefuseManualEntry}
            />
            <MemberVisitWarnings
              isLoading={memberVisitIsLoading}
              memberVisit={memberVisit}
            />
          </>
        )}
        <MemberPhotoHistoryModal
          memberPhotoHistory={memberPhotoHistory}
          onClose={handleCloseMemberPhotoHistoryModal}
          onValidateIdentity={
            memberPhotoHistory.length &&
            memberVisit?.access_status_data?.check_on_member_account
              ?.last_photo_update_is_not_approved
              ? handleApprovePhotoUpdate
              : null
          }
          open={showMemberPhotoHistoryModal}
        />
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
const mapStateToProps = (state: RootState) => {
  return {
    establishmentGroups: getAssociatedEstablishmentGroup(state),
    establishmentsData: getAllEstablishmentsDict(state),
    establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
    memberPhotoHistory: getUserPhotoUpdatesList(state),
    memberVisitIsLoading: getMemberVisitIsLoading(state),
    memberNextBookingOrPrivateBooking:
      getMemberNextBookingOrPrivateBooking(state),
    theme: state.theme.theme,
  };
};

const mapDispatchToProps = {
  approvePhotoUpdate: approvePhotoUpdateAction,
  checkMemberInEstablishment: checkMemberInEstablishmentAction,
  getMemberPhotoHistory: getUserPhotoUpdatesAction,
  refreshMemberVisitAccessStatus: refreshMemberVisitAccessStatusAction,
  retrieveMemberNextBookingOrPrivateBooking:
    retrieveMemberNextBookingOrPrivateBookingAction,
  retrieveMemberVisit: retrieveMemberVisitAction,
  searchMembers: search,
  setMemberVisitEntryStatus: setMemberVisitEntryStatusAction,
};

const connector = connect<
  ReturnType<typeof mapStateToProps>,
  typeof mapDispatchToProps,
  WithQueryParamsProps
>(mapStateToProps, mapDispatchToProps);

export default compose<Props, OwnProps>(
  withQueryParamsToProps(['id', 'memberVisitOverrideId', 'number']),
  connector,
)(MemberVisit);
