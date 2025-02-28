import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { DateTime } from 'luxon';
import type { CommunicationListFilters } from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import type {
  AuhtorizedFiltersList,
  SelectFieldItem,
} from '#src/libs/communication-v2/types';
import { getFiltersToEnable } from '#src/libs/communication-v2/utils';

export type CommunicationFilterContextProps = {
  onFilterUpdate: ({
    filters,
    dateStart,
    dateEnd,
  }: CommunicationListFilters) => void;
  children: React.ReactNode;
  communicationIdentifier: number;
};

type CommunicationFilterContextState = {
  // State values
  dateStart: DateTime | null;
  dateEnd: DateTime | null;
  communicationKinds: SelectFieldItem[];
  messagesOrigin: SelectFieldItem[];
  recipientsTypes: SelectFieldItem[];
  automatedMessages: SelectFieldItem[];
  messageChannels: SelectFieldItem[];
  previousFilters: CommunicationListFilters;
  filtersToSend: CommunicationListFilters;
  periodHasChanged: boolean;
  countFilter: number;
  authorizedFilters: AuhtorizedFiltersList;

  // State setters
  setDateStart: (dateStart: DateTime) => void;
  setDateEnd: (dateEnd: DateTime) => void;
  setCommunicationKind: (communicationKinds: SelectFieldItem[]) => void;
  setMessagesOrigin: (messagesOrigin: SelectFieldItem[]) => void;
  setAutomatedMessages: (automatedMessage: SelectFieldItem[]) => void;
  setRecipientsTypes: (recipientsTypes: SelectFieldItem[]) => void;
  setMessageChannels: (messageChannel: SelectFieldItem[]) => void;
  setPreviousFilters: (filters: CommunicationListFilters) => void;

  popCommunicationKindsValue: (index: number) => void;
  popMessageChannelsValue: (index: number) => void;
  popRecipientTypesValue: (index: number) => void;
  popAutomatedMessagesValue: (index: number) => void;
  popMessageOriginValue: (index: number) => void;

  resetFilters: () => void;
  resetPeriodFilters: () => void;
  submitFilters: () => void;
};

const CommunicationFilterContext = createContext<
  CommunicationFilterContextState | undefined
>(undefined);

