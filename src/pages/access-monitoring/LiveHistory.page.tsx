import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ConnectedProps, connect } from 'react-redux';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

/** ACTIONS */
import { search } from '#libs/member/actions';
import {
  getMemberVisitList as getMemberVisitListAction,
  manualUpdateMemberVisitFromBroadcastChannel as manualUpdateMemberVisitFromBroadcastChannelAction,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAction,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAction,
} from '#libs/access-control/actions';
import { fetchBookingsAndPrivateBookings as fetchBookingsAndPrivateBookingsAction } from '#libs/consumer-space/actions';

/** COMPONENTS */
import MemberVisitSearchMember from '#libs/access-control/components/MemberVisit/EmptyState/MemberVisitSearchMember.component';
import MemberVisitLiveHistoryTable from '#libs/access-control/components/MemberVisitLiveHistory/MemberVisitLiveHistoryTable/MemberVisitLiveHistoryTable.component';
import MemberVisitDetailsCard from '#libs/access-control/components/MemberVisit/MemberVisitDetailsCard/MemberVisitDetailsCard.component';
import MemberVisitHeadButtons from '#libs/access-control/components/MemberVisit/MemberVisitHeadButtons.component';
import MemberVisitWarnings from '#libs/access-control/components/MemberVisit/MemberVisitWarnings.component';
import AccessStatusChangedSuccessModal from '#libs/access-control/components/MemberVisit/AccessStatusChangedSuccessModal.component';
import EntryStatusChangedModal from '#libs/access-control/components/MemberVisit/EntryStatusChangedModal.component';

/** SELECTORS */
import {
  getAllMemberVisits,
  getMemberVisitLiveHistoryIsLoading,
} from '#libs/access-control/selectors';
import { getAllBookingAndPrivateBooking } from '#libs/consumer-space/selectors';
import {
  getAllEstablishmentsDict,
  getAssociatedEstablishmentGroup,
  getEstablishmentsSelectedInRole,
} from '#libs/establishment/selectors';

/** CONSTANTS */
import { EntryStatus } from '#libs/access-control/constants';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

/** HOOKS */
import { useLiveHistoryPageDataManager } from '#libs/access-control/hooks/liveHistoryPage';

/** TYPES */
import type { RootState } from 'src/reducers';

export type Props = ConnectedProps<typeof connector>;

const LiveHistory: React.FC<Props> = ({
  bookingAndPrivateBooking,
  establishmentGroups,
  establishmentsData,
  fetchBookingsAndPrivateBookings,
  getMemberVisitList,
  isLoading,
  manualUpdateMemberVisitFromBroadcastChannel,
  memberVisitList,
  memberVisitState,
  refreshMemberVisitAccessStatus,
  searchMembers,
  setMemberVisitEntryStatus,
  theme,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const {
    handleAllowManualEntry,
    handleCloseAccessStatusChangeSuccessModal,
    handleCloseEntryStatusChangedModal,
    handleCloseMemberVisitDetails,
    handleMemberBillClick,
    handleMemberProfileClick,
    handleRefreshFirstPage,
    handleRefreshMemberVisitAccessStatus,
    handleRefuseManualEntry,
    handleSelectedMemberProfileClick,
    handleSelectMember,
    handleSelectMemberVisit,
    locationInformation,
    selectedMemberVisit,
    showEntryStatusChangedModal,
    showStatusChangeSuccessModal,
  } = useLiveHistoryPageDataManager({
    establishmentGroups,
    establishmentsData,
    fetchBookingsAndPrivateBookings,
    getMemberVisitList,
    manualUpdateMemberVisitFromBroadcastChannel,
    memberVisitState,
    refreshMemberVisitAccessStatus,
    setMemberVisitEntryStatus,
    theme,
  });

  if (selectedMemberVisit) {
    return (
      <>
        <div className={classes.root}>
          <div className={classes.header}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.breadcrumbMainText}
                onClick={handleCloseMemberVisitDetails}
              >
                {t('liveHistory.breadcrumbTitle')}
              </Typography>
              <Typography
                variant="body1"
                className={classes.breadcrumbSecondaryText}
              >
                {selectedMemberVisit.member.name}
              </Typography>
            </Breadcrumbs>
            <MemberVisitHeadButtons
              accessStatus={selectedMemberVisit.access_status}
              onRefresh={handleRefreshMemberVisitAccessStatus}
              isLoading={isLoading}
            />
          </div>
          <MemberVisitDetailsCard
            locationInformation={locationInformation}
            memberVisit={selectedMemberVisit}
            // @ts-expect-error - correct booking type, from Booking to BookingREST
            nextBooking={bookingAndPrivateBooking?.[0]}
            onAllowManualEntry={handleAllowManualEntry}
            onRefuseManualEntry={handleRefuseManualEntry}
            onMemberBillClick={handleMemberBillClick}
            onMemberProfileClick={handleSelectedMemberProfileClick}
          />
          <MemberVisitWarnings
            isLoading={false}
            memberVisit={selectedMemberVisit}
          />
        </div>
        <AccessStatusChangedSuccessModal
          onClose={handleCloseAccessStatusChangeSuccessModal}
          open={showStatusChangeSuccessModal}
        />
        <EntryStatusChangedModal
          entryStatus={selectedMemberVisit?.entry_status || EntryStatus.UNKNOWN}
          onCloseMemberPage={handleCloseMemberVisitDetails}
          onStayOnMemberPage={handleCloseEntryStatusChangedModal}
          open={showEntryStatusChangedModal}
        />
      </>
    );
  }

  return (
    <div className={classes.root}>
      <MemberVisitSearchMember
        displayDropDownInPopover
        reducedWidth
        searchMembers={searchMembers}
        onMemberClick={handleSelectMember}
        onClearSearch={handleRefreshFirstPage}
      />
      <MemberVisitLiveHistoryTable
        isLoading={isLoading}
        handleSelectMemberVisit={handleSelectMemberVisit}
        handleMemberProfileClick={handleMemberProfileClick}
        memberVisitList={memberVisitList}
        getMemberVisitList={getMemberVisitList}
        memberVisitState={memberVisitState}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  breadcrumbMainText: { cursor: 'pointer' },
  breadcrumbSecondaryText: { color: theme.palette.text.disabled },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  root: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
}));

const connector = connect(
  (state: RootState) => ({
    bookingAndPrivateBooking: getAllBookingAndPrivateBooking(state),
    establishmentGroups: getAssociatedEstablishmentGroup(state),
    establishmentsData: getAllEstablishmentsDict(state),
    establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
    isLoading: getMemberVisitLiveHistoryIsLoading(state),
    memberVisitList: getAllMemberVisits(state),
    memberVisitState: state.accessControl.memberVisit,
    theme: state.theme.theme,
  }),
  {
    fetchBookingsAndPrivateBookings: fetchBookingsAndPrivateBookingsAction,
    getMemberVisitList: getMemberVisitListAction,
    manualUpdateMemberVisitFromBroadcastChannel:
      manualUpdateMemberVisitFromBroadcastChannelAction,
    refreshMemberVisitAccessStatus: refreshMemberVisitAccessStatusAction,
    searchMembers: search,
    setMemberVisitEntryStatus: setMemberVisitEntryStatusAction,
  },
);

export default React.memo(connector(LiveHistory));
