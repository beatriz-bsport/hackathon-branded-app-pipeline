import React from 'react';
import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  Theme,
  Typography,
  Divider,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment-timezone';

import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_STATUS_CONVERTIBLE,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
} from '@bsport/common/lib/master-data/bookable-status';
import { MaterialStyleType } from '../../../utils/types';
import { Offer_FULL, OfferStatus } from '../../offer/types';
import OfferBookableItem from './OfferBookableItem.component';
import DividerLinearGradient from '../../../components/DividerLinearGradient.component';
import { OfferData } from '../types';

type OwnProps = {
  offer: Offer_FULL;
  offerStatus?: OfferStatus;
  onClickAddMoreOffer: () => void;
  onClickRemoveOffer: (offer: Offer_FULL) => void;
  selectedOffers: OfferData[];
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

    const isBookable =
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
    const isWaitingList =
      offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
      (offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN ||
        offerStatus.waiting_list_status ===
          OFFER_WAITING_LIST_STATUS_CONVERTIBLE);

    return (
      <div className={classes.container}>
        <div className={classes.topRow}>
          <Typography variant="h5" color="textPrimary">
            {t('booking:offer.bookingsTitle', {
              count: this.props.selectedOffers.length + 1,
            })}
          </Typography>
        </div>
        <DividerLinearGradient />

        <div className={classes.offersContainer}>
          <OfferBookableItem
            offer={offer}
            offerStatus={offerStatus}
            isBookable={isBookable}
            isWaitingList={isWaitingList}
          />
          <Divider />
          {this.props.selectedOffers
            .sort((a, b) => {
              if (moment(a.date_start).isBefore(moment(b.date_start))) {
                return -1;
              }
              return 1;
            })
            .map((offerData) => {
              const _offerStatus = this.props.offerStatusById[
                offerData.offer.id
              ];

              const _isBookable =
                _offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
              const _isWaitingList =
                _offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
                _offerStatus.waiting_list_status ===
                  OFFER_WAITING_LIST_STATUS_OPEN;

              return (
                <React.Fragment key={offerData.offer.id}>
                  <OfferBookableItem
                    offer={offerData.offer}
                    isBookable={_isBookable}
                    isWaitingList={_isWaitingList}
                    offerStatus={_offerStatus}
                    onRemove={this.props.onClickRemoveOffer}
                  />
                  <Divider />
                </React.Fragment>
              );
            })}

          {(isBookable || isWaitingList) && this.props.onClickAddMoreOffer && (
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
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
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
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking', 'paymentPack']),
)(OfferListSummary);
