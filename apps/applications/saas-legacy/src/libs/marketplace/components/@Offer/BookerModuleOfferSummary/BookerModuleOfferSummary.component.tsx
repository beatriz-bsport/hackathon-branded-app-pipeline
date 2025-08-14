import React from 'react';
import { useTranslation } from 'react-i18next';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status.js';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status.js';
import {
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_FULL,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import { ButtonBase } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import VideocamIcon from '@material-ui/icons/Videocam';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Card from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import { CardSize } from '#src/components/css-only/Card/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { OfferREST, OfferStatus, Offer_FULL } from '#src/libs/offer/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import {
  useOfferFormattedDate,
  useOfferHours,
} from '#src/libs/marketplace/hooks';
import Chip from '#src/components/css-only/Chip';
import ActivitySummary from '#src/libs/marketplace/components/@Activity/ActivitySummary';
import WaitlistPositionChip from '#src/libs/marketplace/components/@Offer/Waitlist/WaitlistPositionChip.component';
import Price from '#src/components/css-only/Price';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getCreditsDividedDisplay, getTaxPrice } from '#src/libs/theme/utils';
import Button, { ButtonColor } from '#src/components/css-only/Fabrique/Button';
import {
  formatOfferDateWithTime,
  formatOfferHours,
} from '#src/libs/marketplace/utils/offer';
import { BookerModuleOfferSummarySkeleton } from '.';

import './styles.css';

export type Props = {
  coach?: Coach;
  establishment: Establishment;
  loading?: boolean;
  metaActivity: MetaActivity;
  offer: Offer_FULL | OfferREST;
  /** The spot name e.g `F4` */
  spotName?: string;
  spotId?: string | number;
  price?: number | string;
  tax?: number | string;
  companyTheme: CompanyTheme;
  offerStatus?: OfferStatus;
  showEstablishmentAddress?: boolean;
  showCredits?: boolean;
  isBookingButtonHidden?: boolean;
  confirmLoading?: boolean;
  noStyledContainer?: boolean;
  isGuestBooking?: boolean;
  guestName?: string;
  onConfirm?: () => void;
  expirationDatetime?: string;
  goToCheckout?: () => void;
  fromSpotSelector?: boolean;
  positionInWaitingList?: number;
  doAllowDelete?: boolean;
  handleDelete?: (offerId: number) => void;
};

