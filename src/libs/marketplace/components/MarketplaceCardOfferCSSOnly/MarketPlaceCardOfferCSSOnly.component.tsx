// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import { pure } from 'recompose';
import './MarketplaceCardOfferCSSOnly.css';
import GroupIcon from '@material-ui/icons/Group';
import classNames from 'classnames';
import { ArrowLeft } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import MaleIcon from '../../../../components/icons/MaleIcon.component';
import FemaleIcon from '../../../../components/icons/FemaleIcon.component';
import MarketplaceBookButton from '../MarketplaceBookButton';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly';
import { Offer } from '#libs/offer/types';
import MarketplaceBroadcast from '../MarketplaceBroadcastCSSOnly';
import { useOfferHours } from '../../hooks';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import {
  AVAILABLE_BOOKING_ELEMENTS_IDS,
  MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
} from '#libs/marketplace/constants';
import MarketplaceCoachInfos from '#libs/marketplace/components/MarketplaceCoachInfos';
import MarketplaceEstablishmentTitle from '#libs/marketplace/components/MarketplaceEstablishmentTitle';
import { Theme } from '#libs/theme/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup } from '#libs/group-offer/types';
import FreeOfferChip from '#csscomponents/FreeOfferChip';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { Level } from '#libs/level/types';
import MarketplaceOfferStatusChip from '../MarketplaceOfferStatusChip';
import PopOver from '#components/Popover/Popover.component';

type OwnProps = {
  offer: Offer;
  genderCount: Object;
  metaActivities: { [key: number]: MetaActivity };
  establishments: Array<Establishment>;
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

export type Props = OwnProps;

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
        event.target.classList.contains(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER)
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

      if (theme?.hide_book_button) {
        handleClickOnHiddenBookButton(event);
      } else if (AVAILABLE_BOOKING_ELEMENTS_IDS.includes(event?.target?.id)) {
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

  const additionalCoaches = useMemo(
    () =>
      (offer?.additional_coaches || []).map((coachId) =>
        coaches?.find((c) => c.id === coachId),
      ),
    [coaches, offer?.additional_coaches],
  );

  const genderCountOffer = genderCount ? genderCount[offer?.id] : undefined;

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

  return (
    <button
      className={classNames({
        'bs-card-offer': true,
        '--disabled': isCardDisabled,
      })}
      disabled={isBookingDisabled}
      onClick={handleClick}
      type="button"
    >
      {theme?.show_activity_color && metaActivity?.color && (
        <ArrowLeft
          className="arrow-down"
          style={{ borderTopColor: metaActivity?.color }}
        />
      )}
      <div className="bs-card-offer__content">
        <div className="bs-card-offer__content__top">
          <div className="bs-card-offer__content__top__grid">
            {isSessionNameClickable ? (
              <button
                className={classNames(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                  'bs-card-offer__content__title':
                    'bs-card-offer__content__title',
                  'bs-card-offer__button__title':
                    'bs-card-offer__button__title',
                })}
                disabled={isBookingDisabled}
                onClick={handleClick}
                type="button"
              >
                {metaActivity?.name}
              </button>
            ) : (
              <div
                className={classNames('bs-card-offer__content__title', {
                  'bs-card-offer__content__title--time-highlighted':
                    isVariantTimeHighlighted,
                  'bs-card-offer__content__title--coach-highlighted':
                    isVariantCoachHighlighted,
                })}
              >
                <PopOver
                  title={
                    isPopoverOnSessionName &&
                    t('marketplace.bookButton.popOverTitle.isPast')
                  }
                >
                  {metaActivity?.name}
                </PopOver>
              </div>
            )}
            {isSessionTimeClickable ? (
              <button
                className={classNames(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                  'bs-card-offer__content__title':
                    'bs-card-offer__content__title',
                  'bs-card-offer__content__time--time-highlighted':
                    'bs-card-offer__content__time--time-highlighted',
                  'bs-card-offer__button__title':
                    'bs-card-offer__button__title',
                })}
                disabled={isBookingDisabled}
                onClick={handleClick}
                type="button"
              >
                {offerHours}
              </button>
            ) : (
              <div
                className={classNames('bs-card-offer__content__time', {
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
                  {offerHours}
                </PopOver>
              </div>
            )}
            {!isOfferPassed && (
              <div className="bs-card-offer__content__status-chip">
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
            <FreeOfferChip
              companyTheme={theme}
              credits={offer?.credit_price}
              creditsOverride={offer?.credit_price_override}
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
              className={classNames('bs-card-offer__content__coach', {
                'bs-card-offer__content__coach--coach-highlighted':
                  'bs-card-offer__content__coach--coach-highlighted',
                'bs-card-offer__button__title': 'bs-card-offer__button__title',
              })}
              disabled={isBookingDisabled}
              onClick={handleClick}
              type="button"
            >
              <MarketplaceCoachInfos
                reverse
                classes={{
                  [MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER]: [
                    MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
                  ],
                  'bs-card-offer__content__coach':
                    'bs-card-offer__content__coach',
                  'bs-card-offer__content__coach--coach-highlighted':
                    isVariantCoachHighlighted,
                }}
                coach={coach}
                hideCoach={hideCoach}
                offer={offer}
                theme={theme}
              />
            </button>
          ) : (
            <div
              className={classNames('bs-card-offer__content__coach', {
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
                    'bs-card-offer__content__coach--coach-highlighted':
                      isVariantCoachHighlighted,
                  }}
                  coach={coach}
                  hideCoach={hideCoach}
                  offer={offer}
                  theme={theme}
                />
              </PopOver>
            </div>
          )}
          {additionalCoaches?.length > 0 &&
            additionalCoaches?.map((additionalCoach) => (
              <MarketplaceCoachInfos
                reverse
                classes={{
                  'bs-card-offer__content__coach':
                    'bs-card-offer__content__coach',
                  'bs-card-offer__content__coach--coach-highlighted':
                    isVariantCoachHighlighted,
                }}
                coach={additionalCoach}
                hideCoach={hideCoach}
                offer={offer}
                theme={theme}
              />
            ))}
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
            className={classNames('bs-card-offer__bottom__content', {
              'bs-card-offer__bottom__content--full': isBottomInOneLine,
            })}
          >
            <div
              className={classNames('bs-card-offer__content__bottom__left', {
                'bs-card-offer__content__bottom__left--full': isBottomInOneLine,
              })}
            >
              {showOfferGender ? (
                <div className="bs-card-offer__content__bottom__left__gender">
                  <div className="bs-card-offer__content__bottom__left__gender__sex">
                    <MaleIcon />
                    <div>{genderCountOffer?.nb_booked_male ?? 0}</div>
                  </div>
                  <div className="bs-card-offer__content__bottom__left__gender__sex">
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
                      ? `  ${offer.tot_slots}/${offer.effectif}`
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
