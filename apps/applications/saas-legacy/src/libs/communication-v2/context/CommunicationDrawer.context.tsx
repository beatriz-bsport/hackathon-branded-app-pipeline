import React, { createContext, useContext, useState } from 'react';

import type { Member } from '#src/libs/member/types';
import type {
  DrawerProps,
  FilteringMemberIdsByGenericCategories,
} from '#src/libs/communication-v2/types';
import type { WithMobileDialog } from '@material-ui/core';

type ExcludedDrawerPropsFields = 'onDrawerClose' | 'openDrawer';
export type CommunicationContextProps = Omit<WithMobileDialog, 'width'> &
  Omit<DrawerProps, ExcludedDrawerPropsFields>;

type CommunicationContextType = {
  // State values
  communicationIdentifier: number;
  communicationObjectId: number;
  communicationMember: Member | null;
  communicationTitle: string | null;
  allMemberCategoryList: FilteringMemberIdsByGenericCategories | null;
  communicationKind: number;
  fullScreen: boolean;

  // State setters
  setCommunicationKind: (kind: number) => void;
};

const CommunicationContext = createContext<
  CommunicationContextType | undefined
>(undefined);

export const CommunicationContextProvider = ({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues: CommunicationContextProps;
}) => {
  const [communicationIdentifier] = useState<number>(
    initialValues?.communicationIdentifier,
  );
  const [communicationObjectId] = useState<number>(
    initialValues?.communicationObjectId,
  );
  const [communicationMember, setCommunicationMember] = useState<Member | null>(
    initialValues?.communicationMember ?? null,
  );
  const [communicationTitle] = useState<string | null>(
    initialValues?.communicationTitle ?? null,
  );
  const [allMemberCategoryList] =
    useState<FilteringMemberIdsByGenericCategories | null>(
      initialValues?.allMemberCategoryList ?? null,
    );
  const [fullScreen] = useState(initialValues?.fullScreen ?? false);
  const [communicationKind, setCommunicationKind] = useState(0);

  // To handle updates to initialValues
  React.useEffect(() => {
    if (initialValues?.communicationMember !== undefined) {
      setCommunicationMember(initialValues.communicationMember);
    }
  }, [initialValues]);

  const value = {
    // State values
    communicationIdentifier,
    communicationMember,
    communicationTitle,
    communicationObjectId,
    allMemberCategoryList,
    fullScreen,
    communicationKind,

    // State setters
    setCommunicationKind,
  };
  return (
    <CommunicationContext.Provider value={value}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunicationContext = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error(
      'useCommunicationContext must be used within a CommunicationContextProvider',
    );
  }
  return context;
};
