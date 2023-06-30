import React, { memo } from 'react';

import type { Moment as MomentType } from 'moment-timezone';

import InboxThreadHeader from '#libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadHeader.component';
import type {
  CommunicationThread,
  SelectFieldItem,
} from '#libs/communication-v2/types';
import type { OptionCallback } from '../../../../state/types';
import InboxThreadFilterContainer from '#libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadFilterContainer.component';

export type Props = {
  thread: CommunicationThread;

  // --- Thread Actions ---
  switchFavoriteStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchMutedStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchDisabledStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  flagAsUnread: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;

  // --- Navigation ---
  goToDetailPage: () => void;
  goToThreadListPage: () => void;

  // --- Filtering ---
  kindFilterValues?: SelectFieldItem[];
  kindFilterSetter?: (args: SelectFieldItem[]) => void;

  recipientFilterValues?: SelectFieldItem[];
  recipientFilterSetter?: (args: SelectFieldItem[]) => void;

  sendParameterFilterValues?: SelectFieldItem[];
  sendParameterFilterSetter?: (args: SelectFieldItem[]) => void;

  srcOrDstFilterValues?: SelectFieldItem[];
  srcOrDstFilterSetter?: (args: SelectFieldItem[]) => void;

  dateStartValue?: MomentType;
  dateStartSetter?: (newDate: MomentType) => void;
  dateEndValue?: MomentType;
  dateEndSetter?: (newDate: MomentType) => void;

  handleFiltersSubmit: () => void;
  allPreviousFilter: {
    filters: number[];
    dateStart: number;
    dateEnd: number;
  };

  showFilterModal: boolean;
  setShowFilterModal: (isShown: boolean) => void;
  onShowFilterModal: () => void;

  popKindFilterValue: (index: number) => void;
  resetPeriodFilter: () => void;
  popRecipientFilterValue: (index: number) => void;
  popSendParameterFilterValue: (index: number) => void;
  popSrcOrDstFilterValue: (index: number) => void;
  resetFilters: () => void;
};

const InboxThreadContainerHeader: React.FC<Props> = ({
  thread,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  goToDetailPage,
  goToThreadListPage,
  kindFilterValues,
  kindFilterSetter,
  recipientFilterValues,
  recipientFilterSetter,
  sendParameterFilterValues,
  sendParameterFilterSetter,
  srcOrDstFilterValues,
  srcOrDstFilterSetter,
  dateStartValue,
  dateStartSetter,
  dateEndValue,
  dateEndSetter,
  handleFiltersSubmit,
  allPreviousFilter,
  showFilterModal,
  setShowFilterModal,
  onShowFilterModal,
  popKindFilterValue,
  popRecipientFilterValue,
  popSendParameterFilterValue,
  popSrcOrDstFilterValue,
  resetPeriodFilter,
  resetFilters,
}) => {
  const {
    id,
    title,
    cover,
    subtitle,
    favorite,
    muted,
    last_communication_has_been_read,
    disabled,
    related_object_kind,
  } = thread;

  return (
    <>
      <InboxThreadHeader
        id={id}
        title={title}
        cover={cover}
        subtitle={subtitle}
        isFavorite={favorite}
        isMuted={muted}
        hasBeenRead={last_communication_has_been_read}
        isDisabled={disabled}
        relatedObjectKind={related_object_kind}
        onShowFilterModal={onShowFilterModal}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        flagAsUnread={flagAsUnread}
        goToDetailPage={goToDetailPage}
        goToThreadListPage={goToThreadListPage}
      />
      <InboxThreadFilterContainer
        relatedObjectKind={related_object_kind}
        kindFilterValues={kindFilterValues}
        popKindFilterValue={popKindFilterValue}
        recipientFilterValues={recipientFilterValues}
        popRecipientFilterValue={popRecipientFilterValue}
        sendParameterFilterValues={sendParameterFilterValues}
        popSendParameterFilterValue={popSendParameterFilterValue}
        srcOrDstFilterValues={srcOrDstFilterValues}
        popSrcOrDstFilterValue={popSrcOrDstFilterValue}
        dateStart={dateStartValue}
        dateEnd={dateEndValue}
        resetPeriodFilter={resetPeriodFilter}
        resetFilters={resetFilters}
        kindFilterSetter={kindFilterSetter}
        recipientFilterSetter={recipientFilterSetter}
        sendParameterFilterSetter={sendParameterFilterSetter}
        srcOrDstFilterSetter={srcOrDstFilterSetter}
        dateStartSetter={dateStartSetter}
        dateEndSetter={dateEndSetter}
        handleFiltersSubmit={handleFiltersSubmit}
        allPreviousFilter={allPreviousFilter}
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        onShowFilterModal={onShowFilterModal}
      />
    </>
  );
};

export default memo(InboxThreadContainerHeader);
