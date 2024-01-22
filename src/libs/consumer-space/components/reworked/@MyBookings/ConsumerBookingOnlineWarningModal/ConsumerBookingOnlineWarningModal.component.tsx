import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatAsDate, formatAsTime } from '#utils/datetime';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import Typography from '#Fabrique/Typography';

type Props = {
  /** The selected booking offer date in the modal */
  offerDateStart: string;
  /** Handler function fired when clicking on blanket or back button */
  onClose: () => void;
};

const ConsumerBookingOnlineWarningModal: React.FC<Props> = ({
  offerDateStart,
  onClose,
}) => {
  const { t } = useTranslation('consumerSpace');
  return (
    <Blanket
      isOpen
      className="bs-consumer-booking-cancel-modal__blanket"
      onClick={onClose}
    >
      <ModalDialog
        cancelLabel={t('common:back')}
        className="bs-consumer-booking-cancel-modal__dialog"
        onCancel={onClose}
        onClose={onClose}
        size="md"
        subtitle={t(
          'consumerSpace:reworked.myBookings.onlineWarningModal.subtitle',
          {
            date: formatAsDate(offerDateStart),
            hour: formatAsTime(offerDateStart),
          },
        )}
        title={t('consumerSpace:reworked.myBookings.onlineWarningModal.title')}
      >
        <Typography variant="body-md">
          {t('consumerSpace:reworked.myBookings.onlineWarningModal.message')}
        </Typography>
      </ModalDialog>
    </Blanket>
  );
};
export default React.memo(ConsumerBookingOnlineWarningModal);
