import React, { memo } from 'react';

import type { Moment as MomentType } from 'moment-timezone';
import type { CallHistoryMethodAction } from 'connected-react-router';

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
  goToDetailPage: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
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
        cover={cover}
        flagAsUnread={flagAsUnread}
        goToDetailPage={goToDetailPage}
        goToThreadListPage={goToThreadListPage}
        hasBeenRead={last_communication_has_been_read}
        id={id}
        isDisabled={disabled}
        isFavorite={favorite}
        isMuted={muted}
        onShowFilterModal={onShowFilterModal}
        relatedObjectKind={related_object_kind}
        subtitle={subtitle}
        switchDisabledStatus={switchDisabledStatus}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        title={title}
      />
      <InboxThreadFilterContainer
        allPreviousFilter={allPreviousFilter}
        dateEnd={dateEndValue}
        dateEndSetter={dateEndSetter}
        dateStart={dateStartValue}
        dateStartSetter={dateStartSetter}
        handleFiltersSubmit={handleFiltersSubmit}
        kindFilterSetter={kindFilterSetter}
        kindFilterValues={kindFilterValues}
        onShowFilterModal={onShowFilterModal}
        popKindFilterValue={popKindFilterValue}
        popRecipientFilterValue={popRecipientFilterValue}
        popSendParameterFilterValue={popSendParameterFilterValue}
        popSrcOrDstFilterValue={popSrcOrDstFilterValue}
        recipientFilterSetter={recipientFilterSetter}
        recipientFilterValues={recipientFilterValues}
        relatedObjectKind={related_object_kind}
        resetFilters={resetFilters}
        resetPeriodFilter={resetPeriodFilter}
        sendParameterFilterSetter={sendParameterFilterSetter}
        sendParameterFilterValues={sendParameterFilterValues}
        setShowFilterModal={setShowFilterModal}
        showFilterModal={showFilterModal}
        srcOrDstFilterSetter={srcOrDstFilterSetter}
        srcOrDstFilterValues={srcOrDstFilterValues}
      />
    </>
  );
};

export default memo(InboxThreadContainerHeader);
