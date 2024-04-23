import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerPaymentPackCreditStatus from '#libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';
import Typography from '#Fabrique/Typography';

type Props = {
  paymentPackName: string;
  isConsumerPaymentPackDisabled?: boolean;
  consumerPaymentPackPenaltyDisabledFrom?: string;
  consumerPaymentPackPenaltyDisabledUntil?: string;
  consumerPaymentPackAvailableCredits: number;
  consumerPaymentPackUsedCredits: number;
  paymentPackTotalCredits: number;
  isPaymentPackUnlimited?: boolean;
};

const ConsumerBookingDetailsCardPassSection: React.FC<Props> = ({
  paymentPackName,
  isConsumerPaymentPackDisabled,
  consumerPaymentPackPenaltyDisabledFrom,
  consumerPaymentPackPenaltyDisabledUntil,
  consumerPaymentPackAvailableCredits,
  consumerPaymentPackUsedCredits,
  paymentPackTotalCredits,
  isPaymentPackUnlimited,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__pass-section"
      title={t(
        'consumerSpace:reworked.myBookings.detailsCard.relatedPass.title',
      )}
    >
      <div className="bs-consumer-booking-details-card__pass-section__content">
        <Typography
          className={classNames(
            'bs-consumer-booking-details-card__section__subtitle',
            'bs-consumer-booking-details-card__pass-section__content__pass-name',
          )}
          variant="body-sm"
        >
          {`${paymentPackName}\xa0-\xa0`}
        </Typography>

        <ConsumerPaymentPackCreditStatus
          className={classNames(
            'bs-consumer-booking-details-card__section__subtitle',
            'bs-consumer-booking-details-card__pass-section__content__credit-status',
          )}
          consumerPaymentPackAvailableCredits={
            consumerPaymentPackAvailableCredits
          }
          consumerPaymentPackPenaltyDisabledFrom={
            consumerPaymentPackPenaltyDisabledFrom
          }
          consumerPaymentPackPenaltyDisabledUntil={
            consumerPaymentPackPenaltyDisabledUntil
          }
          consumerPaymentPackUsedCredits={consumerPaymentPackUsedCredits}
          isConsumerPaymentPackDisabled={isConsumerPaymentPackDisabled}
          isPaymentPackUnlimited={isPaymentPackUnlimited}
          paymentPackTotalCredits={paymentPackTotalCredits}
        />
      </div>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardPassSection);