export const CommunicationFilterContextProvider = ({
  onFilterUpdate,
  children,
  communicationIdentifier,
}: CommunicationFilterContextProps) => {
  const [dateStart, setDateStart] = useState<DateTime | null>(null);
  const [dateEnd, setDateEnd] = useState<DateTime | null>(null);
  const [communicationKinds, setCommunicationKind] = useState<
    SelectFieldItem[]
  >([]);
  const [messagesOrigin, setMessagesOrigin] = useState<SelectFieldItem[]>([]);
  const [automatedMessages, setAutomatedMessages] = useState<SelectFieldItem[]>(
    [],
  );
  const [recipientsTypes, setRecipientsTypes] = useState<SelectFieldItem[]>([]);
  const [messageChannels, setMessageChannels] = useState<SelectFieldItem[]>([]);
  const [previousFilters, setPreviousFilters] =
    useState<CommunicationListFilters>({
      filters: [],
      dateStart: null,
      dateEnd: null,
    });
  const authorizedFilters = useMemo(
    () => getFiltersToEnable(communicationIdentifier),
    [communicationIdentifier],
  );

  const periodHasChanged = !!dateStart || !!dateEnd;

  const countFilter =
    communicationKinds.length +
    messageChannels.length +
    recipientsTypes.length +
    automatedMessages.length +
    messagesOrigin.length +
    (periodHasChanged ? 1 : 0);

  const buildFilters = useCallback(() => {
    const {
      hasMessageChannelsFilter,
      hasRecipientTypesFilter,
      hasAutomatedMessagesFilter,
    } = authorizedFilters;
    const filtersIdentifiers: number[] = [];

    if (communicationKinds.length > 0) {
      communicationKinds.forEach((item) => filtersIdentifiers.push(item.value));
    }
    if (messagesOrigin.length > 0) {
      messagesOrigin.forEach((item) => filtersIdentifiers.push(item.value));
    }
    if (hasRecipientTypesFilter && recipientsTypes.length > 0) {
      recipientsTypes.forEach((item) => filtersIdentifiers.push(item.value));
    }
    if (hasMessageChannelsFilter && messageChannels.length > 0) {
      messageChannels.forEach((item) => filtersIdentifiers.push(item.value));
    }
    if (hasAutomatedMessagesFilter && automatedMessages.length > 0) {
      automatedMessages.forEach((item) => filtersIdentifiers.push(item.value));
    }

    return {
      filters: filtersIdentifiers,
      dateStart: dateStart?.toUnixInteger() ?? null,
      dateEnd: dateEnd?.toUnixInteger() ?? null,
    };
  }, [
    communicationKinds,
    recipientsTypes,
    messageChannels,
    automatedMessages,
    messagesOrigin,
    dateStart,
    dateEnd,
    authorizedFilters,
  ]);

  const filtersToSend = useMemo(() => buildFilters(), [buildFilters]);

  const popFilterValue = ({
    index,
    setFilter,
  }: {
    setFilter: React.Dispatch<React.SetStateAction<SelectFieldItem[]>>;
    index: number;
  }) => {
    setFilter((prevValues) => {
      const newFilterValues = [...prevValues];
      newFilterValues.splice(index, 1);
      return newFilterValues;
    });
  };

  const popCommunicationKindsValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setCommunicationKind, index });
    },
    [setCommunicationKind],
  );

  const popMessageChannelsValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setMessageChannels, index });
    },
    [setMessageChannels],
  );

  const popRecipientTypesValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setRecipientsTypes, index });
    },
    [setRecipientsTypes],
  );

  const popAutomatedMessagesValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setAutomatedMessages, index });
    },
    [setAutomatedMessages],
  );

  const popMessageOriginValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setMessagesOrigin, index });
    },
    [setMessagesOrigin],
  );

  const resetFilters = useCallback(() => {
    setCommunicationKind([]);
    setRecipientsTypes([]);
    setAutomatedMessages([]);
    setMessageChannels([]);
    setMessagesOrigin([]);
    setDateStart(null);
    setDateEnd(null);
  }, [
    setCommunicationKind,
    setRecipientsTypes,
    setAutomatedMessages,
    setMessageChannels,
    setMessagesOrigin,
    setDateStart,
    setDateEnd,
  ]);

  const resetPeriodFilters = useCallback(() => {
    setDateStart(null);
    setDateEnd(null);
  }, [setDateEnd, setDateStart]);

  const submitFilters = useCallback(() => {
    setPreviousFilters(filtersToSend);
    onFilterUpdate(filtersToSend);
  }, [onFilterUpdate, filtersToSend]);

  const value = {
    // State values
    dateStart,
    dateEnd,
    communicationKinds,
    messagesOrigin,
    automatedMessages,
    recipientsTypes,
    messageChannels,
    periodHasChanged,
    countFilter,
    previousFilters,
    filtersToSend,
    authorizedFilters,
    // State setters
    setDateStart,
    setDateEnd,
    setCommunicationKind,
    setMessagesOrigin,
    setAutomatedMessages,
    setRecipientsTypes,
    setMessageChannels,
    setPreviousFilters,

    // Pop filters
    popCommunicationKindsValue,
    popRecipientTypesValue,
    popMessageChannelsValue,
    popAutomatedMessagesValue,
    popMessageOriginValue,

    // Context methods
    resetFilters,
    resetPeriodFilters,
    submitFilters,
  };

  return (
    <CommunicationFilterContext.Provider value={value}>
      {children}
    </CommunicationFilterContext.Provider>
  );
};

export const useCommunicationFilterContext = () => {
  const context = useContext(CommunicationFilterContext);
  if (context === undefined) {
    throw new Error(
      'useCommunicationFilterContext must be used within a CommunicationFilterContextProvider',
    );
  }
  return context;
};
