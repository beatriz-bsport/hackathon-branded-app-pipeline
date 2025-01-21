import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import './styles.css';

export type Props = {
  whiteText?: boolean;
};

const FreeOfferChip: React.FC<Props> = ({ whiteText }) => {
  const { t } = useTranslation('offer');

  return (
    <div
      className={clsx('bs-free-offer-chip', {
        '--white-text': whiteText,
      })}
    >
      {t('isFree')}
    </div>
  );
};
export default React.memo(FreeOfferChip);
