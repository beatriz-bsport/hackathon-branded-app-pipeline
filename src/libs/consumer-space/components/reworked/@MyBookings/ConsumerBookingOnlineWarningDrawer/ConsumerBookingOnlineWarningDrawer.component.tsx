import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatAsDate, formatISOStringAsTime } from '#utils/datetime';
import BottomDrawer from '#Fabrique/BottomDrawer';
import Typography from '#Fabrique/Typography';

type Props = {
  isOpen: boolean;
  /** The selected booking offer date in the modal */
  offerDateStart: string;
  /** Handler function fired when clicking on blanket or back button */
  handleClose: () => void;
};

const ConsumerBookingOnlineWarningDrawer: React.FC<Props> = ({
  isOpen,
  offerDateStart,
  handleClose,
}) => {
  const { t } = useTranslation('consumerSpace');
  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-booking-online-warning-drawer__root"
      modalDialogProps={{
        title: t('reworked.myBookings.onlineWarningModal.title'),
        subtitle: t('reworked.myBookings.onlineWarningModal.subtitle', {
          date: formatAsDate(offerDateStart),
          hour: formatISOStringAsTime(offerDateStart),
        }),
        onClose: handleClose,
        onCancel: handleClose,
      }}
    >
      <Typography variant="body-md">
        {t('reworked.myBookings.onlineWarningModal.message')}
      </Typography>
    </BottomDrawer>
  );
};

export default React.memo(ConsumerBookingOnlineWarningDrawer);
