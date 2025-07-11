import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import Typography from '#Fabrique/Typography';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

type Props = {
  isCancelledFromManager?: boolean;
  isCancelledFromOffer?: boolean;
  isLateCancellation?: boolean;
  creditsToRefund?: number;
  cancellationDate?: string;
};

const ConsumerBookingDetailsCardCancelledSection: React.FC<Props> = ({
  isCancelledFromManager,
  isCancelledFromOffer,
  isLateCancellation,
  creditsToRefund,
  cancellationDate,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__cancelled-section"
      title={t('consumerSpace:reworked.myBookings.detailsCard.cancelled.title')}
    >
      <Typography
        className="bs-consumer-booking-details-card__cancelled-section__heading"
        variant="body-md"
      >
        {isCancelledFromManager
          ? t(
              'consumerSpace:reworked.myBookings.detailsCard.cancelled.cancelledFromManager',
            )
          : isCancelledFromOffer
          ? t(
              'consumerSpace:reworked.myBookings.detailsCard.cancelled.cancelledFromOffer',
            )
          : t(
              'consumerSpace:reworked.myBookings.detailsCard.cancelled.cancelledFromMember',
            )}
      </Typography>

      <Typography
        className="bs-consumer-booking-details-card__cancelled-section__refund-info"
        variant="body-sm"
      >
        {isLateCancellation
          ? t(
              'consumerSpace:reworked.myBookings.detailsCard.cancelled.refundWarning',
            )
          : t(
              'consumerSpace:reworked.myBookings.detailsCard.cancelled.creditsToRefund',
              { count: Number(getCreditsDividedDisplay(creditsToRefund)) ?? 0 },
            )}
      </Typography>

      {!!cancellationDate && (
        <Typography
          className="bs-consumer-booking-details-card__cancelled-section__cancelled-date"
          variant="body-sm"
        >
          {cancellationDate}
        </Typography>
      )}
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardCancelledSection);
