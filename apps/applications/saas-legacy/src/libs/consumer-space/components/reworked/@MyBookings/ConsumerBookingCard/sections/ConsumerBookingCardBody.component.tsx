import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';

import {
  ChevronRight,
  HourGlass03,
  MarkerPin04,
  MarkerPin06,
  User01,
} from '#src/components/untitledui';
import { ConsumerGenericCardBodyContainer } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import type { ConsumerBookingCardProps } from '..';

type Props = Required<
  Pick<
    ConsumerBookingCardProps,
    | 'establishmentAddress'
    | 'coachName'
    | 'coachPhoto'
    | 'spotSchedulingPosition'
    | 'waitingListPosition'
    | 'isDetailsDisabled'
    | 'onDetailsClick'
    | 'isBookingCancelled'
    | 'onSpotSchedulingClick'
    | 'displayWaitingListPosition'
  >
>;

const ConsumerBookingCardBody: React.FC<Props> = ({
  establishmentAddress,
  coachName,
  coachPhoto,
  spotSchedulingPosition,
  waitingListPosition,
  isDetailsDisabled,
  onDetailsClick,
  isBookingCancelled,
  onSpotSchedulingClick,
  displayWaitingListPosition,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerGenericCardBodyContainer className="bs-consumer-booking-card__container">
      <List
        className={clsx('bs-consumer-booking-card__list', {
          'bs-consumer-booking-card__field--hidden': isBookingCancelled,
        })}
      >
        <ListItem
          classes={{
            icon: 'bs-consumer-booking-card__icon--size',
          }}
          className={clsx('bs-consumer-booking-card__list-item', {
            'bs-consumer-booking-card__field--hidden':
              !establishmentAddress || isBookingCancelled,
          })}
          icon={<MarkerPin04 />}
          label={establishmentAddress}
        />
        <ListItem
          classes={{
            icon: 'bs-consumer-booking-card__icon--size',
          }}
          className={clsx('bs-consumer-booking-card__list-item', {
            'bs-consumer-booking-card__field--hidden': !coachName,
          })}
          // TODO: create Avatar component
          icon={
            coachPhoto ? (
              <img alt="coach" src={coachPhoto} />
            ) : (
              <User01 stroke="currentColor" />
            )
          }
          label={coachName}
        />
        <ListItem
          classes={{
            icon: 'bs-consumer-booking-card__icon--size',
          }}
          className={clsx('bs-consumer-booking-card__list-item', {
            'bs-consumer-booking-card__field--hidden':
              !spotSchedulingPosition || isBookingCancelled,
          })}
          icon={<MarkerPin06 />}
          label={t(
            'reworked.myBookings.consumerBookingCard.listItemLabels.spotSchedulingPosition',
            {
              spotSchedulingPosition,
            },
          )}
          onClick={onSpotSchedulingClick}
          type="clickableText"
        />
        <ListItem
          classes={{
            icon: 'bs-consumer-booking-card__icon--size',
          }}
          className={clsx('bs-consumer-booking-card__list-item', {
            'bs-consumer-booking-card__field--hidden':
              !waitingListPosition ||
              isBookingCancelled ||
              !displayWaitingListPosition,
          })}
          icon={<HourGlass03 />}
          label={t(
            'reworked.myBookings.consumerBookingCard.listItemLabels.waitingList',
            {
              waitingListPosition:
                waitingListPosition?.waiting_list_position?.member_position,
            },
          )}
        />
      </List>
      <Button
        className="bs-consumer-booking-card__body__button"
        color="primary"
        isDisabled={isDetailsDisabled}
        onClick={onDetailsClick}
        rightIcon={<ChevronRight stroke="currentColor" />}
        size="md"
        variant="text"
      >
        <Typography
          align="center"
          className="bs-consumer-booking-card__body__button__label"
          variant="body-md"
        >
          {t('reworked.myBookings.consumerBookingCard.buttonsLabel.seeDetails')}
        </Typography>
      </Button>
    </ConsumerGenericCardBodyContainer>
  );
};

export default React.memo(ConsumerBookingCardBody);
