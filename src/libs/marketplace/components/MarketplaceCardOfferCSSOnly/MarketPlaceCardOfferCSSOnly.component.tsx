// @ts-nocheck
import React from 'react';
import { pure } from 'recompose';
import './MarketplaceCardOfferCSSOnly.css';
import GroupIcon from '@material-ui/icons/Group';
import { Theme } from '@material-ui/core/styles/createTheme';
import classNames from 'classnames';
import { ArrowLeft } from '@material-ui/icons';
import MaleIcon from '../../../../components/icons/MaleIcon.component';
import FemaleIcon from '../../../../components/icons/FemaleIcon.component';
import MarketplaceBookButton from '../MarketplaceBookButtonCSSOnly';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly';
import { Offer_FULL } from '#libs/offer/types';
import MarketplaceBroadcast from '../MarketplaceBroadcastCSSOnly';
import { getOfferHours } from '../../utils';
import { Coach } from '#libs/associated-coach/types';
import { AVAILABLE_BOOKING_ELEMENTS_IDS } from '#libs/marketplace/constants';

type OwnProps = {
  offer: Offer_FULL;
  coach: Coach;
  theme: Theme;
  variant?: 'activityName' | 'coach' | 'time';
  isRegistered: boolean;
  showOfferFilling: boolean;
  showOfferGender: boolean;
  hideCoach: boolean;
  onClickBook: (offer: Offer_FULL) => void;
  onClickOffer: (id: number) => void;
  onClickBookOption: (offer: Offer_FULL) => void;
  getLevel: (id: number) => void;
  isBookingDisabled: boolean;
};

type Props = OwnProps;

const MarketPlaceCardOfferV2 = (props: Props) => {
  const isVariantTimeHighlighted = props.variant === 'time';
  const isVariantCoachHighlighted = props.variant === 'coach';

  const { offer, coach } = props;
  const metaActivity = offer.meta_activity;

  const handleBook = () => {
    props.onClickBook(offer);
  };

  const handleBookOption = () => {
    props.onClickBookOption(offer);
  };
  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.isBookingDisabled) return;

    if (AVAILABLE_BOOKING_ELEMENTS_IDS.includes(event?.target?.id)) {
      offer.is_full ? handleBookOption() : handleBook();
    } else {
      props.onClickOffer(offer.id);
    }
  };

  const isBottomInOneLine =
    (props.showOfferFilling || props.showOfferGender) &&
    window.innerWidth < 1850;

  return (
    <button
      type="button"
      className={classNames({
        'bs-card-offer': true,
        'bs-card-offer--disabled': props.isBookingDisabled,
      })}
      onClick={handleClick}
      disabled={props.isBookingDisabled}
    >
      {metaActivity.color && (
        <ArrowLeft
          className="arrow-down"
          style={{ borderTopColor: metaActivity.color }}
        />
      )}
      <div className="bs-card-offer__content">
        <div className="bs-card-offer__content__top">
          <div
            className={classNames('bs-card-offer__content__title', {
              'bs-card-offer__content__title--time-highlighted':
                isVariantTimeHighlighted,
              'bs-card-offer__content__title--coach-highlighted':
                isVariantCoachHighlighted,
            })}
          >
            {metaActivity.name}
          </div>
          <div
            className={classNames('bs-card-offer__content__time', {
              'bs-card-offer__content__time--time-highlighted':
                isVariantTimeHighlighted,
              'bs-card-offer__content__time--coach-highlighted':
                isVariantCoachHighlighted,
            })}
          >
            {getOfferHours(offer, offer.establishment, props.theme)}
          </div>
          <div className="bs-card-offer__content__status">
            <MarketplaceLevel
              customLevel={props.getLevel[offer.custom_level]}
              className="bs-card-offer__content__status__level"
            />
            {metaActivity && metaActivity.is_broadcast ? (
              <MarketplaceBroadcast cardVariant />
            ) : (
              ''
            )}
          </div>

          <div className="bs-card-offer__content__establishment">
            {offer.establishment.title}
          </div>
          {!props.hideCoach ? (
            <div
              className={classNames('bs-card-offer__content__coach', {
                'bs-card-offer__content__coach--time-highlighted':
                  isVariantTimeHighlighted,
                'bs-card-offer__content__coach--coach-highlighted':
                  isVariantCoachHighlighted,
              })}
            >
              <div
                className={classNames('bs-card-offer__content__coach__name', {
                  'bs-card-offer__content__coach__name--coach-highlighted':
                    isVariantCoachHighlighted,
                })}
              >
                {coach.name}
              </div>
              {coach && coach.photo && (
                <img
                  alt=""
                  src={coach.photo}
                  className="bs-card-offer__content__coach__avatar"
                />
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
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
            {props.showOfferGender ? (
              <div className="bs-card-offer__content__bottom__left__gender">
                <div className="bs-card-offer__content__bottom__left__gender__sex">
                  <MaleIcon />
                  <div>{offer.male ?? 0}</div>
                </div>
                <div className="bs-card-offer__content__bottom__left__gender__sex">
                  <FemaleIcon />
                  <div>{offer.female ?? 0}</div>
                </div>
                <div className="bs-card-offer__content__bottom__left__gender__other">
                  <div>+</div>
                  <div>{offer.other ?? 0}</div>
                </div>
              </div>
            ) : (
              ''
            )}
            {props.showOfferFilling ? (
              <div className="bs-card-offer__content__bottom__left__group">
                <GroupIcon className="bs-card-offer__icon" />
                <div className="bs-card-offer__content__bottom__left__group__number">
                  {props.showOfferFilling
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
              offer={offer}
              isRegistered={props.isRegistered}
            />
          </div>
        </div>
      </div>
    </button>
  );
};

export default pure(MarketPlaceCardOfferV2);
