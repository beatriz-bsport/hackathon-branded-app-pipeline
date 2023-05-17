// @ts-nocheck
import React, { useMemo } from 'react';
import { pure } from 'recompose';
import './MarketplaceCardOfferCSSOnly.css';
import GroupIcon from '@material-ui/icons/Group';
import classNames from 'classnames';
import { ArrowLeft } from '@material-ui/icons';
import MaleIcon from '../../../../components/icons/MaleIcon.component';
import FemaleIcon from '../../../../components/icons/FemaleIcon.component';
import MarketplaceBookButton from '../MarketplaceBookButtonCSSOnly';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly';
import { Offer } from '#libs/offer/types';
import MarketplaceBroadcast from '../MarketplaceBroadcastCSSOnly';
import { useOfferHours } from '../../hooks';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { AVAILABLE_BOOKING_ELEMENTS_IDS } from '#libs/marketplace/constants';
import MarketplaceCoachInfos from '#libs/marketplace/components/MarketplaceCoachInfos';
import MarketplaceEstablishmentTitle from '#libs/marketplace/components/MarketplaceEstablishmentTitle';
import { Theme } from '#libs/theme/types';
import { MetaActivity } from '#libs/meta-activity/types';

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
  onClickBookOption: (offer: Offer) => void;
  getLevel: (id: number) => void;
  isBookingDisabled: boolean;
};

type Props = OwnProps;

const MarketPlaceCardOfferV2 = (props: Props) => {
  const isVariantTimeHighlighted = props.variant === 'time';
  const isVariantCoachHighlighted = props.variant === 'coach';

  const { offer, establishments, metaActivities, coaches, theme, genderCount } =
    props;

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

  const establishment = useMemo(
    () => establishments?.find((est) => est.id === offer.establishment),
    [establishments, offer.establishment],
  );

  const metaActivity = metaActivities
    ? metaActivities[offer.meta_activity]
    : undefined;

  const offerCoachId = offer.coach_override
    ? offer.coach_override
    : offer.coach;

  const coach = useMemo(
    () => coaches?.find((c) => c.id === offerCoachId),
    [coaches, offerCoachId],
  );

  const genderCountOffer = genderCount ? genderCount[offer.id] : undefined;

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

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
      {props.theme?.show_activity_color && metaActivity?.color && (
        <ArrowLeft
          className="arrow-down"
          style={{ borderTopColor: metaActivity?.color }}
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
            {metaActivity?.name}
          </div>
          <div
            className={classNames('bs-card-offer__content__time', {
              'bs-card-offer__content__time--time-highlighted':
                isVariantTimeHighlighted,
              'bs-card-offer__content__time--coach-highlighted':
                isVariantCoachHighlighted,
            })}
          >
            {offerHours}
          </div>
          <div className="bs-card-offer__content__status">
            <MarketplaceLevel
              hideLevel={!props.theme.show_level}
              customLevel={props.getLevel[offer.custom_level]}
              className="bs-card-offer__content__status__level"
            />
            {metaActivity && metaActivity.is_broadcast ? (
              <MarketplaceBroadcast cardVariant />
            ) : (
              ''
            )}
          </div>
          <MarketplaceCoachInfos
            theme={props.theme}
            hideCoach={props.hideCoach}
            coach={coach}
            offer={offer}
            reverse
            classes={{
              'bs-card-offer__content__coach': 'bs-card-offer__content__coach',
              'bs-card-offer__content__coach--time-highlighted':
                isVariantTimeHighlighted,
              'bs-card-offer__content__coach--coach-highlighted':
                isVariantCoachHighlighted,
            }}
          />
          <MarketplaceEstablishmentTitle
            establishment={establishment}
            theme={props.theme}
            classes={{
              'bs-card-offer__content__establishment':
                'bs-card-offer__content__establishment',
            }}
          />
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
