import React from 'react';
import type { PrivateSlot } from '#src/libs/private-service/types';
import { DateTime, Interval } from 'luxon';
import { Establishment } from '#src/libs/establishment/types';

export type SlotSelectorContextType = {
  numberOfDayToShow: number;
  getCalendarDateRange: (dateTime: DateTime) => string[];
  selectedEstablishmentsIds: number[];
  setSelectedEstablishmentsIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedCoachesIds: number[];
  setSelectedCoachesIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedDate: DateTime;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  calendarDateRange: string[];
  setCalendarDateRange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDayTimeInterval: Interval | null;
  setSelectedDayTimeInterval: React.Dispatch<
    React.SetStateAction<Interval | null>
  >;
  selectedPrivateSlot: PrivateSlot | null;
  setSelectedPrivateSlot: React.Dispatch<
    React.SetStateAction<PrivateSlot | null>
  >;
  serviceId: string;
  activeEstablishment: Establishment | null;
  setActiveEstablishment: React.Dispatch<
    React.SetStateAction<Establishment | null>
  >;
};
