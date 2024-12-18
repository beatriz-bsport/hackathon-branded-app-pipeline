import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import DatePicker from '#Fabrique/DatePicker';

import type { BookingTab } from '#src/libs/consumer-space/components/reworked/@MyBookings/types';

type Props = {
  isOpen: boolean;
  selectedTab: BookingTab;
  selectedDate: string;
  onDatePickerClick: (selectedDate: string) => void;
  handleClose: () => void;
};

const ConsumerBookingCalendarDrawer: React.FC<Props> = ({
  isOpen,
  selectedTab,
  selectedDate,
  onDatePickerClick,
  handleClose,
}) => {
  const { t } = useTranslation('consumerSpace');

  /**
   * Draft date = preview of selected date in drawer before clicking on 'confirm' and override selectedDate
   */
  const [draftDate, setDraftDate] = useState<string | null>(null);

  useEffect(() => {
    setDraftDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetDraftDate = useCallback(
    (date: string) => setDraftDate(date),
    [],
  );

  const handleConfirmSelectedDate = useCallback(() => {
    onDatePickerClick(draftDate);
  }, [draftDate, onDatePickerClick]);

  const handleResetDateAndClose = useCallback(() => {
    setDraftDate(selectedDate);
    handleClose();
  }, [handleClose, selectedDate]);

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleResetDateAndClose }}
      className="bs-consumer-booking-calendar-drawer__root"
      modalDialogProps={{
        title: t('reworked.myBookings.calendarDrawer.title'),
        subtitle: t(
          `reworked.myBookings.calendarDrawer.subtitle.${selectedTab}`,
        ),
        onClose: handleResetDateAndClose,
        onCancel: handleResetDateAndClose,
        onConfirm: handleConfirmSelectedDate,
      }}
    >
      <DatePicker
        isContentOnly
        isOpen
        className="bs-consumer-booking-calendar-drawer__date-picker"
        dateSelected={draftDate}
        onSelect={handleSetDraftDate}
      />
    </BottomDrawer>
  );
};

export default React.memo(ConsumerBookingCalendarDrawer);
