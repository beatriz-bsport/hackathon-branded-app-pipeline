import React, { memo, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { usePaymentPackModalData } from '#src/pages/marketplace/passes/hooks/usePaymentPackModalData';
import {
  CalendarDate,
  CheckCircle,
  ClockCheck,
  UsersPlus,
  VideoRecorder,
} from '#src/components/untitledui';
import Typography from '#Fabrique/Typography';
import { ShowMore } from '#Fabrique/ShowMore/ShowMore.component';
import Button from '#Fabrique/ButtonV2';
import ExpandableContent from '#src/pages/marketplace/passes/components/expandable-content/ExpandableContent';
import ChipsContainer, {
  type ChipData,
} from '#src/pages/marketplace/passes/components/chips-container/ChipsContainer';
import Chip from '#Fabrique/Chip';
import Price from '#src/libs/marketplace/components/price/Price';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import clsx from 'clsx';
import Title from '#Fabrique/Title';
import Avatar from '#Fabrique/Temporary/Avatar';
import DetailModalContainer from '#src/pages/marketplace/passes/components/detail-modal-container/DetailModalContainer';
import { usePassesActions } from '#src/pages/marketplace/passes/hooks/usePassesActions';
import { usePassesContext } from '#src/pages/marketplace/passes/PassesContext';
import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items';
import './style.css';

const COLLAPSED_HEIGHT = 40;
const MAX_DESCRIPTION_LENGTH = 200;

const PassDetailModal: React.FC = () => {
  const { t } = useTranslation('marketplace');
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);
  const toggleShowMoreDescription = useCallback(
    () =>
      setIsDescriptionExpanded(
        (previousIsDescriptionExpanded) => !previousIsDescriptionExpanded,
      ),
    [setIsDescriptionExpanded],
  );

  const { selectedCardId } = usePassesContext();
  const { handleClosePassModal, handleAddToCart, basketLoadingStatus } =
    usePassesActions();

  const {
    title,
    description,
    validity,
    price,
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
    getTimeSlotChipsLabels,
  } = usePaymentPackModalData(selectedCardId);

  const categoryChips: ChipData[] = useMemo(
    () => compatibleCategoryLabels.map((label) => ({ label })),
    [compatibleCategoryLabels],
  );

  const metaActivityChips: ChipData[] = useMemo(
    () => compatibleMetaActivityLabels.map((label) => ({ label })),
    [compatibleMetaActivityLabels],
  );

  const roomChips: ChipData[] = useMemo(
    () => compatibleRoomLabels.map((label) => ({ label })),
    [compatibleRoomLabels],
  );

  const timeSlotsWithChips = useMemo(() => {
    return timeSlots.map((timeSlot) => ({
      ...timeSlot,
      chips: getTimeSlotChipsLabels(timeSlot).map((label) => ({ label })),
    }));
  }, [timeSlots, getTimeSlotChipsLabels]);

  if (!selectedCardId) return null;

  return (
    <DetailModalContainer
      closeModal={handleClosePassModal}
      isModalOpen={!!selectedCardId}
      isSubmitLoading={basketLoadingStatus}
      onConfirm={handleAddToCart(selectedCardId, BUYABLE_ITEM_PASS)}
      title={title}
    >
      <div className="bs-marketplace-pass-detail__root">
        <div className="bs-marketplace-pass-detail__validity">
          <CalendarDate
            className="bs-marketplace-pass-detail__validity__icon"
            stroke="currentColor"
          />
          <Typography className="bs-marketplace-pass-detail__validity__label">
            {validity}
          </Typography>
        </div>
        <div className="bs-marketplace-pass-detail__chips">
          <Chip
            className="bs-marketplace-pass-detail__chips__credits"
            color="grey"
            variant="weak"
          >
            {t('passes.detail.header.credits', { count: credits })}
          </Chip>
          {isOnsitePaymentAvailable && (
            <Chip
              className="bs-marketplace-pass-detail__chips__onsite"
              color="success"
              variant="weak"
            >
              {t('passes.detail.header.onsitePaymentAvailable')}
            </Chip>
          )}
          {isUniversal && (
            <Chip
              className="bs-marketplace-pass-detail__chips__universal"
              color="success"
              variant="weak"
            >
              {t('passes.detail.header.isUniversalPass')}
            </Chip>
          )}
          {isOnlyCompatibleWithVod && (
            <Chip
              className="bs-marketplace-pass-detail__chips__only-vod"
              color="warning"
              variant="weak"
            >
              {t('passes.detail.header.onlyVodAccess')}
            </Chip>
          )}
          {isNewMemberOnly && (
            <Chip
              className="bs-marketplace-pass-detail__chips__new-member"
              color="info"
              variant="weak"
            >
              {t('passes.detail.header.newMemberOnly')}
            </Chip>
          )}
        </div>
        <div className="bs-marketplace-pass-detail__description">
          <ShowMore
            collapsedHeight={COLLAPSED_HEIGHT}
            isExpanded={isDescriptionExpanded}
          >
            {description}
          </ShowMore>
          {description?.length &&
            description.length > MAX_DESCRIPTION_LENGTH && (
              <Button
                className="bs-marketplace-pass-detail__description__show-more"
                color="grey"
                onClick={toggleShowMoreDescription}
                size="sm"
                variant="text"
              >
                {isDescriptionExpanded
                  ? t('passes.detail.description.showLess')
                  : t('passes.detail.description.showMore')}
              </Button>
            )}
        </div>
        <div className="bs-marketplace-pass-detail__price">
          <Price price={price} />
        </div>
        <ExpandableContent
          className="bs-marketplace-pass-detail__compatibility"
          id="compatibility"
          title={t('passes.detail.compatibility.titles.main')}
        >
          <div className="bs-marketplace-pass-detail__compatibility__content">
            <List className="bs-marketplace-pass-detail__compatibility__list">
              {isCompatibleWithAllActivities && (
                <ListItem
                  className={clsx(
                    'bs-marketplace-pass-detail__compatibility__list-item',
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
                    'bs-marketplace-pass-detail__compatibility__list-item',
                  )}
                  icon={<CheckCircle stroke="currentColor" />}
                  label={t('passes.detail.compatibility.contents.allRooms')}
                  size="sm"
                />
              )}
              {isCompatibleWithAllCategories && (
                <ListItem
                  className={clsx(
                    'bs-marketplace-pass-detail__compatibility__list-item',
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
                    'bs-marketplace-pass-detail__compatibility__list-item',
                  )}
                  icon={<ClockCheck stroke="currentColor" />}
                  label={t('passes.detail.compatibility.contents.allTimeSlots')}
                  size="sm"
                />
              )}
              {isCompatibleWithVod && (
                <ListItem
                  className={clsx(
                    'bs-marketplace-pass-detail__compatibility__list-item',
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
                    'bs-marketplace-pass-detail__compatibility__list-item',
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
              <div className="bs-marketplace-pass-detail__compatibility__studios">
                <Title
                  className="bs-marketplace-pass-detail__compatibility__studios__title"
                  title={t('passes.detail.compatibility.titles.studios')}
                  variant="xs"
                />
                <List className="bs-marketplace-pass-detail__compatibility__studios__list">
                  {compatibleEstablishments.map((establishment) => (
                    <ListItem
                      key={establishment.id}
                      className="bs-marketplace-pass-detail__compatibility__studios__list-item"
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
            {timeSlotsWithChips.length > 0 && (
              <div className="bs-marketplace-pass-detail__compatibility__time-slots">
                <Title
                  className="bs-marketplace-pass-detail__compatibility__time-slots__title"
                  title={t('passes.detail.compatibility.subtitles.timeSlots')}
                  variant="xs"
                />
                {timeSlotsWithChips.map((timeSlot) => {
                  return (
                    <ChipsContainer
                      key={timeSlot.dayOfWeek}
                      chips={timeSlot.chips}
                      classname="bs-marketplace-pass-detail__compatibility__time-slots__content"
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
              <div className="bs-marketplace-pass-detail__compatibility__activities">
                <Title
                  className="bs-marketplace-pass-detail__compatibility__activities__title"
                  title={t('passes.detail.compatibility.subtitles.activity')}
                  variant="xs"
                />
                <ChipsContainer
                  chips={categoryChips}
                  classname="bs-marketplace-pass-detail__compatibility__category"
                  title={t('passes.detail.compatibility.labels.category')}
                />
                <ChipsContainer
                  chips={metaActivityChips}
                  classname="bs-marketplace-pass-detail__compatibility__activity"
                  title={t('passes.detail.compatibility.labels.activity')}
                />
                <ChipsContainer
                  chips={roomChips}
                  classname="bs-marketplace-pass-detail__compatibility__rooms"
                  title={t('passes.detail.compatibility.labels.room')}
                />
              </div>
            )}
          </div>
        </ExpandableContent>
        {restrictions.length > 0 && (
          <ExpandableContent
            className="bs-marketplace-pass-detail__restrictions"
            id="restrictions"
            title={t('passes.detail.restriction.title')}
          >
            <List className="bs-marketplace-pass-detail__restrictions__list">
              {restrictions.map((restriction) => (
                <ListItem
                  key={restriction.frequency}
                  className="bs-marketplace-pass-detail__restrictions__list-item"
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
      </div>
    </DetailModalContainer>
  );
};

export default memo(PassDetailModal);
