import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import WidgetUtils from '#src/libs/widget/WidgetUtils';

import ConsumerPageHeader from '#src/libs/consumer-space/components/reworked/@Layout/PageHeader';
import ConsumerPaymentPackListContainer from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackListContainer';
import PrivateConsumerPassListContainer from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassListContainer';
import UniversalPassListContainer from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassListContainer';
import ConsumerPassModals from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassModals';
import PageContentContainer from '#src/libs/consumer-space/components/reworked/@Layout/PageContentContainer';

import { useConsumerPassesDataManager } from '#src/libs/consumer-space/components/reworked/@MyPasses/hooks';
import {
  PassTabEnum,
  PassFilterTabEnum,
} from '#src/libs/consumer-space/components/reworked/@MyPasses/constants';

import { Calendar, ChevronRight } from '#src/components/untitledui';
import type {
  ConsumerPaymentPackREST,
  ConsumerPaymentPackReworked,
} from '#src/libs/consumer-payment-pack/types';
import type {
  PrivateConsumerPassREST,
  PrivateConsumerPassReworked,
} from '#src/libs/private-service/types';
import type {
  ConsumerPassReworked,
  ConsumerPassesTabDisplay,
} from '#src/libs/consumer-space/types';
import type {
  UniversalPassREST,
  UniversalPassReworked,
} from '#src/libs/universal-pass/types';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import './styles.css';

type Props = {
  activeConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  activeConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  activePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  activePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  activeUniversalPassesList: UniversalPassReworked[];
  activeUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  consumerPassesTabDisplay: ConsumerPassesTabDisplay;
  expiredConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  expiredConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  expiredPrivateConsumerPassesList: PrivateConsumerPassReworked[];
  expiredPrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  expiredUniversalPassesList: UniversalPassReworked[];
  expiredUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  fetchActiveConsumerPaymentPacks: () => void;
  fetchActivePrivateConsumerPasses: () => void;
  fetchActiveUniversalPasses: () => void;
  fetchExpiredConsumerPaymentPacks: () => void;
  fetchExpiredPrivateConsumerPasses: () => void;
  fetchExpiredUniversalPasses: () => void;
  fetchFutureConsumerPaymentPacks: () => void;
  fetchFuturePrivateConsumerPasses: () => void;
  fetchFutureUniversalPasses: () => void;
  futureConsumerPaymentPacksList: ConsumerPaymentPackReworked[];
  futureConsumerPaymentPacksState: ConsumerPassReworked<ConsumerPaymentPackREST>;
  futurePrivateConsumerPassesList: PrivateConsumerPassReworked[];
  futurePrivateConsumerPassesState: ConsumerPassReworked<PrivateConsumerPassREST>;
  futureUniversalPassesList: UniversalPassReworked[];
  futureUniversalPassesState: ConsumerPassReworked<UniversalPassREST>;
  handleBookASessionClick: () => void;
  handleBuyPassClick: () => void;
  isConsumerPassesTabDisplayLoading: boolean;
  isLoading: boolean;
  isMetadataLoading: boolean;
  resetConsumerState: () => void;
};

