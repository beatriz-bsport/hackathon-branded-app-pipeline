import React, { createContext, ReactNode, useMemo } from 'react';
import type { SlotSelectorStoreContextType } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/types';

export const SlotSelectorStoreContext =
  createContext<SlotSelectorStoreContextType>(null);

const SlotSelectorStoreContextProvider: React.FC<
  SlotSelectorStoreContextType & {
    children?: ReactNode | undefined;
  }
> = ({
  children,
  availabilitySlotByDate,
  availableSlotsLoading,
  nextAvailableSlotLoading,
  nextDateAvailableSlot,
  privateService,
}) => {
  const memoizedStoreData = useMemo(
    () => ({
      availabilitySlotByDate,
      availableSlotsLoading,
      nextAvailableSlotLoading,
      nextDateAvailableSlot,
      privateService,
    }),
    [
      availabilitySlotByDate,
      availableSlotsLoading,
      nextAvailableSlotLoading,
      nextDateAvailableSlot,
      privateService,
    ],
  );
  return (
    <SlotSelectorStoreContext.Provider value={memoizedStoreData}>
      {children}
    </SlotSelectorStoreContext.Provider>
  );
};

export default SlotSelectorStoreContextProvider;
