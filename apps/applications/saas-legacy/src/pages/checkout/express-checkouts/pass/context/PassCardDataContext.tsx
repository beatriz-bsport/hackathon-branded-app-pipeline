import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PassTypes } from '#src/libs/marketplace/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivateService,
  PrivateSlot,
} from '#src/libs/private-service/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { SCT } from '#src/libs/category/types';

type PaymentPackData = {
  paymentPack: PaymentPack;
  establishments: Establishment[];
  metaActivities: MetaActivity[];
  categories: SCT[];
};

type PrivatePassData = {
  privatePass: PrivatePass;
  privateServices: PrivateService[];
  privatePassCategories: PrivatePassCategory[];
  privateSlots: PrivateSlot[];
};

type PassCardData = {
  passType: PassTypes;
  passId: number;
  paymentPackData?: PaymentPackData;
  privatePassData?: PrivatePassData;
};

type PassCardDataContextType = {
  passCardData: PassCardData | null;
  setPassCardData: (data: PassCardData) => void;
  clearPassCardData: () => void;
  passId: number;
  passType: PassTypes;
  companyId: number;
};

type PassCardDataProviderProps = {
  children: ReactNode;
  passId: number;
  passType: PassTypes;
  companyId: number;
};

const PassCardDataContext = createContext<PassCardDataContextType | null>(null);

export const PassCardDataProvider: React.FC<PassCardDataProviderProps> = ({
  children,
  companyId,
  passId,
  passType,
}) => {
  const [passCardData, setPassCardDataState] = useState<PassCardData | null>(
    null,
  );

  const contextValue: PassCardDataContextType = {
    passCardData,
    setPassCardData: setPassCardDataState,
    clearPassCardData: () => setPassCardDataState(null),
    passId,
    passType,
    companyId,
  };

  return (
    <PassCardDataContext.Provider value={contextValue}>
      {children}
    </PassCardDataContext.Provider>
  );
};

export const usePassCardDataContext = (): PassCardDataContextType => {
  const context = useContext(PassCardDataContext);
  if (!context) {
    throw new Error(
      'usePassCardDataContext must be used within a PassCardDataProvider',
    );
  }
  return context;
};
