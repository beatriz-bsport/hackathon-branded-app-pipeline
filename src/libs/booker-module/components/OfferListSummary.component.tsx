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

import { getOfferFeature } from '../utils';
import { MaterialStyleType } from '../../../utils/types';
import { Offer_FULL, OfferStatus } from '../../offer/types';
import OfferBookableItem from './OfferBookableItem.component';
import DividerLinearGradient from '../../../components/DividerLinearGradient.component';
import { OfferData } from '../types';
import { MemberMinimal } from '../../member/types';

type OwnProps = {
  offer: Offer_FULL;
  offerStatus?: OfferStatus;
  hideCoach: boolean;
  onClickAddMoreOffer: () => void;
  onClickRemoveOffer: (offer: Offer_FULL) => void;
  selectedOffers: OfferData[];
  relatedMemberList: MemberMinimal[];
  member?: MemberMinimal;
  offerStatusById: { [key: string]: OfferStatus };
  onSelectMember: (id: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class OfferListSummary extends React.PureComponent<Props> {
  render() {
    const { classes, t, offer, offerStatus } = this.props;

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

    const {
      isBookable,
      isWaitingList,
      isRegistered,
      noInteraction,
    } = getOfferFeature(
      offer,
      this.props.offerStatusById,
      this.props.acceptDoubleBooking,
    );

    return (
      <div className={classes.container}>
        <div className={classes.topRow}>
          <Typography variant="h5" color="textPrimary">
            {this.props.relatedMemberList.length
              ? t('booking:offer.bookingsTitleFor', {
                  count: this.props.selectedOffers.length + 1,
                })
              : t('booking:offer.bookingsTitle', {
                  count: this.props.selectedOffers.length + 1,
                })}
          </Typography>
          {!!this.props.relatedMemberList.length && (
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
              disabled={noInteraction}
              offer={offer}
              hideCoach={this.props.hideCoach}
              offerStatus={offerStatus}
              isBookable={isBookable}
              isWaitingList={isWaitingList}
              isRegistered={isRegistered}
            />
          )}
          <Divider />
          {this.props.selectedOffers
            .sort((a, b) => {
              if (moment(a.date_start).isBefore(moment(b.date_start))) {
                return -1;
              }
              return 1;
            })
            .map((offerData) => {
              const offerFeature = getOfferFeature(
                offerData.offer,
                this.props.offerStatusById,
                this.props.acceptDoubleBooking,
              );
              return (
                <React.Fragment key={offerData.offer.id}>
                  <OfferBookableItem
                    disabled={offerFeature.noInteraction}
                    offer={offerData.offer}
                    isBookable={offerFeature.isBookable}
                    isWaitingList={offerFeature.isWaitingList}
                    offerStatus={this.props.offerStatusById[offerData.offer.id]}
                    onRemove={this.props.onClickRemoveOffer}
                    isRegistered={
                      this.props.offerStatusById[offerData.offer.id]
                        .is_registered
                    }
                  />
                  <Divider />
                </React.Fragment>
              );
            })}

          {this.props.onClickAddMoreOffer && (
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
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking', 'paymentPack']),
)(OfferListSummary);
