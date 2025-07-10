import React, { memo } from 'react';
import Typography from '#src/components/css-only/Fabrique/Typography';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import Card from '#src/components/css-only/Fabrique/Card';
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';
import { useValidityInfoForPaymentPackCard } from '#src/pages/marketplace/passes/hooks/useValidityInfoForPaymentPackCard';
import { useTranslation } from 'react-i18next';
import Price from '#src/libs/marketplace/components/price/Price';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import type { CardContent } from '#src/pages/marketplace/passes/types';
import './style.css';

type AppointmentPassCardProps = {
  content: CardContent;
};

const AppointmentPassCard: React.FC<AppointmentPassCardProps> = ({
  content,
}) => {
  const { t } = useTranslation('marketplace');
  const { title, price, tax, credits, onAddToCart, onClickDetails } = content;
  const { width } = useViewport();
  const validity = useValidityInfoForPaymentPackCard(content.validityInfo);
  const isMobile = width < MARKETPLACE_BREAKPOINT.XS;

  return (
    <Card className="bs-marketplace-appointment-pass-card__root">
      <div className="bs-marketplace-appointment-pass-card__header">
        <Typography
          className="bs-marketplace-appointment-pass-card__title"
          variant="title-sm"
        >
          {title}
        </Typography>
        <Typography
          className="bs-marketplace-appointment-pass-card__description"
          variant="body-md"
        >
          {validity}
        </Typography>
      </div>

      <div className="bs-marketplace-appointment-pass-card__content">
        <Price price={price} tax={tax} />
        <div className="bs-marketplace-appointment-pass-card__divider"></div>
        <Typography
          className="bs-marketplace-appointment-pass-card__credits"
          variant="title-lg"
        >
          {credits}
        </Typography>
      </div>

      <div className="bs-marketplace-appointment-pass-card__footer">
        <Button
          className="bs-marketplace-appointment-pass-card__detail-button"
          color="grey"
          onClick={onClickDetails}
          size="md"
          variant={isMobile ? 'outlined' : 'text'}
        >
          {t('passes.details')}
        </Button>
        <Button
          className="bs-marketplace-appointment-pass-card__buy-button"
          color="primary"
          onClick={onAddToCart}
          size="md"
        >
          {t('passes.buy')}
        </Button>
      </div>
    </Card>
  );
};

export default memo(AppointmentPassCard);
