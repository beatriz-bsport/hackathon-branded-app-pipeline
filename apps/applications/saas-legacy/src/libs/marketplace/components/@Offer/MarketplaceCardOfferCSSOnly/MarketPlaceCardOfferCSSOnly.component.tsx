import React, { useCallback, useMemo } from 'react';
import { pure } from 'recompose';
import GroupIcon from '@material-ui/icons/Group';
import clsx from 'clsx';
import { ArrowLeft } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import MarketplaceBookButton from '#src/libs/marketplace/components/@Booking/MarketplaceBookButton';
import { Offer } from '#src/libs/offer/types';
import MarketplaceBroadcast from '#src/libs/marketplace/components/@Broadcast/MarketplaceBroadcastCSSOnly';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import {
  AVAILABLE_BOOKING_ELEMENTS_IDS,
  MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
  OFFER_HOURS_SEPARATOR,
} from '#src/libs/marketplace/constants';
import MarketplaceCoachInfos from '#src/libs/marketplace/components/@Coach/MarketplaceCoachInfos';
import MarketplaceEstablishmentTitle from '#src/libs/marketplace/components/@Establishment/MarketplaceEstablishmentTitle';
import { Theme } from '#src/libs/theme/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { Level } from '#src/libs/level/types';
import PopOver from '#src/components/Popover/Popover.component';
import { generateUniqueOfferIdentifier } from '#src/libs/marketplace/components/@Offer/utils';
import { shouldApplyEllipsis } from '#src/libs/marketplace/utils';
import MarketplaceOfferStatusChip from '../MarketplaceOfferStatusChip';
import { useOfferHours } from '../../../hooks';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly';
import FemaleIcon from '../../../../../components/icons/FemaleIcon.component';
import MaleIcon from '../../../../../components/icons/MaleIcon.component';
import './MarketplaceCardOfferCSSOnly.css';
import OfferPriceTag from '#src/components/css-only/OfferPriceTag';

type OwnProps = {
  offer: Offer;
  genderCount: Object;
  metaActivities: { [key: number]: MetaActivity };
  establishments: ReadonlyArray<Establishment>;
  coaches: Array<Coach>;
  theme: Theme;
  variant?: 'activityName' | 'coach' | 'time';
  isRegistered: boolean;
  showOfferFilling: boolean;
  showOfferGender: boolean;
  hideCoach: boolean;
  onClickBook: (offer: Offer) => void;
  onClickOffer: (id: number) => void;
  getLevel: { [key: number]: Level };
  isBookingDisabled: boolean;
  group?: OffersGroup;
  isOfferPassed: boolean;
};

type OfferHoursProps = {
  offerHours: {
    startTime: string;
    endTimeOrDuration: string;
  };
};

export type Props = OwnProps;

const OfferHours: React.FC<OfferHoursProps> = ({ offerHours }) => (
  <div className="bs-card-offer__content__time__offer-hours">
    <div
      className="bs-card-offer__content__time__offer-hours__start-time"
      id="bs-card-offer-start-time"
    >
      {offerHours.startTime}
    </div>
    {offerHours.endTimeOrDuration && (
      <div
        className="bs-card-offer__content__time__offer-hours__time-separator"
        id="bs-card-offer-time-separator"
      >
        {OFFER_HOURS_SEPARATOR}
      </div>
    )}
    {offerHours.endTimeOrDuration && (
      <div
        className="bs-card-offer__content__time__offer-hours__end-time-duration"
        id="bs-card-offer-end-time-duration"
      >
        {offerHours.endTimeOrDuration}
      </div>
    )}
  </div>
);

