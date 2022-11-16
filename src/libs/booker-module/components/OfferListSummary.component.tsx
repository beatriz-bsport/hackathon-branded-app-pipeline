import React, { SyntheticEvent } from 'react';
import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  FormControl,
  Select,
  MenuItem,
  Theme,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment-timezone';
import { getOfferFeature } from '@bsport/common/lib/master-data/available-payment';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { MaterialStyleType } from '../../../utils/types';
import { Offer_FULL, OfferStatus } from '../../offer/types';
import OfferBookableItem from './OfferBookableItem.component';
import DividerLinearGradient from '../../../components/DividerLinearGradient.component';
import { OfferData, AdditionalGuest } from '../types';
import { Member, MemberMinimal } from '../../member/types';
import AdditionalGuestForm from '#libs/booker-module/components/AdditionalGuestForm.component';
import AdditionalGuestList from '#libs/booker-module/components/AdditionalGuestList.component';
import { getLevelTrad } from '#libs/level/utils';
import { SpotType } from '#libs/spot-scheduling/types';
import { getSpotTypeMinimal } from '#libs/spot-scheduling/utils';

type OwnProps = {
  offer: Offer_FULL;
  offerStatus?: OfferStatus;
  hideCoach: boolean;
  additionalGuestList: Array<AdditionalGuest>;
  onClickAddMoreOffer: () => void;
  onClickRemoveOffer: (offer: Offer_FULL) => void;
  selectedOffers: OfferData[];
  relatedMemberList: MemberMinimal[];
  member?: Member;
  offerStatusById: { [key: string]: OfferStatus };
  onSelectMember: (id: number) => void;
  onAddAdditionalGuest: (guest: AdditionalGuest) => void;
  isRegisteringForWaitingList: boolean;
  acceptDoubleBooking?: boolean;
  hideGenericOffer?: boolean;
  onRemoveGuest: (idx: number) => void;
  numberBookingGuestLeft?: number;
  showBookingButton: boolean;
  packAllowsBookingGuest: boolean;
  frequencyBookingGuest: string;
  maxGuestNumberFromAllPacks: number;

  spotTypes: SpotType[];
  spotsForOffers: { [offerId: number]: number };
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const BOOKING_FOR_GUEST_EVERY_WEEK = 'every_week';
const BOOKING_FOR_GUEST_EVERY_MONTH = 'every_month';
const BOOKING_FOR_GUEST_EVERY_YEAR = 'every_year';

class OfferListSummary extends React.PureComponent<Props> {
  getFrequencyTraduction() {
    switch (this.props.frequencyBookingGuest) {
      case BOOKING_FOR_GUEST_EVERY_WEEK:
        return this.props.t('booking:offer.bookingForAGuest.frequencyWeekly');
      case BOOKING_FOR_GUEST_EVERY_MONTH:
        return this.props.t('booking:offer.bookingForAGuest.frequencyMonthly');
      case BOOKING_FOR_GUEST_EVERY_YEAR:
        return this.props.t('booking:offer.bookingForAGuest.frequencyYearly');
      default:
        return this.props.t('booking:offer.bookingForAGuest.frequencyGeneric');
    }
  }

  render() {
    const { classes, t, offer, offerStatus } = this.props;

    const offerLevelTranslation = getLevelTrad(
      Number.parseInt(this.props.offer.level),
      ' ',
      this.props.t,
    );

    if (
      !offer ||
      !offer.establishment ||
      !(offer.meta_activity && offer.meta_activity.id) ||
      !offerStatus
    ) {
      return (
        <div className={classes.container}>
          <div className={classes.topRow}>
            <Skeleton animation="wave" width="40%" variant="text" height={30} />
          </div>
          <Box mt={2} />
          <Skeleton animation="wave" width="100%" variant="rect" height={200} />
        </div>
      );
    }

    const { isBookable, isWaitingList, isRegistered, noInteraction } =
      getOfferFeature(
        offer,
        this.props.offerStatusById,
        this.props.acceptDoubleBooking,
      );

    const hasCustomLevel =
      this.props.offer.level !== this.props.offer?.custom_level;
    const hasLevel =
      (Number.parseInt(offer.level) !== 1 &&
        Number.parseInt(offer.level) !== 5) ||
      hasCustomLevel;
    const numberOfGuestsAvailable =
      this.props.numberBookingGuestLeft -
      this.props.additionalGuestList?.length;

    const spotId = this.props.spotsForOffers[offer.id];

    const roomBlueprint = this.props?.roomBlueprintsById[offer.room_blueprint];

    const spotInformation = getSpotTypeMinimal(
      roomBlueprint,
      spotId,
      this.props.spotTypes,
    );

    return (
      <div className={classes.container}>
        <div className={classes.topRow}>
          <Typography variant="h5" color="textPrimary">
            {!!this.props.relatedMemberList.length &&
            !this.props.offer?.group?.full_booking_only
              ? t('booking:offer.bookingsTitleFor', {
                  count: this.props.selectedOffers.length + 1,
                })
              : t('booking:offer.bookingsTitle', {
                  count: this.props.selectedOffers.length + 1,
                })}
          </Typography>
          {!!this.props.relatedMemberList.length &&
            !this.props.offer?.group?.full_booking_only && (
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  labelId="member-select-filled-label"
                  id="member-select-filled"
                  value={this.props.member ? this.props.member.id : '-1'}
                  onChange={(ev: SyntheticEvent) => {
                    this.props.onSelectMember(parseInt(ev.target.value, 10));
                  }}
                >
                  <MenuItem value="-1">
                    <em>{t('booking:offer.bookingForMe')}</em>
                  </MenuItem>
                  {this.props.relatedMemberList.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
        </div>
        <DividerLinearGradient />

        <div className={classes.offersContainer}>
          {!!offer && !this.props.hideGenericOffer && (
            <OfferBookableItem
              disabled={offer.group ? false : noInteraction}
              offer={offer}
              hideCoach={this.props.hideCoach}
              offerStatus={offerStatus}
              isBookable={isBookable}
              isWaitingList={isWaitingList}
              isRegistered={isRegistered}
              offerSpot={spotId}
              offerSpotInformation={spotInformation}
            />
          )}
          <Divider />
          {this.props.selectedOffers
            .sort((a, b) =>
              moment(a.offer.date_start).isBefore(moment(b.offer.date_start))
                ? -1
                : 1,
            )
            .map((offerData) => {
              const similarOfferSpotId =
                this.props.spotsForOffers[offerData.offer.id];

              const similarOfferRoomBlueprint =
                this.props?.roomBlueprintsById[offerData.offer.room_blueprint];

              const similarOfferSpotInformation = getSpotTypeMinimal(
                similarOfferRoomBlueprint,
                similarOfferSpotId,
                this.props.spotTypes,
              );

              const offerFeature = getOfferFeature(
                offerData.offer,
                this.props.offerStatusById,
                this.props.acceptDoubleBooking,
              );
              return (
                <React.Fragment key={offerData.offer.id}>
                  <OfferBookableItem
                    disabled={
                      offerData.group ? offerFeature.noInteraction : false
                    }
                    hideCoach={this.props.hideCoach}
                    offer={offerData.offer}
                    isBookable={offerFeature.isBookable}
                    isWaitingList={offerFeature.isWaitingList}
                    offerStatus={this.props.offerStatusById[offerData.offer.id]}
                    onRemove={
                      offerData.extra_data?.protected
                        ? null
                        : this.props.onClickRemoveOffer
                    }
                    isRegistered={offerFeature.isRegistered}
                    offerSpot={spotId}
                    offerSpotInformation={similarOfferSpotInformation}
                  />
                  <Divider />
                </React.Fragment>
              );
            })}

          {!!this.props.onClickAddMoreOffer &&
            !(offer?.group?.full_booking_only ?? false) &&
            (this.props.additionalGuestList || []).length === 0 && (
              <ButtonBase
                disabled={!offer}
                onClick={this.props.onClickAddMoreOffer}
                className={classes.bookButtonInner}
              >
                <AddIcon className={classes.leftIcon} />
                <Typography
                  variant="body1"
                  align="left"
                  color={offer ? 'primary' : 'textSecondary'}
                >
                  {t('booking:offer.addSession')}
                </Typography>
              </ButtonBase>
            )}
          {!!this.props.onAddAdditionalGuest &&
            (this.props.selectedOffers || []).length < 1 &&
            !this.props.isRegisteringForWaitingList &&
            !offer?.room_blueprint && (
              <>
                {numberOfGuestsAvailable > 0 &&
                  this.props.showBookingButton &&
                  this.props.packAllowsBookingGuest && (
                    <AdditionalGuestForm
                      onAddAdditionalGuest={this.props.onAddAdditionalGuest}
                      disabled={
                        !!this.props.additionalGuestList?.length &&
                        this.props.additionalGuestList.length + 1 >=
                          this.props.maxGuestNumberFromAllPacks
                      }
                    />
                  )}
                {((this.props.showBookingButton &&
                  this.props.packAllowsBookingGuest) ||
                  !this.props.showBookingButton) && (
                  <AdditionalGuestList
                    guestList={this.props.additionalGuestList}
                    onRemoveGuest={this.props.onRemoveGuest}
                  />
                )}
                {this.props.showBookingButton &&
                  !offer.room_blueprint &&
                  this.props.packAllowsBookingGuest && (
                    <>
                      {this.props.numberBookingGuestLeft >
                      this.props.additionalGuestList?.length ? (
                        <Typography variant="body2" align="left">
                          {numberOfGuestsAvailable > 1
                            ? t(
                                'booking:offer.bookingForAGuest.addGuestNumberLeftSeveral',
                                {
                                  number: numberOfGuestsAvailable,
                                },
                              )
                            : t(
                                'booking:offer.bookingForAGuest.addGuestNumberLeftOne',
                              )}{' '}
                          {this.getFrequencyTraduction()}
                        </Typography>
                      ) : (
                        <Typography variant="body2" align="left">
                          {t('booking:offer.bookingForAGuest.addGuestLimit')}{' '}
                          {this.getFrequencyTraduction()}
                        </Typography>
                      )}
                    </>
                  )}
              </>
            )}
          {hasLevel &&
            !!this.props.onAddAdditionalGuest &&
            this.props.packAllowsBookingGuest &&
            numberOfGuestsAvailable > 1 && (
              <div className={classes.levelWarningContainer}>
                <div className={classes.levelWarningIcon}>
                  <ErrorOutlineIcon />
                </div>
                <Typography variant="body2" align="left">
                  {hasCustomLevel
                    ? t(
                        'booking:offer.bookingForAGuest.warningCustomLeveledSession',
                      )
                    : t(
                        'booking:offer.bookingForAGuest.warningLeveledSession',
                        {
                          level: offerLevelTranslation,
                        },
                      )}
                </Typography>
              </div>
            )}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
  },
  offersContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  bookButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelWarningContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  levelWarningIcon: {
    transform: 'rotate(180deg)',
    color: '#009ccf',
    marginRight: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking', 'paymentPack', 'translation']),
)(OfferListSummary);
