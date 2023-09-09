import React, { useCallback } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Warning from '@material-ui/icons/Warning';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { formatAsDate } from '../../../../utils/datetime';
import MarketplacePaymentPackCreditStatus from '../@PaymentPack/MarketplacePaymentPackCreditStatus';

import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type { PaymentPack, MaxoutData } from '#libs/payment-packs/types';

import './styles.css';

type Props = {
  consumerPaymentPack: ConsumerPaymentPack<PaymentPack> & MaxoutData;
  isSelected: boolean;
  onSelectConsumerPaymentPack: (
    consumerPaymentPack: ConsumerPaymentPack<PaymentPack>,
  ) => void;
};

const MarketplaceConsumerPaymentPackCard: React.FC<Props> = ({
  consumerPaymentPack,
  isSelected,
  onSelectConsumerPaymentPack,
}) => {
  const { t } = useTranslation('paymentPack');

  const expireDate = `${t('consumer.expiresOn')}${formatAsDate(
    consumerPaymentPack.ending_date,
  )}`;

  const disabled = consumerPaymentPack.exceedsBookingMaxout;

  const onClick = useCallback(
    () => onSelectConsumerPaymentPack(consumerPaymentPack),
    [onSelectConsumerPaymentPack, consumerPaymentPack],
  );

  return (
    <div
      aria-hidden="true"
      className={classNames('consumer-payment-pack-card__container', {
        'consumer-payment-pack-card__container--selected': isSelected,
        'consumer-payment-pack-card__container--disabled': disabled,
      })}
      onClick={!disabled && onClick}
    >
      <div
        className={classNames(
          'consumer-payment-pack-card__container__subtitle',
          {
            'consumer-payment-pack-card__text__disabled': disabled,
          },
        )}
      >
        {consumerPaymentPack?.payment_pack?.name || ' - '}
      </div>

      <div className="consumer-payment-pack-card__credit__status">
        <MarketplacePaymentPackCreditStatus
          classes={{
            'consumer-payment-pack-card__credit__status__text':
              'consumer-payment-pack-card__credit__status__text',
          }}
          consumerPaymentPack={consumerPaymentPack}
          paymentPack={consumerPaymentPack.payment_pack}
        />
      </div>

      <div className="consumer-payment-pack-card__container__validity">
        <div
          className={classNames(
            'consumer-payment-pack-card__validity__content',
            {
              'consumer-payment-pack-card__text__disabled': disabled,
            },
          )}
        >
          {expireDate}
        </div>
      </div>

      {disabled && (
        <div className="consumer-payment-pack-card__container__maxout">
          <Warning className="consumer-payment-pack-card__container__maxout__icon" />
          <div className="consumer-payment-pack-card__container__maxout__text">
            {t(`maxoutInfo.${consumerPaymentPack.maxoutInfo?.period}`, {
              count: consumerPaymentPack.maxoutInfo?.nb,
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const MarketplaceConsumerPaymentPackCardForStorybook =
  marketplaceCssHoc()(MarketplaceConsumerPaymentPackCard);

export default React.memo(MarketplaceConsumerPaymentPackCard);