const BookerModuleOfferSummary: React.FC<Props> = ({
  coach,
  doAllowDelete,
  handleDelete,
  establishment,
  loading,
  metaActivity,
  offer,
  spotName,
  spotId,
  companyTheme,
  offerStatus,
  showCredits,
  price,
  tax,
  showEstablishmentAddress,
  isBookingButtonHidden,
  confirmLoading,
  onConfirm,
  noStyledContainer,
  expirationDatetime,
  goToCheckout,
  fromSpotSelector,
  isGuestBooking,
  guestName,
  positionInWaitingList,
}) => {
  const { t } = useTranslation([
    'datetime',
    'booking',
    'checkout',
    'marketplace',
  ]);

  const isBookable =
    offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;

  const isWaitlistOpen =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;

  const isWaitlistFull =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL;

  const isRegisteredToWaitlist =
    offerStatus?.waiting_list_status ===
      OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED && !offerStatus?.is_registered;

  const waitlistExists =
    isWaitlistOpen || isWaitlistFull || isRegisteredToWaitlist;

  const displayTax = companyTheme?.is_tax_excluded_in_marketplace === false;

  const formattedDate = useOfferFormattedDate(
    offer,
    establishment,
    metaActivity,
    companyTheme,
  );

  const offerHours = useOfferHours(
    offer,
    establishment,
    metaActivity,
    companyTheme,
  );

  const formattedOfferHours = formatOfferHours(offerHours);

  const date = formatOfferDateWithTime(formattedDate, formattedOfferHours);

  const displayedSpotName = spotName
    ? `${t(`booking:place`)} ${spotName}`
    : null;

  const displayWaitlistChip =
    (waitlistExists && offer.full) || isRegisteredToWaitlist;

  const shouldDisplayFooter =
    (!isWaitlistFull || isBookable) && !isBookingButtonHidden && !!onConfirm;

  const isButtonDisabled =
    (offerStatus && !isBookable && !isWaitlistOpen) ||
    confirmLoading ||
    loading;

  const formattedCredits =
    showCredits &&
    t(`booking:creditConsumed`, {
      credit_consumed: getCreditsDividedDisplay(offer?.credit_price),
      count: offer?.credit_price,
    });

  const taxes = getTaxPrice(price, tax);

  const onRemoveOffer = () => {
    if (offer && offer.id && handleDelete) {
      handleDelete(offer.id);
    }
  };

  if (loading) {
    return <BookerModuleOfferSummarySkeleton />;
  }

  return (
    <Card
      classes={{
        'bs-booker-module-offer-summary-card': true,
        'bs-booker-module-offer-summary-card--no-style': noStyledContainer,
      }}
      size={CardSize.AUTO}
    >
      <CardContent
        classes={{
          'bs-booker-module-offer-summary-content': true,
        }}
        padding={!noStyledContainer}
      >
        <Grid
          classes={{
            'bs-booker-module-offer-summary-grid': true,
          }}
        >
          {isGuestBooking && (
            <GridItem
              alignment={Alignment.CENTER}
              classes={{
                'bs-booker-module-offer-summary-item': true,
                'bs-booker-module-offer-summary-item__guest-container': true,
              }}
              direction={Direction.ROW}
              justification={Justification.FLEX_START}
              rowStart={1}
            >
              <PersonAdd className="bs-booker-module-offer-summary-item__guest-container__icon" />
              <span className="bs-booker-module-offer-summary-item__guest-container__name">
                {t('booking:offer.bookingFor')}
                <i>{` ${guestName}`}</i>
              </span>
            </GridItem>
          )}
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__activity-name': true,
            }}
            direction={Direction.ROW}
            justification={Justification.SPACE_BETWEEN}
            rowStart={2}
          >
            {offer?.name_override || metaActivity?.name}
            {doAllowDelete && (
              <ButtonBase
                className="bs-booker-module-offer-summary-delete-icon"
                onClick={onRemoveOffer}
              >
                <DeleteIcon />
              </ButtonBase>
            )}
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__offer-date': true,
            }}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={3}
          >
            {date}
          </GridItem>
          <GridItem
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__status-chips': true,
              'bs-booker-module-offer-summary-item__status-chips--hidden':
                !metaActivity?.is_broadcast && !waitlistExists,
            }}
            direction={Direction.COLUMN}
            justification={Justification.FLEX_START}
            rowStart={4}
          >
            <Chip
              classes={{
                'bs-booker-module-offer-summary-item__chip': true,
                'bs-booker-module-offer-summary-item__status-chips__broadcast':
                  true,
                'bs-booker-module-offer-summary-item__status-chips__broadcast--hidden':
                  !metaActivity?.is_broadcast,
              }}
              icon={<VideocamIcon fontSize="medium" />}
              label={t('marketplace:calendar.broadcast')}
            />
            {displayWaitlistChip && positionInWaitingList && (
              <WaitlistPositionChip
                classes={{
                  'bs-booker-module-offer-summary-item__chip': true,
                  'bs-booker-module-offer-summary-item__status-chips__waitlist':
                    true,
                }}
                isRegisteredInWaitlist={isRegisteredToWaitlist}
                isWaitlistFull={isWaitlistFull}
                positionInWaitingList={positionInWaitingList}
              />
            )}
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__activity-summary': true,
            }}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={5}
          >
            <ActivitySummary
              coach={coach}
              companyTheme={companyTheme}
              credits={formattedCredits}
              establishment={establishment}
              expirationDatetime={expirationDatetime}
              fromSpotSelector={fromSpotSelector}
              goToCheckout={goToCheckout}
              hideCoach={companyTheme?.hideCoach}
              showEstablishmentAddress={showEstablishmentAddress}
              spotId={spotId}
              spotName={displayedSpotName}
            />
          </GridItem>
        </Grid>
        <Grid
          classes={{
            'bs-booker-module-offer-summary-footer-grid': true,
            'bs-booker-module-offer-summary-footer-grid--hidden':
              !shouldDisplayFooter,
          }}
        >
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__price-tax-excluded': true,
              'bs-booker-module-offer-summary-item__price-tax-excluded--hidden':
                !price || !displayTax,
            }}
            direction={Direction.ROW}
            justification={Justification.SPACE_BETWEEN}
            rowStart={1}
          >
            <span className="bs-booker-module-offer-summary-item__price-tax-excluded__text">
              {t(`checkout:payment.taxExcluded`)}
            </span>
            <Price
              isExcludingTax
              amount={price}
              classes={{
                'bs-booker-module-offer-summary-item__tax-price': true,
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              tax={tax}
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__tax': true,
              'bs-booker-module-offer-summary-item__tax--hidden':
                !taxes || !displayTax,
            }}
            direction={Direction.ROW}
            justification={Justification.SPACE_BETWEEN}
            rowStart={2}
          >
            <span className="bs-booker-module-offer-summary-item__tax__text">
              {t(`checkout:payment.tax`)}
            </span>
            <Price
              amount={taxes}
              classes={{
                'bs-booker-module-offer-summary-item__tax-price': true,
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={false}
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__price': true,
              'bs-booker-module-offer-summary-item__price--hidden': !price,
            }}
            direction={Direction.ROW}
            justification={Justification.SPACE_BETWEEN}
            rowStart={3}
          >
            <span className="bs-booker-module-offer-summary-item__price__text">
              {t(`checkout:payment.globalTotal`)}
            </span>
            <Price
              amount={price}
              classes={{
                'bs-booker-module-offer-summary-item__price': true,
                'bs-booker-module-offer-summary-item__price--hidden': !price,
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={false}
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__button--hidden':
                isBookingButtonHidden,
            }}
            direction={Direction.ROW}
            justification={Justification.CENTER}
            rowStart={4}
          >
            <Button
              classes={{
                root: 'bs-booker-module-offer-summary-item__button',
              }}
              color={ButtonColor.PRIMARY}
              isDisabled={isButtonDisabled}
              onClick={onConfirm}
            >
              {!offer.full
                ? t(`booking:notification.form.submit`)
                : t(`booking:offer.mainButton.registerWaitingList`)}
            </Button>
          </GridItem>
        </Grid>
      </CardContent>
      <div className="bs-booker-module-offer-summary-item-divider"></div>
    </Card>
  );
};

export const BookerModuleOfferSummaryForStorybook = marketplaceCssHoc()(
  BookerModuleOfferSummary,
);
export default React.memo(BookerModuleOfferSummary);
