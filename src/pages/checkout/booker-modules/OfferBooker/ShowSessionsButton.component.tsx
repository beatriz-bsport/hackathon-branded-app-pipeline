import React from 'react';

import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './BoutiqueBookerModule.css';

type ShowSessionButtonProps = {
  sessionsCount: number;
  toggleSession: () => void;
  isToggle: boolean;
};

const ShowSessionButton: React.FC<ShowSessionButtonProps> = ({
  isToggle,
  sessionsCount,
  toggleSession,
}) => {
  const { t } = useTranslation('booking');

  if (sessionsCount <= 0) return null;

  return (
    <>
      <ButtonBase
        className="bs-new-offer-booking-fetch-more-similar-offers__button"
        onClick={toggleSession}
      >
        {
          <div className="bs-new-offer-booking-fetch-more-similar-offers__button__text__container">
            <div>
              {isToggle
                ? t('booking:bookingModule.groupedSession.showLessButtonText')
                : t('booking:bookingModule.groupedSession.showMoreButtonText', {
                    totalSessions: sessionsCount,
                  })}
            </div>
          </div>
        }
      </ButtonBase>
    </>
  );
};

export default React.memo(ShowSessionButton);