const MarketPlaceCardOfferCSSOnly: React.FC<Props> = ({
  coaches,
  establishments,
  genderCount,
  getLevel,
  group,
  hideCoach,
  isBookingDisabled,
  isRegistered,
  metaActivities,
  offer,
  onClickBook,
  // onClickBookOption,
  onClickOffer,
  showOfferFilling,
  showOfferGender,
  theme,
  variant,
  isOfferPassed,
}) => {
  const isVariantTimeHighlighted = variant === 'time';
  const isVariantCoachHighlighted = variant === 'coach';

  const { t } = useTranslation('translation');

  const handleBook = useCallback(() => {
    onClickBook(offer);
  }, [onClickBook, offer]);

  // const handleBookOption = useCallback(() => {
  //   onClickBookOption(offer);
  // }, [onClickBookOption, offer]);

  const handleClickOnHiddenBookButton = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (
        event.currentTarget.classList.contains(
          MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
        )
      ) {
        event.stopPropagation();
        onClickOffer(offer.id);
      } else {
        handleBook();
        // TODO : fix handleBookOption, we have two handlers that were basically doing the same thing.
        // BUT handleBookOption was expecting an id and company id to work. Since forevever, we passed an offer, but
        // handleBookOption was never called: we were doing : offer.is_full ? handleBookOption() : handleBook();
        // where offer.is_full doesn't exist anymore (now offer.full) and therefore was always calling handleBook
        // original code : offer.full ? handleBookOption() : handleBook();
      }
    },
    [onClickOffer, handleBook, offer.id],
  );

  const handleClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isBookingDisabled) return;
      event.stopPropagation();
      const savedEvent = event;
      if (theme?.hide_book_button) {
        handleClickOnHiddenBookButton(savedEvent);
      } else if (
        AVAILABLE_BOOKING_ELEMENTS_IDS.includes(savedEvent?.target?.id)
      ) {
        handleBook();
      } else {
        onClickOffer(offer.id);
      }
    },
    [
      isBookingDisabled,
      theme?.hide_book_button,
      offer.id,
      handleBook,
      onClickOffer,
      handleClickOnHiddenBookButton,
    ],
  );

  const isBottomInOneLine =
    theme?.hide_book_button ||
    ((showOfferFilling || showOfferGender) && window.innerWidth < 1850);

  const hideBottomSection =
    theme?.hide_book_button && !showOfferFilling && !showOfferGender;

  const isSessionNameClickable =
    theme?.hide_book_button &&
    !isBookingDisabled &&
    !(isVariantTimeHighlighted || isVariantCoachHighlighted);

  const isPopoverOnSessionName =
    theme?.hide_book_button &&
    isOfferPassed &&
    !(isVariantTimeHighlighted || isVariantCoachHighlighted);

  const isSessionTimeClickable =
    theme?.hide_book_button && !isBookingDisabled && isVariantTimeHighlighted;

  const isPopoverOnSessionTime =
    theme?.hide_book_button && isOfferPassed && isVariantTimeHighlighted;

  const isSessionCoachClickable =
    theme?.hide_book_button && !isBookingDisabled && isVariantCoachHighlighted;

  const isPopoverOnSessionCoach =
    theme?.hide_book_button && isOfferPassed && isVariantCoachHighlighted;

  const isCardDisabled =
    (theme?.hide_book_button && isOfferPassed) ||
    (!theme.hide_book_button && isBookingDisabled);

  const establishment = useMemo(
    () => establishments?.find((est) => est.id === offer?.establishment),
    [establishments, offer?.establishment],
  );

  const metaActivity = metaActivities
    ? metaActivities[offer?.meta_activity]
    : undefined;

  const offerCoachId = offer?.coach_override
    ? offer?.coach_override
    : offer?.coach;

  const coach = useMemo(
    () => coaches?.find((c) => c.id === offerCoachId),
    [coaches, offerCoachId],
  );

  // @ts-expect-error
  const genderCountOffer = genderCount ? genderCount[offer?.id] : undefined;

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

  const cardOfferId = React.useMemo(() => {
    return generateUniqueOfferIdentifier(offer, 'bs-offer-card');
  }, [offer]);

  const shouldApplyEllipsisOnOfferName = shouldApplyEllipsis(
    offer?.name_override || metaActivity?.name,
  );

  const popoverTitle = (() => {
    if (isPopoverOnSessionName) {
      return t('marketplace.bookButton.popOverTitle.isPast');
    }
    if (shouldApplyEllipsisOnOfferName) {
      return offer?.name_override || metaActivity?.name;
    }
    return null;
  })();

  return (
    <button
      className={clsx({
        'bs-card-offer': true,
        '--disabled': isCardDisabled,
      })}
      disabled={isBookingDisabled}
      id={cardOfferId}
      // @ts-expect-error
      onClick={handleClick}
      type="button"
    >
      {theme?.show_activity_color && metaActivity?.color && (
        <ArrowLeft
          className="bs-card-offer__activity-indicator"
          htmlColor={metaActivity?.color}
        />
      )}
      <div className="bs-card-offer__content">
        <div className="bs-card-offer__content__top">
          <div className="bs-card-offer__content__top__grid">
            {isSessionNameClickable ? (
              <button
                className={clsx(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                  'bs-card-offer__content__title':
                    'bs-card-offer__content__title',
                  'bs-card-offer__button__title':
                    'bs-card-offer__button__title',
                })}
                disabled={isBookingDisabled}
                // @ts-expect-error
                onClick={handleClick}
                type="button"
              >
                <PopOver
                  customClasses={{
                    hoveredText: clsx({
                      'bs-card-offer__content__title--ellipsis':
                        shouldApplyEllipsisOnOfferName,
                    }),
                  }}
                  hide={!shouldApplyEllipsisOnOfferName}
                  title={offer?.name_override || metaActivity?.name}
                >
                  {offer?.name_override || metaActivity?.name}
                </PopOver>
              </button>
            ) : (
              <div
                className={clsx('bs-card-offer__content__title', {
                  'bs-card-offer__content__title--time-highlighted':
                    isVariantTimeHighlighted,
                  'bs-card-offer__content__title--coach-highlighted':
                    isVariantCoachHighlighted,
                })}
              >
                <PopOver
                  customClasses={{
                    hoveredText: clsx({
                      'bs-card-offer__content__title--ellipsis':
                        shouldApplyEllipsisOnOfferName,
                    }),
                  }}
                  hide={
                    !isPopoverOnSessionName && !shouldApplyEllipsisOnOfferName
                  }
                  title={popoverTitle}
                >
                  {offer?.name_override || metaActivity?.name}
                </PopOver>
              </div>
            )}
            {isSessionTimeClickable ? (
              <button
                className={clsx(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                  'bs-card-offer__content__title':
                    'bs-card-offer__content__title',
                  'bs-card-offer__content__time--time-highlighted':
                    'bs-card-offer__content__time--time-highlighted',
                  'bs-card-offer__button__title':
                    'bs-card-offer__button__title',
                })}
                disabled={isBookingDisabled}
                // @ts-expect-error
                onClick={handleClick}
                type="button"
              >
                <OfferHours offerHours={offerHours} />
              </button>
            ) : (
              <div
                className={clsx('bs-card-offer__content__time', {
                  'bs-card-offer__content__time--time-highlighted':
                    isVariantTimeHighlighted,
                  'bs-card-offer__content__time--coach-highlighted':
                    isVariantCoachHighlighted,
                })}
              >
                <PopOver
                  title={
                    isPopoverOnSessionTime &&
                    t('marketplace.bookButton.popOverTitle.isPast')
                  }
                >
                  <OfferHours offerHours={offerHours} />
                </PopOver>
              </div>
            )}
            {!isOfferPassed && (
              <div className="bs-card-offer__content__status-chip">
                {/* @ts-expect-error */}
                <MarketplaceOfferStatusChip
                  companyTheme={theme}
                  isRegistered={isRegistered}
                  metaActivity={metaActivity}
                  offer={offer}
                />
              </div>
            )}
          </div>
          <div className="bs-card-offer__content__status">
            <OfferPriceTag
              credits={offer?.credit_price}
              isCreditDisplayEnabled={theme?.display_credit_price_for_offer}
              isFreeLabelEnabled={theme?.show_free_session_label}
            />
            <MarketplaceLevel
              className="bs-card-offer__content__status__level"
              customLevel={getLevel?.[offer?.custom_level]}
              hideLevel={!theme.show_level}
            />
            {metaActivity && metaActivity.is_broadcast ? (
              <MarketplaceBroadcast cardVariant />
            ) : (
              ''
            )}
          </div>
          {isSessionCoachClickable ? (
            <button
              className={clsx('bs-card-offer__content__coach', {
                'bs-card-offer__content__coach--coach-highlighted':
                  'bs-card-offer__content__coach--coach-highlighted',
                'bs-card-offer__button__title': 'bs-card-offer__button__title',
              })}
              disabled={isBookingDisabled}
              // @ts-expect-error
              onClick={handleClick}
              type="button"
            >
              <MarketplaceCoachInfos
                reverse
                classes={{
                  // @ts-expect-error
                  [MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER]: [
                    MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
                  ],
                  'bs-card-offer__content__coach':
                    'bs-card-offer__content__coach',
                  // @ts-expect-error
                  'bs-card-offer__content__coach--coach-highlighted':
                    isVariantCoachHighlighted,
                }}
                coach={coach}
                hideCoach={hideCoach}
                // @ts-expect-error
                offer={offer}
                theme={theme}
              />
            </button>
          ) : (
            <div
              className={clsx('bs-card-offer__content__coach', {
                'bs-card-offer__content__coach--coach-highlighted':
                  isVariantCoachHighlighted,
              })}
            >
              <PopOver
                title={
                  isPopoverOnSessionCoach &&
                  t('marketplace.bookButton.popOverTitle.isPast')
                }
              >
                <MarketplaceCoachInfos
                  reverse
                  classes={{
                    'bs-card-offer__content__coach':
                      'bs-card-offer__content__coach',
                    // @ts-expect-error
                    'bs-card-offer__content__coach--coach-highlighted':
                      isVariantCoachHighlighted,
                  }}
                  coach={coach}
                  hideCoach={hideCoach}
                  // @ts-expect-error
                  offer={offer}
                  theme={theme}
                />
              </PopOver>
            </div>
          )}
          <MarketplaceEstablishmentTitle
            classes={{
              'bs-card-offer__content__establishment':
                'bs-card-offer__content__establishment',
            }}
            establishment={establishment}
            theme={theme}
          />
        </div>
      </div>
      {!hideBottomSection && (
        <div className="bs-card-offer__bottom">
          <div
            className={clsx('bs-card-offer__bottom__content', {
              'bs-card-offer__bottom__content--full': isBottomInOneLine,
            })}
          >
            <div
              className={clsx('bs-card-offer__content__bottom__left', {
                'bs-card-offer__content__bottom__left--full': isBottomInOneLine,
              })}
            >
              {showOfferGender ? (
                <div className="bs-card-offer__content__bottom__left__gender">
                  <div className="bs-card-offer__content__bottom__left__gender__sex">
                    {/* @ts-expect-error */}
                    <MaleIcon />
                    <div>{genderCountOffer?.nb_booked_male ?? 0}</div>
                  </div>
                  <div className="bs-card-offer__content__bottom__left__gender__sex">
                    {/* @ts-expect-error */}
                    <FemaleIcon />
                    <div>{genderCountOffer?.nb_booked_female ?? 0}</div>
                  </div>
                  <div className="bs-card-offer__content__bottom__left__gender__other">
                    <div>+</div>
                    <div>{genderCountOffer?.nb_booked_other ?? 0}</div>
                  </div>
                </div>
              ) : (
                ''
              )}
              {showOfferFilling ? (
                <div className="bs-card-offer__content__bottom__left__group">
                  <GroupIcon className="bs-card-offer__icon" />
                  <div className="bs-card-offer__content__bottom__left__group__number">
                    {showOfferFilling
                      ? // @ts-expect-error
                        `  ${offer.tot_slots}/${offer.effectif}`
                      : ''}{' '}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="bs-card-offer__content__bottom__buttonContainer">
              <MarketplaceBookButton
                group={group}
                isHidden={theme?.hide_book_button}
                isRegistered={isRegistered}
                metaActivity={metaActivity}
                offer={offer}
              />
            </div>
          </div>
        </div>
      )}
    </button>
  );
};

export const MarketPlaceCardOfferCSSOnlyForStorybook = marketplaceCssHoc()(
  MarketPlaceCardOfferCSSOnly,
);

export default pure(MarketPlaceCardOfferCSSOnly);
