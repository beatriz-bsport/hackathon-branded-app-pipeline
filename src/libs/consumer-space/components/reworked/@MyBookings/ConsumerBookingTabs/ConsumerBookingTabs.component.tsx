import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerGenericTabs from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericTabs';
import Selector from '#Fabrique/Selector';

import { BookingTabEnum } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';

import type { BookingTab } from '#src/libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';

import './styles.css';

type Props = {
  isMobile?: boolean;
  selectedTab: BookingTab;
  onChangeBookingTab: (type: BookingTab) => void;
  handleToggleTabDrawer: () => void;
};

export const ConsumerBookingTabs: React.FC<Props> = ({
  isMobile,
  selectedTab,
  onChangeBookingTab,
  handleToggleTabDrawer,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSetActivityBookingTab = useCallback(
    () => onChangeBookingTab?.(BookingTabEnum.ACTIVITY),
    [onChangeBookingTab],
  );

  const handleSetAppointmentBookingTab = useCallback(
    () => onChangeBookingTab(BookingTabEnum.APPOINTMENT),
    [onChangeBookingTab],
  );

  const handleSetWorkshopBookingTab = useCallback(
    () => onChangeBookingTab?.(BookingTabEnum.WORKSHOP),
    [onChangeBookingTab],
  );

  const getSelectedItemLabel = (item: {
    type: BookingTabEnum;
    label: string;
    onClick: () => void;
  }) => item.label;

  const getSelectedItemValue = (item: {
    type: BookingTabEnum;
    label: string;
    onClick: () => void;
  }) => item.type;

  const consumerBookingTabs = useMemo(
    () => [
      {
        type: BookingTabEnum.ACTIVITY,
        label: t('reworked.myBookings.tab.activities'),
        onClick: handleSetActivityBookingTab,
      },
      {
        type: BookingTabEnum.APPOINTMENT,
        label: t('reworked.myBookings.tab.appointments'),
        onClick: handleSetAppointmentBookingTab,
      },
      {
        type: BookingTabEnum.WORKSHOP,
        label: t('reworked.myBookings.tab.workshops'),
        onClick: handleSetWorkshopBookingTab,
      },
    ],
    [
      handleSetActivityBookingTab,
      handleSetAppointmentBookingTab,
      handleSetWorkshopBookingTab,
      t,
    ],
  );

  const selectorSelectedItem = useMemo(() => {
    const selectedBookingTab = consumerBookingTabs.find(
      (tab) => tab.type === selectedTab,
    );
    return {
      id: selectedBookingTab.type,
      label: selectedBookingTab.label,
    };
  }, [consumerBookingTabs, selectedTab]);

  return (
    <>
      {isMobile ? (
        <div className="bs-consumer-booking-tabs__root--mobile">
          <Selector
            noAnimate
            preventOpenMenu
            className="bs-consumer-booking-tabs__selector"
            closeOnSelect={false}
            getSelectedItemLabel={getSelectedItemLabel}
            getSelectedItemValue={getSelectedItemValue}
            id="bs-consumer-booking-tabs__selector"
            onClick={handleToggleTabDrawer}
            selectedItems={selectorSelectedItem}
            size="lg"
          />
        </div>
      ) : (
        <ConsumerGenericTabs<BookingTab>
          selectedTab={selectedTab}
          tabs={consumerBookingTabs}
        />
      )}
    </>
  );
};

export default React.memo(ConsumerBookingTabs);
