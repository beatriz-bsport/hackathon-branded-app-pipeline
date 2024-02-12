import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Selector from '#Fabrique/Selector';
import IconButton from '#Fabrique/IconButton';
import { FilterLines } from '#components/untitledui';

import ConsumerGenericTabs from '#libs/consumer-space/components/reworked/common/ConsumerGenericTabs';
import { PassTabEnum } from './constants';

import type { PassTab } from './types';

import './styles.css';

type Props = {
  handleToggleTabDrawer: () => void;
  isMobile?: boolean;
  onChangePassTab: (type: PassTab) => void;
  selectedTab: PassTab;
};

export const ConsumerPassTabs: React.FC<Props> = ({
  handleToggleTabDrawer,
  isMobile,
  onChangePassTab,
  selectedTab,
}) => {
  const { t } = useTranslation('consumerSpace');

  const emptyFn = () => {};

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

  const tabs = useMemo(
    () => [
      {
        type: PassTabEnum.CONSUMER_PAYMENT_PACK,
        label: t('reworked.myPasses.tab.activity'),
        onClick: handleSetActivityPassTab,
      },
      {
        type: PassTabEnum.PRIVATE_CONSUMER_PASS,
        label: t('reworked.myPasses.tab.appointment'),
        onClick: handleSetAppointmentPassTab,
      },
      {
        type: PassTabEnum.UNIVERSAL_PASS,
        label: t('reworked.myPasses.tab.universal'),
        onClick: handleSetUniversalPassTab,
      },
    ],
    [
      handleSetActivityPassTab,
      handleSetAppointmentPassTab,
      handleSetUniversalPassTab,
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

      <div className="bs-consumer-pass-tabs__actions">
        <IconButton color="grey" onClick={emptyFn} size="lg" variant="outlined">
          <FilterLines />
        </IconButton>
      </div>
    </div>
  ) : (
    <ConsumerGenericTabs<PassTab> selectedTab={selectedTab} tabs={tabs} />
  );
};

export default React.memo(ConsumerPassTabs);
