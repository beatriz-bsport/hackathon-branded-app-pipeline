import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';

import { ConsumerGenericCardBodyContainer } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import { ChevronRight } from '#src/components/untitledui';
import ConsumerSubscriptionRecurrenceLabel from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionRecurrenceLabel';
import type { ConsumerSubscriptionCardProps } from '..';

type Props = Pick<
  ConsumerSubscriptionCardProps,
  | 'isDetailsDisabled'
  | 'onDetailsClick'
  | 'price'
  | 'recurrenceBasis'
  | 'subscriptionInterval'
  | 'subscriptionNextPaymentDate'
>;

const ConsumerSubscriptionCardBody: React.FC<Props> = ({
  isDetailsDisabled,
  onDetailsClick,
  price,
  recurrenceBasis,
  subscriptionInterval,
  subscriptionNextPaymentDate,
}) => {
  const { t } = useTranslation(['consumerSpace', 'subscription']);

  return (
    <ConsumerGenericCardBodyContainer className="bs-consumer__subscription-card__container">
      <List className="bs-consumer__subscription-card__list">
        <ListItem
          className={classNames('bs-consumer__subscription-card__list-item', {
            'bs-consumer__subscription-card__list-item--empty':
              !subscriptionNextPaymentDate,
          })}
          label={t(
            'reworked.mySubscriptions.consumerSubscriptionCard.nextPayment',
            { nextPayment: subscriptionNextPaymentDate },
          )}
        />
        <ListItem
          classes={{
            label: 'bs-consumer__subscription-card__list-item__price',
          }}
          className="bs-consumer__subscription-card__list-item"
          label={
            <ConsumerSubscriptionRecurrenceLabel
              price={price}
              recurrenceBasis={recurrenceBasis}
              subscriptionInterval={subscriptionInterval}
            />
          }
        />
      </List>
      <Button
        className="bs-consumer__subscription-card__body__button"
        color="primary"
        isDisabled={isDetailsDisabled}
        onClick={onDetailsClick}
        rightIcon={<ChevronRight stroke="currentColor" />}
        size="md"
        variant="text"
      >
        <Typography
          align="center"
          className="bs-consumer__subscription-card__body__button__label"
          variant="body-md"
        >
          {t(
            'reworked.mySubscriptions.consumerSubscriptionCard.buttonsLabel.seeDetails',
          )}
        </Typography>
      </Button>
    </ConsumerGenericCardBodyContainer>
  );
};

export default React.memo(ConsumerSubscriptionCardBody);
