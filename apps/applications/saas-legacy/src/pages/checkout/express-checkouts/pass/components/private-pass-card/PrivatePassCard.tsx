import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CalendarDate, VideoRecorder } from '#src/components/untitledui';
import Typography from '#Fabrique/Typography';
import ExpandableContent from '#src/components/css-only/Fabrique/expandable-content/ExpandableContent';
import Chip from '#Fabrique/Chip';
import Price from '#src/libs/marketplace/components/price/Price';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Title from '#Fabrique/Title';
import Card from '#src/components/css-only/Fabrique/Card';
import { usePrivatePassCardData } from '#src/pages/checkout/express-checkouts/pass/hooks/usePrivatePassCardData';
import './style.css';

export const PrivatePassCard: React.FC = memo(() => {
  const { t } = useTranslation('marketplace');

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
  } = usePrivatePassCardData();

  return (
    <Card className="bs-express-checkout-private-pass-card__root">
      <div className="bs-express-checkout-private-pass-card__header">
        <Typography
          className="bs-express-checkout-private-pass-card__header__title"
          variant="title-sm"
        >
          {title}
        </Typography>
        <Price price={price} />
      </div>
      <div className="bs-express-checkout-private-pass-card__validity">
        <CalendarDate
          className="bs-express-checkout-private-pass-card__validity__icon"
          stroke="currentColor"
        />
        <Typography className="bs-express-checkout-private-pass-card__validity__label">
          {validity}
        </Typography>
      </div>
      <div className="bs-express-checkout-private-pass-card__chips">
        <Chip
          className="bs-express-checkout-private-pass-card__chips__credits"
          color="grey"
          variant="weak"
        >
          {t('passes.detail.header.credits', { count: credits })}
        </Chip>
        {isNewMemberOnly && (
          <Chip
            className="bs-express-checkout-private-pass-card__chips__new-member"
            color="info"
            variant="weak"
          >
            {t('passes.detail.header.newMemberOnly')}
          </Chip>
        )}
        {hasNoCompatibleServices && (
          <Chip
            className="bs-express-checkout-private-pass-card__chips__no-appointments"
            color="error"
            variant="weak"
          >
            {t('passes.detail.compatibility.contents.noAppointments')}
          </Chip>
        )}
      </div>
      {description?.length && (
        <ExpandableContent
          initiallyOpen
          className="bs-express-checkout-private-pass-card__description-section"
          id="description"
          title={t('passes.detail.description.label')}
        >
          <Typography
            className="bs-express-checkout-private-pass-card__description"
            variant="body-md"
          >
            {description}
          </Typography>
        </ExpandableContent>
      )}
      <ExpandableContent
        initiallyOpen
        className="bs-express-checkout-private-pass-card__compatibility"
        id="compatibility"
        title={t('passes.detail.compatibility.titles.main')}
      >
        <div className="bs-express-checkout-private-pass-card__compatibility__content">
          <List className="bs-express-checkout-private-pass-card__compatibility__list">
            {isCompatibleWithVod && (
              <ListItem
                className="bs-express-checkout-private-pass-detail__compatibility__list-item"
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
            <div className="bs-express-checkout-private-pass-detail__compatibility__appointments">
              <Title
                className="bs-express-checkout-private-pass-detail__compatibility__appointments__title"
                title={t('passes.detail.compatibility.subtitles.appointments')}
                variant="xs"
              />
              <div className="bs-express-checkout-private-pass-card__chips">
                {compatibleServices.map((compatibleService) => (
                  <Chip
                    key={compatibleService.id}
                    className="bs-express-checkout-private-pass-detail__compatibility__appointments__list-item"
                    color="grey"
                    variant="weak"
                  >
                    {compatibleService.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      </ExpandableContent>
    </Card>
  );
});
