import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  Collapse,
  Button,
  Drawer,
  Theme,
  withStyles,
  Box,
  Divider,
  Typography,
  LinearProgress,
  ButtonBase,
} from '@material-ui/core';
import InfoOutlineIcon from '@material-ui/icons/Info';
import Skeleton from '@material-ui/lab/Skeleton';

import CloseIcon from '@material-ui/icons/Close';

import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
} from '@bsport/common/lib/master-data/bookable-status';

import { MaterialStyleType } from '../../../utils/types';
import { Offer, Offer_FULL, OfferStatus } from '../../offer/types';
import { OfferData } from '../types';
import OfferItem from './OfferBookableItem.component';

type OwnProps = {
  offer?: Offer_FULL;
  open: boolean;
  onClose: () => void;
  selectedOffers: OfferData[];
  onSelectOffer: (offer: Offer_FULL) => void;
  similarOffers: Offer[];
  loading: boolean;
  hasMoreSimilarOffer: boolean;
  onClickShowMore: () => void;
  offerStatusById: { [key: string]: OfferStatus };
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class SimilarOffers extends React.PureComponent<Props> {
  get availableOffers() {
    return this.props.similarOffers.filter((o) => {
      return o.id !== this.props.offer.id;
    });
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.selectedOffers !== this.props.selectedOffers) {
      const displayedOffersCount =
        this.availableOffers.length - this.props.selectedOffers.length;
      displayedOffersCount === 0 &&
        this.props.hasMoreSimilarOffer &&
        this.props.onClickShowMore();
    }
  };

  componentWillMount = () => {
    this.props.resetSimilarOffers();
  };

  onClickSelectAllOffers = () => {
    const offers = this.availableOffers.filter((o) => {
      if (!this.props.selectedOffers.length) {
        return true;
      }

      return !this.props.selectedOffers.find((so) => so.offer.id === o.id);
    });

    offers.forEach((o) => {
      this.props.onSelectOffer(o);
    });
  };

  render() {
    const { classes, t } = this.props;

    const displayedOffersCount =
      this.availableOffers.length - this.props.selectedOffers.length;

    return (
      <Drawer
        anchor="right"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <div className={classes.topRow}>
          <Typography variant="h5" color="textPrimary">
            {t('offer.similarOffer.title')}
          </Typography>

          <ButtonBase
            className={classes.closeButton}
            onClick={this.props.onClose}
          >
            <CloseIcon />
          </ButtonBase>
        </div>

        <Divider />

        {this.props.loading && (
          <div style={{ width: '100%' }}>
            <LinearProgress />
          </div>
        )}

        {!this.props.loading && displayedOffersCount > 0 && (
          <div className={classes.selectAllContainer}>
            <ButtonBase onClick={this.onClickSelectAllOffers}>
              <Typography color="primary">
                {t('offer.similarOffer.selectAll').toUpperCase()}
              </Typography>
            </ButtonBase>
          </div>
        )}

        {!this.props.loading && displayedOffersCount === 0 && (
          <div className={classes.emptyMessageContainer}>
            <InfoOutlineIcon className={classes.leftIcon} />
            <Typography variant="caption">
              {t('offer.similarOffer.empty')}
            </Typography>
          </div>
        )}

        <div className={classes.similarOffersContainer}>
          {this.availableOffers.map((o) => {
            const offerStatus = this.props.offerStatusById[o.id];
            if (
              !o.establishment ||
              !o.coach ||
              !offerStatus ||
              !o.meta_activity
            ) {
              return (
                <Box
                  width="100%"
                  height={60}
                  p={2}
                  className={classes.similarOfferItem}
                >
                  {!o.establishment && 'missing estab'}
                  {!o.coach && 'missing coach'}
                  {!offerStatus && 'mis status'}
                  {!o.meta_activity && 'mis activity'}
                  <Skeleton
                    animation="wave"
                    width="50%"
                    variant="text"
                    height={20}
                  />
                  <Skeleton
                    animation="wave"
                    width="30%"
                    variant="text"
                    height={20}
                  />
                </Box>
              );
            }

            const isBookable =
              offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE;
            const isWaitingList =
              offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
              offerStatus.waiting_list_status ===
                OFFER_WAITING_LIST_STATUS_OPEN;

            const isSelected = Boolean(
              this.props.selectedOffers.find(
                (offerData) => offerData.offer.id === o.id,
              ),
            );

            return (
              <Collapse in={!isSelected}>
                <div className={classes.similarOfferItem}>
                  <OfferItem
                    offer={o}
                    offerStatus={offerStatus}
                    isBookable={isBookable}
                    isWaitingList={isWaitingList}
                    onAdd={this.props.onSelectOffer}
                    height={200}
                  />
                </div>
              </Collapse>
            );
          })}
          {!this.props.loading && this.props.hasMoreSimilarOffer && (
            <Button color="primary" onClick={this.props.onClickShowMore}>
              {t('offer.similarOffer.showMore')}
            </Button>
          )}
        </div>
      </Drawer>
    );
  }
}

const styles = (theme: Theme) => ({
  similarOffersContainer: {
    minWidth: '100vw',
    marginTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      minWidth: 400,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 600,
    },
  },
  topRow: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  selectAllContainer: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(5),
  },
  similarOfferItem: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking']),
)(SimilarOffers);
