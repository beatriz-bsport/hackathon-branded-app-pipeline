import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './styles.css';

export type Props = {
  whiteText?: boolean;
};

const FreeOfferChip: React.FC<Props> = ({ whiteText }) => {
  const { t } = useTranslation('offer');

  return (
    <div
      className={classNames('bs-free-offer-chip', {
        '--white-text': whiteText,
      })}
    >
      {t('isFree')}
    </div>
  );
};
export default React.memo(FreeOfferChip);
