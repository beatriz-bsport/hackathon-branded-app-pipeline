import React, { memo } from 'react';

import type { DateTime } from 'luxon';
import type { CallHistoryMethodAction } from 'connected-react-router';

import InboxThreadHeader from '#src/libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadHeader.component';
import type {
  CommunicationThread,
  SelectFieldItem,
} from '#src/libs/communication-v2/types';
import InboxThreadFilterContainer from '#src/libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadFilterContainer.component';
import type { OptionCallback } from '../../../../state/types';

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
  communicationKinds?: SelectFieldItem[];
  setCommunicationKind?: (args: SelectFieldItem[]) => void;

  recipientTypes?: SelectFieldItem[];
  setRecipientTypes?: (args: SelectFieldItem[]) => void;

  automatedMessages?: SelectFieldItem[];
  setAutomatedMessages?: (args: SelectFieldItem[]) => void;

  messagesOrigin?: SelectFieldItem[];
  setMessagesOrigin?: (args: SelectFieldItem[]) => void;

  dateStart?: DateTime;
  setDateStart?: (newDate: DateTime) => void;
  dateEnd?: DateTime;
  setDateEnd?: (newDate: DateTime) => void;

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
  communicationKinds,
  setCommunicationKind,
  recipientTypes,
  setRecipientTypes,
  automatedMessages,
  setAutomatedMessages,
  messagesOrigin,
  setMessagesOrigin,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
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
        automatedMessages={automatedMessages}
        communicationKinds={communicationKinds}
        dateEnd={dateEnd}
        dateStart={dateStart}
        handleFiltersSubmit={handleFiltersSubmit}
        messagesOrigin={messagesOrigin}
        onShowFilterModal={onShowFilterModal}
        popKindFilterValue={popKindFilterValue}
        popRecipientFilterValue={popRecipientFilterValue}
        popSendParameterFilterValue={popSendParameterFilterValue}
        popSrcOrDstFilterValue={popSrcOrDstFilterValue}
        recipientTypes={recipientTypes}
        relatedObjectKind={related_object_kind}
        resetFilters={resetFilters}
        resetPeriodFilter={resetPeriodFilter}
        setAutomatedMessages={setAutomatedMessages}
        setCommunicationKind={setCommunicationKind}
        setDateEnd={setDateEnd}
        setDateStart={setDateStart}
        setMessagesOrigin={setMessagesOrigin}
        setRecipientTypes={setRecipientTypes}
        setShowFilterModal={setShowFilterModal}
        showFilterModal={showFilterModal}
      />
    </>
  );
};

export default memo(InboxThreadContainerHeader);
