import React, { memo, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { usePrivatePassData } from '#src/libs/marketplace/hooks/usePrivatePassData';
import { CalendarDate, VideoRecorder } from '#src/components/untitledui';
import Typography from '#Fabrique/Typography';
import { ShowMore } from '#Fabrique/ShowMore/ShowMore.component';
import Button from '#Fabrique/ButtonV2';
import ExpandableContent from '#src/components/css-only/Fabrique/expandable-content/ExpandableContent';
import Chip from '#Fabrique/Chip';
import Price from '#src/libs/marketplace/components/price/Price';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Title from '#Fabrique/Title';
import DetailModalContainer from '#src/pages/marketplace/passes/components/detail-modal-container/DetailModalContainer';
import { usePassesActions } from '#src/pages/marketplace/passes/hooks/usePassesActions';
import { usePassesContext } from '#src/pages/marketplace/passes/PassesContext';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import './style.css';

const COLLAPSED_HEIGHT = 40;
const MAX_DESCRIPTION_LENGTH = 200;

const AppointmentDetailModal: React.FC = () => {
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

  const { selectedAppointmentCardId } = usePassesContext();
  const {
    handleCloseAppointmentPassModal,
    handleAddToCart,
    basketLoadingStatus,
  } = usePassesActions();

  const {
    title,
    description,
    validity,
    price,
    credits,
    isCompatibleWithVod,
    isNewMemberOnly,
    hasNoCompatibleServices,
    compatibleServices,
  } = usePrivatePassData(selectedAppointmentCardId);

  if (!selectedAppointmentCardId) return null;

  return (
    <DetailModalContainer
      closeModal={handleCloseAppointmentPassModal}
      isModalOpen={!!selectedAppointmentCardId}
      isSubmitLoading={basketLoadingStatus}
      onConfirm={handleAddToCart(
        selectedAppointmentCardId,
        BUYABLE_ITEM_PRIVATE_PASS,
      )}
      title={title ?? ''}
    >
      <div className="bs-marketplace-appointment-detail__root">
        <div className="bs-marketplace-appointment-detail__validity">
          <CalendarDate
            className="bs-marketplace-appointment-detail__validity__icon"
            stroke="currentColor"
          />
          <Typography className="bs-marketplace-appointment-detail__validity__label">
            {validity}
          </Typography>
        </div>
        <div className="bs-marketplace-appointment-detail__chips">
          <Chip
            className="bs-marketplace-appointment-detail__chips__credits"
            color="grey"
            variant="weak"
          >
            {t('passes.detail.header.credits', { count: credits })}
          </Chip>
          {isNewMemberOnly && (
            <Chip
              className="bs-marketplace-appointment-detail__chips__new-member"
              color="info"
              variant="weak"
            >
              {t('passes.detail.header.newMemberOnly')}
            </Chip>
          )}
          {hasNoCompatibleServices && (
            <Chip
              className="bs-marketplace-appointment-detail__chips__no-appointments"
              color="error"
              variant="weak"
            >
              {t('passes.detail.compatibility.contents.noAppointments')}
            </Chip>
          )}
        </div>
        <div className="bs-marketplace-appointment-detail__description">
          <ShowMore
            collapsedHeight={COLLAPSED_HEIGHT}
            isExpanded={isDescriptionExpanded}
          >
            {description}
          </ShowMore>
          {description?.length &&
            description.length > MAX_DESCRIPTION_LENGTH && (
              <Button
                className="bs-marketplace-appointment-detail__description__show-more"
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
        {price && (
          <div className="bs-marketplace-appointment-detail__price">
            <Price price={price} />
          </div>
        )}
        <ExpandableContent
          className="bs-marketplace-appointment-detail__compatibility"
          id="compatibility"
          title={t('passes.detail.compatibility.titles.main')}
        >
          <div className="bs-marketplace-appointment-detail__compatibility__content">
            <List className="bs-marketplace-appointment-detail__compatibility__list">
              {isCompatibleWithVod && (
                <ListItem
                  className="bs-marketplace-appointment-detail__compatibility__list-item"
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
            </List>
            {!!compatibleServices.length && (
              <div className="bs-marketplace-appointment-detail__compatibility__appointments">
                <Title
                  className="bs-marketplace-appointment-detail__compatibility__appointments__title"
                  title={t(
                    'passes.detail.compatibility.subtitles.appointments',
                  )}
                  variant="xs"
                />
                <List className="bs-marketplace-appointment-detail__compatibility__appointments__list">
                  {compatibleServices.map((compatibleService) => (
                    <ListItem
                      key={compatibleService.id}
                      className="bs-marketplace-appointment-detail__compatibility__appointments__list-item"
                      label={compatibleService.name}
                      size="lg"
                    />
                  ))}
                </List>
              </div>
            )}
          </div>
        </ExpandableContent>
      </div>
    </DetailModalContainer>
  );
};

export default memo(AppointmentDetailModal);
