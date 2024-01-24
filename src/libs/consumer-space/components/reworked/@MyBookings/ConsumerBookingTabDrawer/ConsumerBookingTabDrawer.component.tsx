import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';

import { BookingTab } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/types';
import { BookingTabEnum } from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingTabs/constants';

import './styles.css';

type Props = {
  isOpen: boolean;
  selectedBookingTab: BookingTab;
  handleSetSelectedTab: (type: BookingTab) => void;
  handleClose: () => void;
};

const ConsumerBookingTabDrawer: React.FC<Props> = ({
  isOpen,
  selectedBookingTab,
  handleSetSelectedTab,
  handleClose,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleSelectTab = useCallback(
    (type: BookingTab) => {
      handleSetSelectedTab(type);
      handleClose();
    },
    [handleClose, handleSetSelectedTab],
  );

  const bookingTabData = useMemo(
    () => ({
      [BookingTabEnum.ACTIVITY]: {
        label: t('consumerSpace:reworked.myBookings.tab.activities'),
        isSelected: selectedBookingTab === BookingTabEnum.ACTIVITY,
        onClick: () => handleSelectTab(BookingTabEnum.ACTIVITY),
      },
      [BookingTabEnum.APPOINTMENT]: {
        label: t('consumerSpace:reworked.myBookings.tab.appointments'),
        isSelected: selectedBookingTab === BookingTabEnum.APPOINTMENT,
        onClick: () => handleSelectTab(BookingTabEnum.APPOINTMENT),
      },
      [BookingTabEnum.WORKSHOP]: {
        label: t('consumerSpace:reworked.myBookings.tab.workshops'),
        isSelected: selectedBookingTab === BookingTabEnum.WORKSHOP,
        onClick: () => handleSelectTab(BookingTabEnum.WORKSHOP),
      },
    }),
    [handleSelectTab, selectedBookingTab, t],
  );

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-booking-tab-drawer__root"
      modalDialogProps={{
        title: t('consumerSpace:reworked.myBookings.chooseBookingType'),
        onClose: handleClose,
        onCancel: handleClose,
      }}
    >
      <List className="bs-consumer-booking-tab-drawer__list">
        <ListItem
          classes={{ label: 'bs-consumer-booking-tab-drawer__list__item' }}
          isSelected={bookingTabData[BookingTabEnum.ACTIVITY].isSelected}
          label={bookingTabData[BookingTabEnum.ACTIVITY].label}
          onClick={bookingTabData[BookingTabEnum.ACTIVITY].onClick}
          type="clickableText"
        />
        <ListItem
          classes={{ label: 'bs-consumer-booking-tab-drawer__list__item' }}
          isSelected={bookingTabData[BookingTabEnum.APPOINTMENT].isSelected}
          label={bookingTabData[BookingTabEnum.APPOINTMENT].label}
          onClick={bookingTabData[BookingTabEnum.APPOINTMENT].onClick}
          type="clickableText"
        />
        <ListItem
          classes={{ label: 'bs-consumer-booking-tab-drawer__list__item' }}
          isSelected={bookingTabData[BookingTabEnum.WORKSHOP].isSelected}
          label={bookingTabData[BookingTabEnum.WORKSHOP].label}
          onClick={bookingTabData[BookingTabEnum.WORKSHOP].onClick}
          type="clickableText"
        />
      </List>
    </BottomDrawer>
  );
};

export default React.memo(ConsumerBookingTabDrawer);
