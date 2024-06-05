import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ConsumerGenericCardFooter } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import { CalendarPlus01 } from '#src/components/untitledui';
import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';
import type { ConsumerSubscriptionCardProps } from '..';

type Props = Pick<
  ConsumerSubscriptionCardProps,
  | 'hasMissingPaymentMethod'
  | 'onAddPaymentMethodClick'
  | 'addPaymentMethodDisabled'
>;

const ConsumerSubscriptionCardFooter: React.FC<Props> = ({
  addPaymentMethodDisabled,
  hasMissingPaymentMethod,
  onAddPaymentMethodClick,
}) => {
  const { t } = useTranslation('consumerSpace');
  const mainButtonsList = React.useMemo(
    () => [
      {
        shouldDisplay: hasMissingPaymentMethod,
        color: 'primary' as ButtonColor,
        onClick: onAddPaymentMethodClick,
        leftIcon: <CalendarPlus01 stroke="currentColor" />,
        variant: 'contained' as ButtonVariant,
        isDisabled: addPaymentMethodDisabled,
        label: t(
          'reworked.mySubscriptions.consumerSubscriptionCard.buttonsLabel.addPaymentMethod',
        ),
        buttonClassName:
          'bs-consumer__subscription-card__footer__primary-button',
        typographyClassName:
          'bs-consumer__subscription-card__footer__primary-button__label',
      },
    ],
    [
      addPaymentMethodDisabled,
      onAddPaymentMethodClick,
      hasMissingPaymentMethod,
      t,
    ],
  );
  return (
    <ConsumerGenericCardFooter
      className={classNames('bs-consumer__subscription-card__footer', {
        'bs-consumer__subscription-card__footer--hidden':
          !hasMissingPaymentMethod,
      })}
      mainButtonsList={mainButtonsList}
    />
  );
};

export default React.memo(ConsumerSubscriptionCardFooter);
