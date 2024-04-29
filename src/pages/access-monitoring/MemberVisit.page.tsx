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
} from '#libs/establishment/selectors';
import {
  getMemberNextBookingOrPrivateBooking,
  getMemberVisit,
  getMemberVisitIsLoading,
  getUserPhotoUpdates,
} from '#libs/access-control/selectors';

// Actions

import { search } from '#libs/member/actions';
import {
  checkMemberInEstablishment as checkMemberInEstablishmentAction,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAction,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAction,
  retrieveMemberNextBookingOrPrivateBooking as retrieveMemberNextBookingOrPrivateBookingAction,
  getUserPhotoUpdates as getUserPhotoUpdatesAction,
  approvePhotoUpdate as approvePhotoUpdateAction,
} from '#libs/access-control/actions';

// Components

import MemberVisitPlaceHolder from '#libs/access-control/components/MemberVisit/EmptyState/MemberVisitPlaceHolder.component';
import MemberVisitSearchMemberComponent from '#libs/access-control/components/MemberVisit/EmptyState/MemberVisitSearchMember.component';
import MemberVisitDetailsCard from '#libs/access-control/components/MemberVisit/MemberVisitDetailsCard/MemberVisitDetailsCard.component';
import MemberVisitHeadButtons from '#libs/access-control/components/MemberVisit/MemberVisitHeadButtons.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import AccessStatusChangedSuccessModal from '#libs/access-control/components/MemberVisit/AccessStatusChangedSuccessModal.component';
import EntryStatusChangedModalComponent from '#libs/access-control/components/MemberVisit/EntryStatusChangedModal.component';
import StaffLocationBlocker from '#libs/access-control/components/MemberVisit/StaffLocationBlocker.component';
import MemberVisitWarnings from '#libs/access-control/components/MemberVisit/MemberVisitWarnings.component';
import MemberPhotoHistoryModal from '#libs/access-control/components/MemberVisit/MemberPhotoHistoryModal.component';

// Constants

import { AccessStatus, EntryStatus } from '#libs/access-control/constants';
import { BroadcastChannelMessageType } from '#libs/broadcast-channel/types';

// Types

import type { RootState } from '../../reducers';
import type { MemberVisitREST } from '#libs/access-control/types';

// Hooks / hocs

import { useBroadcastChannel } from '#libs/broadcast-channel/hooks';
import { useCheckAccessControlLocationSetup } from '#libs/access-control/hooks/checkLocationSetup';

import withQueryParamsToProps from '#hocs/query-params-to-props.hoc';

type OwnProps = {
  location: Location;
};

export type Props = OwnProps & ConnectedProps<typeof connector>;

export const useMemberVisitPageDataManager = ({
  approvePhotoUpdate,
  checkMemberInEstablishment,
  establishmentGroups,
  establishmentsData,
  establishmentsSelectedInRole,
  getMemberPhotoHistory,
  memberPhotoHistory,
  memberVisitOverride,
  refreshMemberVisitAccessStatus,
  retrieveMemberNextBookingOrPrivateBooking,
  setMemberVisitEntryStatus,
  theme,
}: Pick<
  Props,
  | 'approvePhotoUpdate'
  | 'checkMemberInEstablishment'
  | 'establishmentGroups'
  | 'establishmentsData'
  | 'establishmentsSelectedInRole'
  | 'getMemberPhotoHistory'
  | 'memberPhotoHistory'
  | 'memberVisitOverride'
  | 'refreshMemberVisitAccessStatus'
  | 'retrieveMemberNextBookingOrPrivateBooking'
  | 'setMemberVisitEntryStatus'
  | 'theme'
>) => {
  /** -------------- STATE --------------- */

  const [isEmptyState, setIsEmptyState] = React.useState(!memberVisitOverride);

  const [memberVisit, setMemberVisit] = React.useState<MemberVisitREST | null>(
    memberVisitOverride,
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
      approvePhotoUpdate(memberPhotoHistory[0].id);
    }
    handleCloseMemberPhotoHistoryModal();
    handleRefreshMemberVisitAccessStatus();
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
    enableMultilocalization: theme.enable_multi_localization,
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
    memberVisitOverride,
    refreshMemberVisitAccessStatus,
    retrieveMemberNextBookingOrPrivateBooking,
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
      memberVisitOverride,
      refreshMemberVisitAccessStatus,
      retrieveMemberNextBookingOrPrivateBooking,
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
              handleOpenMemberPhotoHistoryModal={
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

type WithQueryParamsProps = OwnProps & {
  memberVisitOverrideId: number;
};

const mapStateToProps = (state: RootState, props: WithQueryParamsProps) => {
  const { memberVisitOverrideId } = props;
  return {
    establishmentGroups: getAssociatedEstablishmentGroup(state),
    establishmentsData: getAllEstablishmentsDict(state),
    establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
    memberPhotoHistory: getUserPhotoUpdates(state),
    memberVisitIsLoading: getMemberVisitIsLoading(state),
    memberVisitOverride: getMemberVisit(state, memberVisitOverrideId),
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
