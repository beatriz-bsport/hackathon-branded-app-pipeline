import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import Button from '#Fabrique/ButtonV2';

import { CreditCardEdit, CalendarPlus01 } from '#components/untitledui';

import type { ConsumerSubscriptionDetailsCardProps } from '..';

type Props = Required<
  Pick<
    ConsumerSubscriptionDetailsCardProps,
    | 'hasMissingPaymentMethod'
    | 'onPaymentMethodActionClick'
    | 'paymentMethodType'
    | 'readableIdentifier'
    | 'isPaymentMethodSectionHidden'
  >
>;

const ConsumerSubscriptionDetailsCardPaymentMethod: React.FC<Props> = ({
  hasMissingPaymentMethod,
  onPaymentMethodActionClick,
  paymentMethodType,
  readableIdentifier,
  isPaymentMethodSectionHidden,
}) => {
  const { t } = useTranslation('consumerSpace');

  const subtitle = React.useMemo(
    () =>
      hasMissingPaymentMethod
        ? t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.paymentMethod.internal',
          )
        : t(
            `reworked.mySubscriptions.consumerSubscriptionCardDetails.paymentMethod.${paymentMethodType}`,
            { readableIdentifier },
          ),
    [hasMissingPaymentMethod, paymentMethodType, readableIdentifier, t],
  );
  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer__subscription-details-card__payment-method__section',
        {
          'bs-consumer__subscription-details-card__payment-method__section--hidden':
            isPaymentMethodSectionHidden,
        },
      )}
      subtitle={subtitle}
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.paymentMethod.title',
      )}
    >
      <Button
        className="bs-consumer__subscription-details-card__payment-method__button"
        color="grey"
        leftIcon={
          hasMissingPaymentMethod ? (
            <CalendarPlus01 stroke="currentColor" />
          ) : (
            <CreditCardEdit stroke="currentColor" />
          )
        }
        onClick={onPaymentMethodActionClick}
        size="md"
        variant="outlined"
      >
        {hasMissingPaymentMethod
          ? t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.buttonsLabel.add',
            )
          : t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.buttonsLabel.change',
            )}
      </Button>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardPaymentMethod);
