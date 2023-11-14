import React from 'react';

import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from '@material-ui/lab/Skeleton';

import StatusMessageWithIcon from '#csscomponents/StatusMessageWithIcon';
import {
  useOfferWaitingListStatus,
  useOfferWaitingListStatusText,
} from '#libs/offer/hooks';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import OfferBookingWaitingListStatusIcon from '../OfferBookingWaitingListStatusIcon';

import type { Offer, OfferStatus } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { CompanyTheme } from '#libs/theme/types';
import { OffersGroup } from '#libs/group-offer/types';
import BookerModuleOfferSummary from '#libs/marketplace/components/@Offer/BookerModuleOfferSummary';
import Button, { ButtonVariant } from '#components/css-only/Fabrique/Button';

import './styles.css';

export type Props = {
  offer: Offer<Coach, Establishment, MetaActivity, number, number, OffersGroup>;
  offerStatusById: {
    [id: number]: OfferStatus;
  };
  isLoading: boolean;
  companyTheme: CompanyTheme;
  isNoPassCompatibleForBooking: boolean;
  isWaitingListRegisterLoading: boolean;
  offerSummaryPrice: string;
  /** The spot name e.g `F4` */
  bookingSpotId?: string;
  isPassTabInMarketplaceConfig: boolean;
  onRegisterToWaitList: () => void;
  onRedirectToCalendar: () => void;
  onRedirectToPass: () => void;
};

const OfferBookingWaitingList: React.FC<Props> = ({
  offer,
  offerStatusById,
  isLoading,
  companyTheme,
  isNoPassCompatibleForBooking,
  isWaitingListRegisterLoading,
  offerSummaryPrice,
  bookingSpotId,
  isPassTabInMarketplaceConfig,
  onRegisterToWaitList,
  onRedirectToCalendar,
  onRedirectToPass,
}) => {
  const { t } = useTranslation('booking');

  const { headerTitle, title, message } = useOfferWaitingListStatusText(
    offerStatusById && offerStatusById[offer?.id],
    isNoPassCompatibleForBooking,
  );

  const {
    isBookingLimitReached,
    isWaitlistOpen,
    isWaitlistAlreadyBooked,
    isWaitlistFull,
    isWaitingListLockedByPendingBookings,
  } = useOfferWaitingListStatus(offerStatusById && offerStatusById[offer?.id]);

  const isDisplayBuyPassButton =
    !isWaitlistOpen &&
    !isWaitlistFull &&
    !isWaitlistAlreadyBooked &&
    !isWaitingListLockedByPendingBookings &&
    !isBookingLimitReached;

  const isErrorIcon =
    !isWaitlistAlreadyBooked &&
    (isWaitlistFull ||
      isNoPassCompatibleForBooking ||
      isWaitingListLockedByPendingBookings ||
      isBookingLimitReached);

  const isBookingButtonHidden =
    isNoPassCompatibleForBooking ||
    isWaitingListLockedByPendingBookings ||
    isBookingLimitReached;

  const waitingListHeaderTitle = headerTitle || title;

  return (
    <div className="bs-offer-booking-waiting-list__content__container">
      <div className="bs-offer-booking-waiting-list__header__container">
        <Button onClick={onRedirectToCalendar} variant={ButtonVariant.ICON}>
          <ArrowBackIcon className="bs-offer-booking-waiting-list__header__arrow__icon" />
        </Button>
        {isLoading ? (
          <Skeleton height={32} variant="rect" width={350} />
        ) : (
          <div className="bs-offer-booking-waiting-list__header__title">
            {waitingListHeaderTitle}
          </div>
        )}
      </div>

      <div className="bs-offer-booking-waiting-list__status__summary__container">
        <div className="bs-offer-booking-waiting-list__status__container">
          <StatusMessageWithIcon
            actions={{
              cancel: {
                label: t('booking:newBookingModule.backToCalendar'),
                onClick: onRedirectToCalendar,
              },
              confirm: isDisplayBuyPassButton &&
                isPassTabInMarketplaceConfig && {
                  label: t('booking:newBookingModule.buyPass'),
                  onClick: onRedirectToPass,
                },
            }}
            icon={<OfferBookingWaitingListStatusIcon isError={isErrorIcon} />}
            isLoading={isLoading}
            message={message}
            title={title}
          />
        </div>

        <div className="bs-offer-booking-waiting-list__summary__container">
          <BookerModuleOfferSummary
            noStyledContainer
            coach={offer.coach}
            companyTheme={companyTheme}
            confirmLoading={isWaitingListRegisterLoading}
            establishment={offer.establishment}
            isBookingButtonHidden={isBookingButtonHidden}
            loading={isLoading}
            metaActivity={offer.meta_activity}
            offer={offer}
            offerStatus={offerStatusById[offer?.id]}
            onConfirm={onRegisterToWaitList}
            price={offerSummaryPrice}
            spotId={bookingSpotId}
            tax={offer.tax}
          />
        </div>
      </div>
    </div>
  );
};

export const OfferBookingWaitingListForStorybook = marketplaceCssHoc()(
  OfferBookingWaitingList,
);

export default React.memo(OfferBookingWaitingList);
