import { useMemo, useCallback, useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Props as LiveHistoryProps } from '#pages/access-monitoring/LiveHistory.page';
import { useAccessControlBroadcastChannel } from './broadcastChannel';
import { MemberVisitREST } from '../types';
import { BookingsAndPrivateBookingsTypeEnum } from '#libs/consumer-space/actions';
import { AccessStatus, EntryStatus } from '../constants';
import { useCheckAccessControlLocationSetup } from './checkLocationSetup';

export const useLiveHistoryPageDataManager = ({
  establishmentGroups,
  establishmentsData,
  fetchBookingsAndPrivateBookings,
  getMemberVisitList,
  manualUpdateMemberVisitFromBroadcastChannel,
  memberVisitState,
  refreshMemberVisitAccessStatus,
  setMemberVisitEntryStatus,
  theme,
}: Pick<
  LiveHistoryProps,
  | 'establishmentGroups'
  | 'establishmentsData'
  | 'fetchBookingsAndPrivateBookings'
  | 'getMemberVisitList'
  | 'manualUpdateMemberVisitFromBroadcastChannel'
  | 'memberVisitState'
  | 'refreshMemberVisitAccessStatus'
  | 'setMemberVisitEntryStatus'
  | 'theme'
>) => {
  const [selectedMemberVisitId, setSelectedMemberVisitId] = useState(null);

  /** STATE */

  const [showStatusChangeSuccessModal, setShowStatusChangeSuccessModal] =
    useState(false);
  const [showEntryStatusChangedModal, setShowEntryStatusChangedModal] =
    useState(false);

  /**
   * Get the selected member visit directly from the store
   * This way, we can avoid re-select selectedMemberVisit when selectedMemberVisitId doesn't change
   */
  const selectedMemberVisit = useMemo(() => {
    return memberVisitState.byId?.[selectedMemberVisitId];
  }, [memberVisitState, selectedMemberVisitId]);

  /** EFFECTS */

  // Fetch today's member visit list
  const fetchMemberVisitList = useCallback(
    (params: { page: number; member?: number }) => {
      // If current time is before 2am, we need to fetch yesterday's data as well
      const datetime_created_after = moment()
        .subtract(2, 'hours')
        .startOf('day')
        .toISOString();

      getMemberVisitList({
        ...params,
        datetime_created_after,
      });
    },
    [getMemberVisitList],
  );

  useEffect(() => {
    fetchMemberVisitList({ page: 1 });
  }, [fetchMemberVisitList]);

  /** HOOKS */

  const sendToAccessControlBroadcastChannel = useAccessControlBroadcastChannel(
    (memberVisit: MemberVisitREST) =>
      manualUpdateMemberVisitFromBroadcastChannel(memberVisit),
  );

  const {
    establishmentObjects,
    staffLocationAddress,
    staffLocationEstablishmentGroup,
  } = useCheckAccessControlLocationSetup({
    establishmentGroups,
    establishmentsData,
    establishmentsToCheck: selectedMemberVisit?.establishments ?? [],
    enableMultilocalization: theme.enable_multi_localization,
  });

  /** HANDLERS */

  // Select member visit details
  const handleCloseMemberVisitDetails = useCallback(() => {
    setSelectedMemberVisitId(null);
  }, [setSelectedMemberVisitId]);

  const handleSelectMemberVisit = useCallback(
    (memberVisit: MemberVisitREST) => {
      fetchBookingsAndPrivateBookings({
        member: memberVisit.member.id,
        date_start: null,
        type: BookingsAndPrivateBookingsTypeEnum.todayNextBookingUntil2amOnly,
        mine: false,
        forceRefetch: true,
      });
      setSelectedMemberVisitId(memberVisit.id);
    },
    [setSelectedMemberVisitId],
  );

  // Member filter selection
  const handleSelectMember = useCallback(
    (memberId: number) => {
      fetchMemberVisitList({ member: memberId, page: 1 });
    },
    [fetchMemberVisitList],
  );

  // In member visit details
  const handleRefreshMemberVisitAccessStatus = useCallback(() => {
    refreshMemberVisitAccessStatus(selectedMemberVisitId, {
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
      member: selectedMemberVisit.member.id,
      date_start: null,
      type: BookingsAndPrivateBookingsTypeEnum.todayNextBookingUntil2amOnly,
      mine: false,
      forceRefetch: true,
    });
  }, [
    refreshMemberVisitAccessStatus,
    sendToAccessControlBroadcastChannel,
    selectedMemberVisit,
    fetchBookingsAndPrivateBookings,
  ]);

  // When clearing the member filter
  const handleRefreshFirstPage = useCallback(() => {
    fetchMemberVisitList({ page: 1 });
  }, [fetchMemberVisitList]);

  const handleMemberProfileClick = useCallback((memberId: number) => {
    window.open(`/member/${memberId}`);
  }, []);

  const handleMemberBillClick = useCallback(() => {
    if (selectedMemberVisit?.member?.id) {
      window.open(`/invoice/bill-member/${selectedMemberVisit.member.id}`);
    }
  }, [selectedMemberVisit]);

  const handleSelectedMemberProfileClick = useCallback(() => {
    if (selectedMemberVisit) {
      handleMemberProfileClick(selectedMemberVisit?.member?.id);
    }
  }, [handleMemberProfileClick, selectedMemberVisit]);

  const handleAllowManualEntry = useCallback(() => {
    if (selectedMemberVisitId) {
      setMemberVisitEntryStatus(selectedMemberVisitId, EntryStatus.ENTERED, {
        onSuccess: (data: MemberVisitREST) => {
          sendToAccessControlBroadcastChannel(data);
          setShowEntryStatusChangedModal(true);
        },
      });
    }
  }, [setMemberVisitEntryStatus, selectedMemberVisitId]);

  const handleRefuseManualEntry = useCallback(() => {
    if (selectedMemberVisitId) {
      setMemberVisitEntryStatus(
        selectedMemberVisitId,
        EntryStatus.NOT_ENTERED,
        {
          onSuccess: (data: MemberVisitREST) => {
            sendToAccessControlBroadcastChannel(data);
            setShowEntryStatusChangedModal(true);
          },
        },
      );
    }
  }, [setMemberVisitEntryStatus, selectedMemberVisitId]);

  const handleCloseAccessStatusChangeSuccessModal = useCallback(() => {
    setShowStatusChangeSuccessModal(false);
  }, [setShowStatusChangeSuccessModal]);

  const handleCloseEntryStatusChangedModal = useCallback(() => {
    setShowEntryStatusChangedModal(false);
  }, [setShowEntryStatusChangedModal]);

  /** COMPUTED */

  /**
   * @example
   * // Returns "Location Group - Establishment 1, Establishment 2" when
   *  - staffLocationEstablishmentGroup = { name: "Location Group", ... }
   *  - staffLocationAddress = null
   *  - establishmentObjects = [{ title: "Establishment 1", ... }, { title: "Establishment 2", ... }]
   *
   * @example
   * // Returns "Address - Establishment 1, Establishment 2" when
   * - staffLocationEstablishmentGroup = null
   * - staffLocationAddress = "Address"
   * - establishmentObjects = [{ title: "Establishment 1", ... }, { title: "Establishment 2", ... }]
   */
  const locationInformation = useMemo(
    () =>
      [
        `${
          staffLocationEstablishmentGroup?.name ?? staffLocationAddress ?? ''
        }`,
        establishmentObjects
          ?.map((establishment) => establishment.title)
          ?.join(', '),
      ].join(' - '),
    [
      staffLocationEstablishmentGroup,
      staffLocationAddress,
      establishmentObjects,
    ],
  );

  return {
    fetchMemberVisitList,
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
  };
};
