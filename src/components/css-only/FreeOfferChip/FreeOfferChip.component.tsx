import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import type { CompanyTheme } from '#src/libs/theme/types';

import './styles.css';

export type Props = {
  credits: number;
  creditsOverride: number;
  companyTheme: CompanyTheme;
  whiteText?: boolean;
};

const FreeOfferChip: React.FC<Props> = ({
  credits,
  creditsOverride,
  companyTheme,
  whiteText,
}) => {
  const { t } = useTranslation('offer');

  if (
    companyTheme?.show_free_session_label &&
    (creditsOverride === 0 || (!creditsOverride && credits === 0))
  ) {
    return (
      <div
        className={classNames('bs-free-offer-chip', {
          '--white-text': whiteText,
        })}
      >
        {t('isFree')}
      </div>
    );
  }
  return null;
};

export default React.memo(FreeOfferChip);
