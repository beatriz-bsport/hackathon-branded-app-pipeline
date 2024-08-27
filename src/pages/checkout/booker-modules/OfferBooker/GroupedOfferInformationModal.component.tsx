import React from 'react';
import ModalToDrawerSwitcherComponent from '#src/components/Modal/ModalToDrawerSwitcher.component';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type GroupedOfferInformationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGoBack: () => void;
  maxWidth: Breakpoint;
  sessionsTotal: number;
  isFullBookingOnly: boolean;
};

const GroupedOfferInformationModal: React.FC<
  GroupedOfferInformationModalProps
> = ({
  isOpen,
  onClose,
  onGoBack,
  maxWidth,
  sessionsTotal,
  isFullBookingOnly,
}) => {
  const { t } = useTranslation(['booking', 'common']);

  return (
    <ModalToDrawerSwitcherComponent
      isOpen={isOpen}
      maxWidth={maxWidth}
      onClose={onClose}
    >
      <div className="bs-new-offer-booking-grouped-session__information__modal__container">
        <div className="bs-new-offer-booking-grouped-session__information__modal__header">
          <div className="bs-new-offer-booking-grouped-session__information__modal__header__title">
            {t('booking:bookingModule.groupedSession.warningModal.title')}
          </div>
        </div>
        <div className="bs-new-offer-booking-grouped-session__information__modal__body">
          <div className="bs-new-offer-booking-grouped-session__information__modal__body__content">
            {t(
              isFullBookingOnly
                ? 'booking:bookingModule.groupedSession.warningModal.fullBookingOnly.text'
                : 'booking:bookingModule.groupedSession.warningModal.partialBooking.text',
              {
                sessionsTotal: sessionsTotal,
              },
            )}
          </div>
        </div>
        <div className="bs-new-offer-booking-grouped-session__information__modal__footer">
          <ButtonBase
            className="bs-new-offer-booking-grouped-session__information__modal__footer__cancel__button"
            onClick={onGoBack}
          >
            {t('common:cancel')}
          </ButtonBase>
          <ButtonBase
            className="bs-new-offer-booking-grouped-session__information__modal__footer__confirm__button"
            onClick={onClose}
          >
            {t('common:continue')}
          </ButtonBase>
        </div>
      </div>
    </ModalToDrawerSwitcherComponent>
  );
};

export default React.memo(GroupedOfferInformationModal);
