import React, { useCallback } from 'react';
import './MarketplaceConsumerPaymentPackCard.css';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Warning } from '@material-ui/icons';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { formatAsDate } from '../../../../utils/datetime';
import Item, {
  Alignment,
  Justification,
} from '#components/css-only/Grid/GridItem';
import CreditStatus from '#libs/consumer-payment-pack/components/CreditStatus.component';
import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type { PaymentPack, MaxoutData } from '#libs/payment-packs/types';

type Props = {
  consumerPaymentPack: ConsumerPaymentPack<PaymentPack> & MaxoutData;
  isSelected: boolean;
  onSelectConsumerPaymentPack: (
    consumerPaymentPack: ConsumerPaymentPack<PaymentPack>,
  ) => void;
};

const MarketplaceConsumerPaymentPackCard: React.FC<Props> = (props) => {
  const { t } = useTranslation(['paymentPack']);
  const { onSelectConsumerPaymentPack, consumerPaymentPack } = props;
  const expireDate = `${t('consumer.expiresOn')}${formatAsDate(
    props.consumerPaymentPack.ending_date,
  )}`;
  const disabled = props.consumerPaymentPack.exceedsBookingMaxout;
  const onClick = useCallback(
    () => onSelectConsumerPaymentPack(consumerPaymentPack),
    [onSelectConsumerPaymentPack, consumerPaymentPack],
  );
  return (
    <div
      onClick={!disabled && onClick}
      aria-hidden="true"
      className={classNames(
        'bs-marketplace-consumer-payment-pack-card__container',
        {
          'bs-marketplace-consumer-payment-pack-card__container--selected':
            props.isSelected,
          'bs-marketplace-consumer-payment-pack-card__container--disabled':
            disabled,
        },
      )}
    >
      <Item
        alignment={Alignment.FLEX_START}
        justification={Justification.FLEX_START}
        columnEnd={1}
      >
        <div
          className={classNames(
            'bs-marketplace-consumer-payment-pack-card__container__subtitle',
            {
              'bs-marketplace-consumer-payment-pack-card__text__disabled':
                disabled,
            },
          )}
        >
          {props.consumerPaymentPack?.payment_pack?.name || ' - '}
        </div>
        <CreditStatus
          paymentPack={props.consumerPaymentPack.payment_pack}
          consumerPack={props.consumerPaymentPack}
          textColor="textSecondary"
        />
      </Item>
      <Item
        alignment={Alignment.FLEX_END}
        justification={Justification.SPACE_BETWEEN}
      >
        <div className="bs-marketplace-consumer-payment-pack-card__container__validity">
          <div
            className={classNames(
              'bs-marketplace-consumer-payment-pack-card__validity__content',
              {
                'bs-marketplace-consumer-payment-pack-card__text__disabled':
                  disabled,
              },
            )}
          >
            {expireDate}
          </div>
        </div>
        {disabled && (
          <div className="bs-marketplace-consumer-payment-pack-card__container__maxout">
            <Warning className="bs-marketplace-consumer-payment-pack-card__container__maxout__icon" />
            <div className="bs-marketplace-consumer-payment-pack-card__container__maxout__text">
              {t(`maxoutInfo.${props.consumerPaymentPack.maxoutInfo?.period}`, {
                count: props.consumerPaymentPack.maxoutInfo?.nb,
              })}
            </div>
          </div>
        )}
      </Item>
    </div>
  );
};

export default compose<Props, Props>(
  React.memo,
  marketplaceCssHoc(),
)(MarketplaceConsumerPaymentPackCard);
