import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import Card from '#Fabrique/Card';
import Title from '#Fabrique/Title';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import IconButton from '#Fabrique/IconButton';
import Button from '#Fabrique/ButtonV2';
import {
  Bank,
  CreditCard01,
  CreditCardPlus,
  Trash03,
} from '#src/components/untitledui';

import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import type { PaymentMethodsCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import './styles.css';

const SavedPaymentMethodCard: React.FC<PaymentMethodsCardProps> = ({
  detachPaymentMethodLoading,
  paymentMethodLoading,
  paymentMethods,
  isLoading,
}) => {
  const { t } = useTranslation(['consumerSpace']);

  const { openAddPaymentMethodPortal, selectPaymentMethodToDetach } =
    useContext(ConsumerProfileContext) ?? {};

  const cards = useMemo(
    () =>
      paymentMethods?.filter(
        (paymentMethod) => paymentMethod.type === 'card',
      ) ?? [],
    [paymentMethods],
  );

  const directPayments = useMemo(
    () =>
      paymentMethods?.filter(
        (paymentMethod) => paymentMethod.type !== 'card',
      ) ?? [],
    [paymentMethods],
  );

  const isPaymentMethodsEmpty =
    !paymentMethodLoading && !paymentMethods?.length;

  if (isLoading) return <ConsumerCardSkeleton />;

  return (
    <Card className={classNames('bs-consumer-payment-methods-card__root')}>
      <Title
        className="bs-consumer-payment-methods-card__title"
        title={t('reworked.myProfile.paymentMethods.title')}
        variant="md"
      />
      <Typography
        className={classNames('bs-consumer-payment-methods-card__text', {
          'bs-consumer-payment-methods-card__text--hidden':
            !isPaymentMethodsEmpty,
        })}
      >
        {t('reworked.myProfile.paymentMethods.empty')}
      </Typography>
      <ConsumerCardSection
        className={classNames(
          'bs-consumer-payment-methods-card__card-section',
          {
            'bs-consumer-payment-methods-card__card-section--hidden':
              !cards.length,
          },
        )}
        title={t('reworked.myProfile.paymentMethods.cards')}
      >
        <List className="bs-consumer-payment-methods-card__list">
          {cards.map((card) => (
            <ListItem
              captionText={t(
                'reworked.myProfile.paymentMethods.cardItemCaptionText',
                {
                  additionalInfo: card.additional_info,
                },
              )}
              classes={{
                captionText:
                  'bs-consumer-payment-methods-card__list-item__caption-text',
              }}
              className="bs-consumer-payment-methods-card__list-item"
              icon={<CreditCard01 />}
              label={
                <Trans
                  i18nKey="reworked.myProfile.paymentMethods.paymentMethodLabel"
                  t={t}
                  values={{ identifier: card.readable_identifier }}
                />
              }
              rightSlot={
                <IconButton
                  className="bs-consumer-payment-methods-card__list-item__icon-button"
                  color="grey"
                  isDisabled={detachPaymentMethodLoading}
                  onClick={selectPaymentMethodToDetach?.(card.id)}
                  size="md"
                  variant="outlined"
                >
                  <Trash03 />
                </IconButton>
              }
              size="sm"
              type="text"
            />
          ))}
        </List>
      </ConsumerCardSection>
      <ConsumerCardSection
        className={classNames(
          'bs-consumer-payment-methods-card__direct-payment-section',
          {
            'bs-consumer-payment-methods-card__direct-payment-section--hidden':
              !directPayments.length,
          },
        )}
        title={t('reworked.myProfile.paymentMethods.directPayments')}
      >
        <List className="bs-consumer-payment-methods-card__list">
          {directPayments.map((directPayment) => (
            <ListItem
              captionText={directPayment.additional_info}
              classes={{
                captionText:
                  'bs-consumer-payment-methods-card__list-item__caption-text',
              }}
              className="bs-consumer-payment-methods-card__list-item"
              icon={<Bank />}
              label={
                <Trans
                  i18nKey="reworked.myProfile.paymentMethods.paymentMethodLabel"
                  t={t}
                  values={{ identifier: directPayment.readable_identifier }}
                />
              }
              rightSlot={
                <IconButton
                  className="bs-consumer-payment-methods-card__list-item__icon-button"
                  color="grey"
                  isDisabled={detachPaymentMethodLoading}
                  onClick={selectPaymentMethodToDetach?.(directPayment.id)}
                  size="md"
                  variant="outlined"
                >
                  <Trash03 />
                </IconButton>
              }
              size="sm"
              type="text"
            />
          ))}
        </List>
      </ConsumerCardSection>
      <ConsumerCardSection className="bs-consumer-payment-methods-card__button-section">
        <Button
          className="bs-consumer-payment-methods-card__button-section__button"
          color="grey"
          leftIcon={<CreditCardPlus />}
          onClick={openAddPaymentMethodPortal}
          size="md"
          variant="outlined"
        >
          {t('reworked.myProfile.paymentMethods.add')}
        </Button>
      </ConsumerCardSection>
    </Card>
  );
};

export const SavedPaymentMethodCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof SavedPaymentMethodCard>
>()(SavedPaymentMethodCard);
export default React.memo(SavedPaymentMethodCard);
