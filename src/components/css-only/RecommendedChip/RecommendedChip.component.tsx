import React from 'react';

import StarIcon from '@material-ui/icons/Star';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Chip from '#components/css-only/Chip';

import './RecommendedChipStyles.css';

export const RecommendedChip: React.FC = () => {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Chip
      classes={{ 'bs-recommended-chip': 'bs-recommended-chip' }}
      icon={<StarIcon fontSize="small" />}
      label={isMobile ? null : t('recommended')}
    />
  );
};

export const RecommendedChipForStoryBook = marketplaceCssHoc()(RecommendedChip);

export default React.memo(RecommendedChip);
