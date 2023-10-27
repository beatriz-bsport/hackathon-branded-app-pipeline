import React from 'react';
import { useTranslation } from 'react-i18next';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { HourglassFull } from '@material-ui/icons';
import VideocamIcon from '@material-ui/icons/Videocam';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#components/css-only/Card';
import CardContent from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import { CardSize } from '#components/css-only/Card/types';
import type { Coach } from '#libs/associated-coach/types';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { OfferStatus, Offer_FULL } from '#libs/offer/types';
import type { CompanyTheme } from '#libs/theme/types';
import { useOfferFormattedDate, useOfferHours } from '#libs/marketplace/hooks';
import Chip from '#components/css-only/Chip';
import ActivitySummary from '#marketplacecomponents/@Activity/ActivitySummary';
import Price from '#components/css-only/Price';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { getTaxPrice } from '#libs/theme/utils';
import Button, { ButtonColor } from '#components/css-only/Fabrique/Button';
import { BookerModuleOfferSummarySkeleton } from '.';

import {
  formatOfferDateWithTime,
  formatOfferHours,
} from '#libs/marketplace/utils/offer';

import './styles.css';

export type Props = {
  coach?: Coach;
  establishment: Establishment;
  loading?: boolean;
  metaActivity: MetaActivity;
  offer: Offer_FULL;
  /** The spot name e.g `F4` */
  spotId?: string;
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
};

const BookerModuleOfferSummary: React.FC<Props> = ({
  coach,
  establishment,
  loading,
  metaActivity,
  offer,
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

  const waitlistExists = isWaitlistOpen || isWaitlistFull;

  const displayTax = companyTheme?.is_tax_excluded_in_marketplace === false;

  const formattedDate = useOfferFormattedDate(offer, companyTheme);

  const offerHours = useOfferHours(
    offer,
    offer?.establishment,
    offer?.meta_activity,
    companyTheme,
  );

  const formattedOfferHours = formatOfferHours(offerHours);

  const date = formatOfferDateWithTime(formattedDate, formattedOfferHours);

  const spotName = spotId ? `${t(`booking:place`)} ${spotId}` : null;

  const shouldDisplayFooter =
    (!isWaitlistFull || isBookable) && !isBookingButtonHidden && !!onConfirm;

  const isButtonDisabled =
    (offerStatus && !isBookable && !isWaitlistOpen) ||
    confirmLoading ||
    loading;

  const formattedCredits =
    showCredits &&
    t(`booking:creditConsumed`, {
      credit_consumed: offer?.credit_price,
    });

  const taxes = getTaxPrice(price, tax);

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
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            {metaActivity?.name}
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
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-offer-summary-item': true,
              'bs-booker-module-offer-summary-item__status-chips': true,
              'bs-booker-module-offer-summary-item__status-chips--hidden':
                !metaActivity?.is_broadcast && !waitlistExists,
            }}
            direction={Direction.ROW}
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
            <Chip
              classes={{
                'bs-booker-module-offer-summary-item__chip': true,
                ...(isWaitlistFull
                  ? {
                      'bs-booker-module-offer-summary-item__status-chips__waitlist--full':
                        true,
                    }
                  : {
                      'bs-booker-module-offer-summary-item__status-chips__waitlist':
                        true,
                    }),

                'bs-booker-module-offer-summary-item__status-chips__waitlist--hidden':
                  !waitlistExists && !offer.full,
              }}
              icon={<HourglassFull fontSize="medium" />}
              label={
                isWaitlistFull
                  ? t(
                      `booking:offer.offerStatus.waiting_list_status.${OFFER_WAITING_LIST_STATUS_FULL}`,
                    )
                  : t(
                      `booking:offer.offerStatus.waiting_list_status.${OFFER_WAITING_LIST_STATUS_OPEN}`,
                    )
              }
            />
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
              spotName={spotName}
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
    </Card>
  );
};

export const BookerModuleOfferSummaryForStorybook = marketplaceCssHoc()(
  BookerModuleOfferSummary,
);
export default React.memo(BookerModuleOfferSummary);