export const ConsumerPassesPageReworkedComponent: React.FC<Props> = ({
  activeConsumerPaymentPacksList,
  activeConsumerPaymentPacksState,
  activePrivateConsumerPassesList,
  activePrivateConsumerPassesState,
  activeUniversalPassesList,
  activeUniversalPassesState,
  consumerPassesTabDisplay,
  expiredConsumerPaymentPacksList,
  expiredConsumerPaymentPacksState,
  expiredPrivateConsumerPassesList,
  expiredPrivateConsumerPassesState,
  expiredUniversalPassesList,
  expiredUniversalPassesState,
  fetchActiveConsumerPaymentPacks,
  fetchActivePrivateConsumerPasses,
  fetchActiveUniversalPasses,
  fetchExpiredConsumerPaymentPacks,
  fetchExpiredPrivateConsumerPasses,
  fetchExpiredUniversalPasses,
  fetchFutureConsumerPaymentPacks,
  fetchFuturePrivateConsumerPasses,
  fetchFutureUniversalPasses,
  futureConsumerPaymentPacksList,
  futureConsumerPaymentPacksState,
  futurePrivateConsumerPassesList,
  futurePrivateConsumerPassesState,
  futureUniversalPassesList,
  futureUniversalPassesState,
  handleBookASessionClick,
  handleBuyPassClick,
  isConsumerPassesTabDisplayLoading,
  isLoading,
  isMetadataLoading,
  resetConsumerState,
}) => {
  const {
    selectedTab,
    selectedFilterTab,
    selectedPass,
    isConsumerPaymentPackDetailsDrawerOpen,
    isPrivateConsumerPassDetailsDrawerOpen,
    isUniversalPassDetailsDrawerOpen,
    isPassTabDrawerOpen,
    handleSetSelectedTab,
    handleSetSelectedFilterTab,
    handleSetSelectedPass,
    handlePaginationFetchMore,
    handleTogglePassDetailsDrawer,
    handleTogglePassTabDrawer,
    futureItemsCount,
    activeItemsCount,
    nextPage,
    passList,
    isMobile,
  } = useConsumerPassesDataManager({
    activeConsumerPaymentPacksList,
    activeConsumerPaymentPacksState,
    activePrivateConsumerPassesList,
    activePrivateConsumerPassesState,
    activeUniversalPassesList,
    activeUniversalPassesState,
    consumerPassesTabDisplay,
    expiredConsumerPaymentPacksList,
    expiredConsumerPaymentPacksState,
    expiredPrivateConsumerPassesList,
    expiredPrivateConsumerPassesState,
    expiredUniversalPassesList,
    expiredUniversalPassesState,
    fetchActiveConsumerPaymentPacks,
    fetchActivePrivateConsumerPasses,
    fetchActiveUniversalPasses,
    fetchExpiredConsumerPaymentPacks,
    fetchExpiredPrivateConsumerPasses,
    fetchExpiredUniversalPasses,
    fetchFutureConsumerPaymentPacks,
    fetchFuturePrivateConsumerPasses,
    fetchFutureUniversalPasses,
    futureConsumerPaymentPacksList,
    futureConsumerPaymentPacksState,
    futurePrivateConsumerPassesList,
    futurePrivateConsumerPassesState,
    futureUniversalPassesList,
    futureUniversalPassesState,
    resetConsumerState,
  });

  const { t } = useTranslation('consumerSpace');

  const isWidget = WidgetUtils.isWidget();

  const buttonsData: HeaderButton[] = useMemo(
    () =>
      isWidget
        ? []
        : [
            {
              label: t('reworked.myPasses.bookASession'),
              onClick: handleBookASessionClick,
              variant: 'outlined',
              color: 'grey',
              leftIcon: <Calendar stroke="currentColor" />,
            },
            {
              label: t('reworked.myPasses.buyANewPass'),
              onClick: handleBuyPassClick,
              rightIcon: <ChevronRight stroke="currentColor" />,
            },
          ],
    [handleBookASessionClick, handleBuyPassClick, t, isWidget],
  );

  const handleSetActivityPassTab = React.useCallback(
    () => handleSetSelectedTab(PassTabEnum.CONSUMER_PAYMENT_PACK),
    [handleSetSelectedTab],
  );

  const handleSetAppointmentPassTab = React.useCallback(
    () => handleSetSelectedTab(PassTabEnum.PRIVATE_CONSUMER_PASS),
    [handleSetSelectedTab],
  );

  const handleSetUniversalPassTab = React.useCallback(
    () => handleSetSelectedTab(PassTabEnum.UNIVERSAL_PASS),
    [handleSetSelectedTab],
  );

  const {
    consumer_payment_pack: showConsumerPaymentPackTab,
    private_consumer_pass: showPrivateConsumerPassTab,
    universal_pass: showUniversalPassTab,
  } = consumerPassesTabDisplay;

  const tabs = useMemo(
    () =>
      [
        {
          type: PassTabEnum.CONSUMER_PAYMENT_PACK,
          label: t('reworked.myPasses.tab.activity'),
          onClick: handleSetActivityPassTab,
          hidden: !showConsumerPaymentPackTab,
        },
        {
          type: PassTabEnum.PRIVATE_CONSUMER_PASS,
          label: t('reworked.myPasses.tab.appointment'),
          onClick: handleSetAppointmentPassTab,
          hidden: !showPrivateConsumerPassTab,
        },
        {
          type: PassTabEnum.UNIVERSAL_PASS,
          label: t('reworked.myPasses.tab.universal'),
          onClick: handleSetUniversalPassTab,
          hidden: !showUniversalPassTab,
        },
      ].filter((tab) => !!tab),
    [
      handleSetActivityPassTab,
      handleSetAppointmentPassTab,
      handleSetUniversalPassTab,
      showConsumerPaymentPackTab,
      showPrivateConsumerPassTab,
      showUniversalPassTab,
      t,
    ],
  );

  const handleSetActiveFilterTab = React.useCallback(
    () => handleSetSelectedFilterTab(PassFilterTabEnum.ACTIVE),
    [handleSetSelectedFilterTab],
  );

  const handleSetFutureFilterTab = React.useCallback(
    () => handleSetSelectedFilterTab(PassFilterTabEnum.FUTURE),
    [handleSetSelectedFilterTab],
  );

  const handleSetExpiredFilterTab = React.useCallback(
    () => handleSetSelectedFilterTab(PassFilterTabEnum.EXPIRED),
    [handleSetSelectedFilterTab],
  );

  const filters = useMemo(
    () => [
      {
        hasBadge: activeItemsCount > 0,
        type: PassFilterTabEnum.ACTIVE,
        label: t('reworked.myPasses.filters.active'),
        onClick: handleSetActiveFilterTab,
        value: activeItemsCount,
      },
      {
        hasBadge: futureItemsCount > 0,
        type: PassFilterTabEnum.FUTURE,
        label: t('reworked.myPasses.filters.future'),
        onClick: handleSetFutureFilterTab,
        value: futureItemsCount,
      },
      {
        hasBadge: false,
        type: PassFilterTabEnum.EXPIRED,
        label: t('reworked.myPasses.filters.expired'),
        onClick: handleSetExpiredFilterTab,
      },
    ],
    [
      t,
      handleSetActiveFilterTab,
      handleSetFutureFilterTab,
      handleSetExpiredFilterTab,
      activeItemsCount,
      futureItemsCount,
    ],
  );

  return (
    <PageContentContainer contentClassName="bs-consumer-pass-page__root">
      <ConsumerPassModals
        consumerPassesTabDisplay={consumerPassesTabDisplay}
        handleSetSelectedTab={handleSetSelectedTab}
        handleTogglePassDetailsDrawer={handleTogglePassDetailsDrawer}
        handleTogglePassTabDrawer={handleTogglePassTabDrawer}
        isConsumerPaymentPackDetailsDrawerOpen={
          isConsumerPaymentPackDetailsDrawerOpen
        }
        isLoading={isLoading}
        isMetadataLoading={isMetadataLoading}
        isMobile={isMobile}
        isPassTabDrawerOpen={isPassTabDrawerOpen}
        isPrivateConsumerPassDetailsDrawerOpen={
          isPrivateConsumerPassDetailsDrawerOpen
        }
        isUniversalPassDetailsDrawerOpen={isUniversalPassDetailsDrawerOpen}
        selectedPass={selectedPass}
        selectedPassTab={selectedTab}
      />
      <ConsumerPageHeader
        FilterProps={{ filters, selectedFilter: selectedFilterTab }}
        isLoading={isConsumerPassesTabDisplayLoading}
        isMobile={isMobile}
        TabsProps={{
          selectedTab,
          tabs,
          handleToggleTabDrawer: handleTogglePassTabDrawer,
        }}
        TitleProps={{
          buttons: buttonsData,
          title: t('reworked.myPasses.title'),
        }}
      />

      {selectedTab === PassTabEnum.PRIVATE_CONSUMER_PASS && (
        <PrivateConsumerPassListContainer
          handlePaginationFetchMore={handlePaginationFetchMore}
          hasNextPage={!!nextPage}
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isMobile={isMobile}
          onPassCardClick={handleSetSelectedPass}
          passList={passList as PrivateConsumerPassReworked[]}
          selectedFilterTab={selectedFilterTab}
          selectedPass={selectedPass as PrivateConsumerPassReworked}
        />
      )}
      {selectedTab === PassTabEnum.CONSUMER_PAYMENT_PACK && (
        <ConsumerPaymentPackListContainer
          handlePaginationFetchMore={handlePaginationFetchMore}
          hasNextPage={!!nextPage}
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isMobile={isMobile}
          onPassCardClick={handleSetSelectedPass}
          passList={passList as ConsumerPaymentPackReworked[]}
          selectedFilterTab={selectedFilterTab}
          selectedPass={selectedPass as ConsumerPaymentPackReworked}
        />
      )}
      {selectedTab === PassTabEnum.UNIVERSAL_PASS && (
        <UniversalPassListContainer
          handlePaginationFetchMore={handlePaginationFetchMore}
          hasNextPage={!!nextPage}
          isLoading={isLoading}
          isMetadataLoading={isMetadataLoading}
          isMobile={isMobile}
          onPassCardClick={handleSetSelectedPass}
          passList={passList as UniversalPassReworked[]}
          selectedFilterTab={selectedFilterTab}
          selectedPass={selectedPass as UniversalPassReworked}
        />
      )}
    </PageContentContainer>
  );
};

export default React.memo(ConsumerPassesPageReworkedComponent);
