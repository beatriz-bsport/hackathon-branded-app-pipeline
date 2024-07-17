import React from 'react';

import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from '@material-ui/lab/Skeleton';

import StatusMessageWithIcon from '#src/components/css-only/StatusMessageWithIcon';
import {
  useOfferWaitingListStatus,
  useOfferWaitingListStatusText,
} from '#src/libs/offer/hooks';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import type { Offer, OfferStatus } from '#src/libs/offer/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import BookerModuleOfferSummary from '#src/libs/marketplace/components/@Offer/BookerModuleOfferSummary';
import Button, {
  ButtonVariant,
} from '#src/components/css-only/Fabrique/Button';
import OfferBookingWaitingListStatusIcon from '../OfferBookingWaitingListStatusIcon';

import './styles.css';

export type Props = {
  offer: Offer<Coach, Establishment, MetaActivity, number, number, OffersGroup>;
  offerStatusById: {
    [id: number]: OfferStatus;
  };
  positionInWaitingList: number;
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
  positionInWaitingList,
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
            positionInWaitingList={positionInWaitingList}
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
