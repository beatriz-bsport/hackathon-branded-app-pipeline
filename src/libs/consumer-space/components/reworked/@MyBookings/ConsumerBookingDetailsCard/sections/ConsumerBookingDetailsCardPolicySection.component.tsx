import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Duration } from 'luxon';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import Typography from '#Fabrique/Typography';

type Props = {
  metaActivityLastDiscardMinutes: number;
};

const ConsumerBookingDetailsCardPolicySection: React.FC<Props> = ({
  metaActivityLastDiscardMinutes,
}) => {
  const { t } = useTranslation('consumerSpace');

  const cancellationPolicyDuration = useMemo(
    () => Duration.fromObject({ minutes: metaActivityLastDiscardMinutes }),
    [metaActivityLastDiscardMinutes],
  );

  const selectedBookingCancellationPolicy =
    !!metaActivityLastDiscardMinutes && metaActivityLastDiscardMinutes > 0
      ? t(
          'consumerSpace:reworked.myBookings.detailsCard.cancellationPolicy.maxDuration',
          {
            days: cancellationPolicyDuration.days,
            hours: cancellationPolicyDuration.hours,
            minutes: cancellationPolicyDuration.minutes,
          },
        )
      : t(
          'consumerSpace:reworked.myBookings.detailsCard.cancellationPolicy.noDuration',
        );

  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__policy-section"
      title={t(
        'consumerSpace:reworked.myBookings.detailsCard.cancellationPolicy.title',
      )}
    >
      <Typography
        className="bs-consumer-booking-details-card__policy-section__policy"
        variant="body-md"
      >
        {selectedBookingCancellationPolicy}
      </Typography>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardPolicySection);
