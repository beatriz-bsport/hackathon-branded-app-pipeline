import React, { createContext, useContext, useState } from 'react';

import type { Member } from '#src/libs/member/types';
import type {
  CommunicationDrawerMode,
  CommunicationScheduled,
  DrawerProps,
  FilteringMemberIdsByGenericCategories,
} from '#src/libs/communication-v2/types';
import type { WithMobileDialog } from '@material-ui/core';
import type { AutomatedCampaign } from '#src/libs/smart-list/types';

export type CommunicationContextProps = Omit<WithMobileDialog, 'width'> &
  DrawerProps;

type CommunicationContextType = {
  // State values
  communicationIdentifier: number;
  communicationObjectId: number;
  communicationMember: Member | null;
  communicationTitle: string | null;
  allMemberCategoryList: FilteringMemberIdsByGenericCategories | null;
  communicationKind: number;
  fullScreen: boolean;
  automatedCommunicationDraft: AutomatedCampaign | null;
  scheduledCommunicationDraft: CommunicationScheduled | null;
  automatedCommunicationKind: number;
  usedAutoCampaignCommMethods: number[];
  openDrawer: boolean;
  mode: CommunicationDrawerMode;
  // State setters
  setCommunicationKind: (kind: number) => void;
  onCloseCommunicationDrawer: () => void;
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
  const { smartlistOptions } = initialValues ?? {};
  const {
    scheduledCommunicationDraft: initialScheduledCommunicationDraft,
    automatedCommunicationDraft: initialAutomatedCommunicationDraft,
  } = smartlistOptions ?? {};
  const initialCommunicationKind =
    initialScheduledCommunicationDraft?.communication_kind ??
    initialAutomatedCommunicationDraft?.communication_kind ??
    0;
  const communicationIdentifier = initialValues?.communicationIdentifier;
  const communicationObjectId = initialValues?.communicationObjectId;
  const communicationTitle: string | null =
    initialValues?.communicationTitle ?? null;
  const allMemberCategoryList: FilteringMemberIdsByGenericCategories | null =
    initialValues?.allMemberCategoryList ?? null;
  const scheduledCommunicationDraft: CommunicationScheduled | null =
    initialScheduledCommunicationDraft ?? null;
  const automatedCommunicationDraft: AutomatedCampaign | null =
    initialAutomatedCommunicationDraft ?? null;
  const automatedCommunicationKind: number | null =
    smartlistOptions?.automatedCampaignKind ?? -1;
  const usedAutoCampaignCommMethods =
    smartlistOptions?.usedAutoCampaignCommMethods ?? [];

  const openDrawer = initialValues?.openDrawer ?? false;
  const fullScreen = initialValues?.fullScreen ?? false;
  const mode: CommunicationDrawerMode = initialValues?.mode ?? 'read-write';
  const [communicationMember, setCommunicationMember] = useState<Member | null>(
    initialValues?.communicationMember ?? null,
  );
  const [communicationKind, setCommunicationKind] = useState(
    initialCommunicationKind,
  );

  const onCloseCommunicationDrawer = () => {
    initialValues.onDrawerClose();
  };

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
    scheduledCommunicationDraft,
    automatedCommunicationDraft,
    automatedCommunicationKind,
    usedAutoCampaignCommMethods,
    openDrawer,
    mode,

    // State setters
    setCommunicationKind,
    onCloseCommunicationDrawer,
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
