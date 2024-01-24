import React from 'react';
import { useTranslation } from 'react-i18next';

import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';
import type { ConsumerSubscriptionCardProps } from '..';
import { ConsumerGenericCardBodyContainer } from '#libs/consumer-space/components/reworked/common/ConsumerCard';
import { ChevronRight } from '#components/untitledui';
import { getSubscriptionRecurrenceLabel } from '#libs/consumer-space/components/reworked/@MySubscriptions/utils';

type Props = Pick<
  ConsumerSubscriptionCardProps,
  | 'price'
  | 'recurrence'
  | 'isDetailsDisabled'
  | 'onDetailsClick'
  | 'subscriptionInterval'
>;

const ConsumerSubscriptionCardBody: React.FC<Props> = ({
  price,
  recurrence,
  isDetailsDisabled,
  onDetailsClick,
  subscriptionInterval,
}) => {
  const { t } = useTranslation('consumerSpace');
  const recurrenceLabel = getSubscriptionRecurrenceLabel(
    recurrence,
    price,
    t,
    subscriptionInterval,
  );

  return (
    <ConsumerGenericCardBodyContainer className="bs-consumer__subscription-card__container">
      <List className="bs-consumer__subscription-card__list">
        <ListItem
          classes={{
            label: 'bs-consumer__subscription-card__list-item__price',
          }}
          className="bs-consumer__subscription-card__list-item"
          label={recurrenceLabel}
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
