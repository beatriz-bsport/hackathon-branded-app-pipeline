import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Selector from '#Fabrique/Selector';

import ConsumerGenericTabs from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericTabs';
import type { ConsumerPassesTabDisplay } from '#src/libs/consumer-space/types';
import { PassTabEnum } from './constants';

import type { PassTab } from './types';

import './styles.css';

type Props = {
  consumerPassesTabDisplay?: ConsumerPassesTabDisplay;
  handleToggleTabDrawer: () => void;
  isMobile?: boolean;
  onChangePassTab: (type: PassTab) => void;
  selectedTab: PassTab;
};

export const ConsumerPassTabs: React.FC<Props> = ({
  consumerPassesTabDisplay,
  handleToggleTabDrawer,
  isMobile,
  onChangePassTab,
  selectedTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetActivityPassTab = useCallback(
    () => onChangePassTab(PassTabEnum.CONSUMER_PAYMENT_PACK),
    [onChangePassTab],
  );

  const handleSetAppointmentPassTab = useCallback(
    () => onChangePassTab(PassTabEnum.PRIVATE_CONSUMER_PASS),
    [onChangePassTab],
  );

  const handleSetUniversalPassTab = useCallback(
    () => onChangePassTab(PassTabEnum.UNIVERSAL_PASS),
    [onChangePassTab],
  );

  const getSelectedItemLabel = useCallback(
    (item: { type: PassTabEnum; label: string; onClick: () => void }) =>
      item.label,
    [],
  );

  const getSelectedItemValue = useCallback(
    (item: { type: PassTabEnum; label: string; onClick: () => void }) =>
      item.type,
    [],
  );

  const {
    consumer_payment_pack: showConsumerPaymentPackTab,
    private_consumer_pass: showPrivateConsumerPassTab,
    universal_pass: showUniversalPassTab,
  } = consumerPassesTabDisplay;

  // We want the tabs to be shown only if their number exceeds 2.
  const hideComponent =
    [
      showConsumerPaymentPackTab,
      showPrivateConsumerPassTab,
      showUniversalPassTab,
    ].filter((tab) => !!tab).length <= 1;

  const tabs = useMemo(
    () =>
      [
        showConsumerPaymentPackTab && {
          type: PassTabEnum.CONSUMER_PAYMENT_PACK,
          label: t('reworked.myPasses.tab.activity'),
          onClick: handleSetActivityPassTab,
        },
        showPrivateConsumerPassTab && {
          type: PassTabEnum.PRIVATE_CONSUMER_PASS,
          label: t('reworked.myPasses.tab.appointment'),
          onClick: handleSetAppointmentPassTab,
        },
        showUniversalPassTab && {
          type: PassTabEnum.UNIVERSAL_PASS,
          label: t('reworked.myPasses.tab.universal'),
          onClick: handleSetUniversalPassTab,
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

  const selectorSelectedItem = useMemo(() => {
    const selectedPassTab = tabs.find((tab) => tab.type === selectedTab);
    return {
      id: selectedPassTab.type,
      label: selectedPassTab.label,
    };
  }, [tabs, selectedTab]);

  if (hideComponent) {
    return null;
  }

  return isMobile ? (
    <div className="bs-consumer-pass-tabs__root--mobile">
      <Selector
        noAnimate
        preventOpenMenu
        className="bs-consumer-pass-tabs__selector"
        closeOnSelect={false}
        getSelectedItemLabel={getSelectedItemLabel}
        getSelectedItemValue={getSelectedItemValue}
        id="bs-consumer-pass-tabs__selector"
        onClick={handleToggleTabDrawer}
        selectedItems={selectorSelectedItem}
        size="lg"
      />
    </div>
  ) : (
    <ConsumerGenericTabs<PassTab> selectedTab={selectedTab} tabs={tabs} />
  );
};

export default React.memo(ConsumerPassTabs);
