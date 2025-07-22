import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { usePaymentPackData } from '#src/libs/marketplace/hooks/usePaymentPackData';
import {
  CalendarDate,
  CheckCircle,
  ClockCheck,
  UsersPlus,
  VideoRecorder,
} from '#src/components/untitledui';
import Typography from '#Fabrique/Typography';
import ExpandableContent from '#Fabrique/expandable-content/ExpandableContent';
import ChipsContainer from '#src/pages/marketplace/passes/components/chips-container/ChipsContainer';
import Chip from '#Fabrique/Chip';
import Price from '#src/libs/marketplace/components/price/Price';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import clsx from 'clsx';
import Title from '#Fabrique/Title';
import Avatar from '#Fabrique/Temporary/Avatar';
import Card from '#src/components/css-only/Fabrique/Card';

import { useFetchPaymentPackData } from '#src/pages/checkout/express-checkouts/pass/hooks/useFetchPaymentPackData';

import './style.css';

export const PaymentPackCard: React.FC<{ paymentPackId: number }> = memo(
  ({ paymentPackId }) => {
    const { t } = useTranslation('marketplace');

    useFetchPaymentPackData(paymentPackId);

    const {
      title,
      description,
      validity,
      price,
      tax,
      credits,
      isOnsitePaymentAvailable,
      isCompatibleWithAllActivities,
      isCompatibleWithAllRooms,
      isCompatibleWithAllCategories,
      compatibleEstablishments,
      compatibleRoomLabels,
      compatibleMetaActivityLabels,
      compatibleCategoryLabels,
      timeSlots,
      isCompatibleWithVod,
      isOnlyCompatibleWithVod,
      isUniversal,
      isNewMemberOnly,
      isCompatibleWithBookingForGuest,
      restrictions,
      categoryChipsData,
      metaActivityChipsData,
      roomChipsData,
      timeSlotsWithChipsData,
    } = usePaymentPackData(paymentPackId);

    if (!paymentPackId) return null;

    return (
      <Card className="bs-express-checkout-pass-detail__root">
        <div className="bs-express-checkout-pass-detail__header">
          <Typography
            className="bs-express-checkout-pass-detail__header__title"
            variant="title-sm"
          >
            {title}
          </Typography>
          <Price price={price} tax={tax} />
        </div>
        <div className="bs-express-checkout-pass-detail__validity">
          <CalendarDate
            className="bs-express-checkout-pass-detail__validity__icon"
            stroke="currentColor"
          />
          <Typography className="bs-express-checkout-pass-detail__validity__label">
            {validity}
          </Typography>
        </div>
        <div className="bs-express-checkout-pass-detail__chips">
          <Chip
            className="bs-express-checkout-pass-detail__chips__credits"
            color="grey"
            variant="weak"
          >
            {t('passes.detail.header.credits', { count: credits })}
          </Chip>
          {isOnsitePaymentAvailable && (
            <Chip
              className="bs-express-checkout-pass-detail__chips__onsite"
              color="success"
              variant="weak"
            >
              {t('passes.detail.header.onsitePaymentAvailable')}
            </Chip>
          )}
          {isUniversal && (
            <Chip
              className="bs-express-checkout-pass-detail__chips__universal"
              color="success"
              variant="weak"
            >
              {t('passes.detail.header.isUniversalPass')}
            </Chip>
          )}
          {isOnlyCompatibleWithVod && (
            <Chip
              className="bs-express-checkout-pass-detail__chips__only-vod"
              color="warning"
              variant="weak"
            >
              {t('passes.detail.header.onlyVodAccess')}
            </Chip>
          )}
          {isNewMemberOnly && (
            <Chip
              className="bs-express-checkout-pass-detail__chips__new-member"
              color="info"
              variant="weak"
            >
              {t('passes.detail.header.newMemberOnly')}
            </Chip>
          )}
        </div>
        {description?.length && (
          <ExpandableContent
            className="bs-express-checkout-pass-detail__description-section"
            id="description"
            title={t('passes.detail.description.label')}
          >
            <Typography
              className="bs-express-checkout-pass-detail__description"
              variant="body-md"
            >
              {description}
            </Typography>
          </ExpandableContent>
        )}

        <ExpandableContent
          className="bs-express-checkout-pass-detail__compatibility"
          id="compatibility"
          title={t('passes.detail.compatibility.titles.main')}
        >
          <div className="bs-express-checkout-pass-detail__compatibility__content">
            <List className="bs-express-checkout-pass-detail__compatibility__list">
              {isCompatibleWithAllActivities && (
                <ListItem
                  className={clsx(
                    'bs-express-checkout-pass-detail__compatibility__list-item',
                  )}
                  icon={<CheckCircle stroke="currentColor" />}
                  label={t(
                    'passes.detail.compatibility.contents.allActivities',
                  )}
                  size="sm"
                />
              )}
              {isCompatibleWithAllRooms && (
                <ListItem
                  className={clsx(
                    'bs-express-checkout-pass-detail__compatibility__list-item',
                  )}
                  icon={<CheckCircle stroke="currentColor" />}
                  label={t('passes.detail.compatibility.contents.allRooms')}
                  size="sm"
                />
              )}
              {isCompatibleWithAllCategories && (
                <ListItem
                  className={clsx(
                    'bs-express-checkout-pass-detail__compatibility__list-item',
                  )}
                  icon={<CheckCircle stroke="currentColor" />}
                  label={t(
                    'passes.detail.compatibility.contents.allCategories',
                  )}
                  size="sm"
                />
              )}

              {!timeSlots?.length && (
                <ListItem
                  className={clsx(
                    'bs-express-checkout-pass-detail__compatibility__list-item',
                  )}
                  icon={<ClockCheck stroke="currentColor" />}
                  label={t('passes.detail.compatibility.contents.allTimeSlots')}
                  size="sm"
                />
              )}
              {isCompatibleWithVod && (
                <ListItem
                  className={clsx(
                    'bs-express-checkout-pass-detail__compatibility__list-item',
                  )}
                  icon={<VideoRecorder stroke="currentColor" />}
                  label={
                    <Trans
                      i18nKey="passes.detail.compatibility.contents.vod"
                      t={t}
                    />
                  }
                  size="sm"
                />
              )}
              {isCompatibleWithBookingForGuest && (
                <ListItem
                  className={clsx(
                    'bs-express-checkout-pass-detail__compatibility__list-item',
                  )}
                  icon={<UsersPlus stroke="currentColor" />}
                  label={
                    <Trans
                      i18nKey="passes.detail.compatibility.contents.bookingForGuest"
                      t={t}
                    />
                  }
                  size="sm"
                />
              )}
            </List>
            {!isCompatibleWithAllRooms && (
              <div className="bs-express-checkout-pass-detail__compatibility__establishments">
                <Title
                  className="bs-express-checkout-pass-detail__compatibility__establishments__title"
                  title={t('passes.detail.compatibility.titles.studios')}
                  variant="xs"
                />
                <List className="bs-express-checkout-pass-detail__compatibility__establishments__list">
                  {compatibleEstablishments.map((establishment) => (
                    <ListItem
                      key={establishment.id}
                      className="bs-express-checkout-pass-detail__compatibility__establishments__list-item"
                      icon={
                        <Avatar
                          picture={establishment.cover}
                          size="md"
                          type="place"
                        />
                      }
                      label={establishment.title}
                      size="lg"
                    />
                  ))}
                </List>
              </div>
            )}
            {timeSlotsWithChipsData.length > 0 && (
              <div className="bs-express-checkout-pass-detail__compatibility__time-slots">
                <Title
                  className="bs-express-checkout-pass-detail__compatibility__time-slots__title"
                  title={t('passes.detail.compatibility.subtitles.timeSlots')}
                  variant="xs"
                />
                {timeSlotsWithChipsData.map((timeSlot) => {
                  return (
                    <ChipsContainer
                      key={timeSlot.dayOfWeek}
                      chips={timeSlot.chips}
                      classname="bs-express-checkout-pass-detail__compatibility__time-slots__content"
                      title={t(
                        `datetime:time.weekdayNumber.${timeSlot.dayOfWeek}`,
                      )}
                    />
                  );
                })}
              </div>
            )}
            {(compatibleCategoryLabels.length > 0 ||
              compatibleMetaActivityLabels.length > 0 ||
              compatibleRoomLabels.length > 0) && (
              <div className="bs-express-checkout-pass-detail__compatibility__activities">
                <Title
                  className="bs-express-checkout-pass-detail__compatibility__activities__title"
                  title={t('passes.detail.compatibility.subtitles.activity')}
                  variant="xs"
                />
                <ChipsContainer
                  chips={categoryChipsData}
                  classname="bs-express-checkout-pass-detail__compatibility__category"
                  title={t('passes.detail.compatibility.labels.category')}
                />
                <ChipsContainer
                  chips={metaActivityChipsData}
                  classname="bs-express-checkout-pass-detail__compatibility__activity"
                  title={t('passes.detail.compatibility.labels.activity')}
                />
                <ChipsContainer
                  chips={roomChipsData}
                  classname="bs-express-checkout-pass-detail__compatibility__rooms"
                  title={t('passes.detail.compatibility.labels.room')}
                />
              </div>
            )}
          </div>
        </ExpandableContent>
        {restrictions.length > 0 && (
          <ExpandableContent
            className="bs-express-checkout-pass-detail__restrictions"
            id="restrictions"
            title={t('passes.detail.restriction.title')}
          >
            <List className="bs-express-checkout-pass-detail__restrictions__list">
              {restrictions.map((restriction) => (
                <ListItem
                  key={restriction.frequency}
                  className="bs-express-checkout-pass-detail__restrictions__list-item"
                  label={t(
                    `passes.detail.restriction.${restriction.frequency}`,
                    {
                      amount: restriction.amount,
                    },
                  )}
                  size="sm"
                />
              ))}
            </List>
          </ExpandableContent>
        )}
      </Card>
    );
  },
);
