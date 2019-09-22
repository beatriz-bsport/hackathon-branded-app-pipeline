// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { Offer } from '../types';

import MarketplaceWorkshopEvent from './MarketplaceWorkshopEvent.component';
import MarketplaceActivityDialog from './MarketplaceActivityDialog.component';

type Props = {
  offers: Array<Offer>,
  classes: *,
  offerSelected: ?Offer,
  hideMap: boolean,
  selectOffer: (Offer) => void,
  onBook: (id: number) => void,
  onBookOption: (id: number) => void,
  fetchPaymentPacks: (offerId: number) => void,
  fetchCompatiblePass: (offerId: number) => void,
  goToPackPayment: (offerId: number) => void,
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,
  onBookOfferFromPack: (offerId: number, consumerPackId: number) => void,
  t: TFunction,
};

export const MarketplaceWorkshop = (props: Props) => {
  const { offers, classes, t } = props;
  if ((offers || []).length === 0) {
    return (
      <div className={classes.centeredText}>
        <Typography color="textSecondary">
          {t('workshop.noWorkshopAvailable')}
        </Typography>
      </div>
    );
  }
  return (
    <div>
      <div>
        {offers.map((o) => (
          <div key={o.id} className={classes.workshopCardContainer}>
            <MarketplaceWorkshopEvent
              offer={o}
              onShowMore={() => props.selectOffer(o)}
              onBook={() => props.onBook(o.id)}
              onBookOption={() => props.onBookOption(o.id)}
            />
          </div>
        ))}
      </div>
      <MarketplaceActivityDialog
        offer={props.offerSelected}
        hideMap={props.hideMap}
        showBookingButton
        displayPacksInformation
        onClose={() => props.selectOffer(null)}
        open={!!props.offerSelected}
        fetchPassData={() => {
          props.fetchPaymentPacks(props.offerSelected.id);
          props.fetchCompatiblePass(props.offerSelected.id);
        }}
        goToPackPayment={props.goToPackPayment}
        goToOfferPayment={(id) =>
          props.onBook(id, props.offerSelected.meta_activity.company)
        }
        onBookFromPack={(packId) =>
          props.onBookOfferFromPack(props.offerSelected.id, packId)
        }
        offerId={props.offerSelected ? props.offerSelected.id : null}
        compatibleConsumerPacks={props.compatibleConsumerPacks}
        compatiblePaymentPacks={props.compatiblePaymentPacks}
      />
    </div>
  );
};

const styles = (theme) => ({
  workshopCardContainer: {
    padding: theme.spacing.unit * 2,
  },
  centeredText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: theme.spacing.unit * 3,
  },
});

export default compose(
  withNamespaces(['marketplace']),
  withStyles(styles),
  withState('offerSelected', 'selectOffer', null),
)(MarketplaceWorkshop);
