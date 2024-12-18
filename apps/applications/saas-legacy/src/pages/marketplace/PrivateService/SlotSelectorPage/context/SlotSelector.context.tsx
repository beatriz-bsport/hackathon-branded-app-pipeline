import React, { createContext, ReactNode, useCallback, useState } from 'react';
import useNumberOfDayToShow from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks/numberOfDayToShow.hook';
import { DateTime, Interval } from 'luxon';
import type { PrivateSlot } from '#src/libs/private-service/types';
import type { SlotSelectorContextType } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/types';
import { Establishment } from '#src/libs/establishment/types';

export const SlotSelectorContext = createContext<SlotSelectorContextType>(null);

const SlotSelectorContextProvider: React.FC<{
  children?: ReactNode | undefined;
  serviceId: string;
}> = ({ children, serviceId }) => {
  const numberOfDayToShow = useNumberOfDayToShow();

  const getCalendarDateRange = useCallback(
    (dateTime: DateTime) => {
      return Array.from({ length: numberOfDayToShow }, (_, index) =>
        dateTime.plus({ day: index }).toISODate(),
      );
    },
    [numberOfDayToShow],
  );

  const [selectedEstablishmentsIds, setSelectedEstablishmentsIds] = useState<
    number[]
  >([]);

  const [selectedCoachesIds, setSelectedCoachesIds] = useState<number[]>([]);

  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());

  const [calendarDateRange, setCalendarDateRange] = useState<string[]>(
    getCalendarDateRange(selectedDate),
  );

  const [selectedDayTimeInterval, setSelectedDayTimeInterval] =
    useState<Interval | null>(null);

  const [selectedPrivateSlot, setSelectedPrivateSlot] =
    useState<PrivateSlot | null>(null);

  // The selected establishment (tab in the slot selector)
  const [activeEstablishment, setActiveEstablishment] =
    useState<Establishment | null>(null);

  return (
    <SlotSelectorContext.Provider
      value={{
        numberOfDayToShow,
        getCalendarDateRange,
        selectedEstablishmentsIds,
        setSelectedEstablishmentsIds,
        selectedCoachesIds,
        setSelectedCoachesIds,
        selectedDate,
        setSelectedDate,
        calendarDateRange,
        setCalendarDateRange,
        selectedDayTimeInterval,
        setSelectedDayTimeInterval,
        selectedPrivateSlot,
        setSelectedPrivateSlot,
        serviceId,
        activeEstablishment,
        setActiveEstablishment,
      }}
    >
      {children}
    </SlotSelectorContext.Provider>
  );
};

export default SlotSelectorContextProvider;
