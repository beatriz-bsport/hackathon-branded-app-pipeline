import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import FreeOfferChip from '#src/components/css-only/FreeOfferChip';

import './styles.css';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

type ColorVariant = 'default' | 'in-details';

export type Props = {
  credits: number;
  isCreditDisplayEnabled: boolean;
  isFreeLabelEnabled: boolean;
  colorVariant?: ColorVariant;
};

const OfferPriceTag: React.FC<Props> = ({
  credits,
  isCreditDisplayEnabled,
  isFreeLabelEnabled,
  colorVariant = 'default',
}) => {
  const showFreeLabel = isFreeLabelEnabled && credits === 0;

  if (showFreeLabel) {
    return <FreeOfferChip whiteText={colorVariant === 'in-details'} />;
  }

  if (isCreditDisplayEnabled) {
    return <CreditsChip colorVariant={colorVariant} credits={credits} />;
  }
  return null;
};

type CreditsChipProps = {
  credits: number;
  colorVariant: ColorVariant;
};

export const CreditsChip: React.FC<CreditsChipProps> = ({
  credits,
  colorVariant,
}) => {
  const { t } = useTranslation('offer');

  return (
    <div
      className={classNames('bs-offer-price-tag', {
        'bs-offer-price-tag__in-details': colorVariant === 'in-details',
      })}
    >
      {t('numberOfCredits', {
        count: Number(getCreditsDividedDisplay(credits)),
      })}
    </div>
  );
};

export default React.memo(OfferPriceTag);
