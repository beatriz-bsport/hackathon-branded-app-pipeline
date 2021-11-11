// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose, withState } from 'recompose';
import { withTranslation } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import type { Offer } from '../types';
import type { PaymentCombo } from '../../payment-combo/types';

import MarketplaceWorkshopEvent from './MarketplaceWorkshopEvent.component';
import MarketplaceActivityDialog from './MarketplaceActivityDialog.component';

type Props = {
  offers: Array<Offer>,
  classes: any,
  offerSelected: ?Offer,
  hideMap: boolean,
  selectOffer: (Offer) => void,
  onBook: (id: number) => void,
  onBookOption: (id: number) => void,
  goToPackPayment: (offerId: number) => void,
  hideCoach: boolean,
  activityLoading: boolean,
  establishmentLoading: boolean,
  loading: boolean,
  paymentComboList: Array<PaymentCombo>,
  goToPaymentComboPayment: (offerId: number) => void,

  onBookOfferFromPack: (offerId: number, consumerPackId: number) => void,
  t: TFunction,
  mapContainerClassName?: string,
  showOfferFilling: boolean,
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
    <div className={classes.fullWidth}>
      <div className={classes.fullWidth}>
        {offers.map((o) => (
          <div key={o.id} className={classes.workshopCardContainer}>
            <MarketplaceWorkshopEvent
              offer={o}
              onShowMore={() => props.selectOffer(o)}
              onBook={() => props.onBook(o)}
              onBookOption={() => props.onBookOption(o.id)}
              activityLoading={props.activityLoading}
              establishmentLoading={props.establishmentLoading}
              showOfferFilling={props.showOfferFilling}
            />
          </div>
        ))}
        {offers.length !== 0 &&
          props.loading &&
          [1, 2].map((i) => (
            <div key={i} className={classes.workshopCardContainer}>
              <MarketplaceWorkshopEvent
                activityLoading={props.activityLoading}
                establishmentLoading={props.establishmentLoading}
              />
            </div>
          ))}
      </div>
      <MarketplaceActivityDialog
        offer={props.offerSelected}
        hideMap={props.hideMap}
        showBookingButton
        hideCoach={props.hideCoach}
        displayPacksInformation
        onClose={() => props.selectOffer(null)}
        open={!!props.offerSelected}
        goToPackPayment={props.goToPackPayment}
        goToPaymentComboPayment={props.goToPaymentComboPayment}
        goToOfferPayment={() =>
          props.onBook(
            props.offerSelected,
            props.offerSelected.meta_activity.company,
          )
        }
        onBookFromPack={(packId) =>
          props.onBookOfferFromPack(props.offerSelected.id, packId)
        }
        offerId={props.offerSelected ? props.offerSelected.id : null}
        paymentComboList={props.paymentComboList}
        mapContainerClassName={props.mapContainerClassName}
      />
    </div>
  );
};

const styles = (theme) => ({
  fullWidth: {
    width: '100%',
  },
  workshopCardContainer: {
    padding: theme.spacing(2),
  },
  centeredText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: theme.spacing(3),
  },
});

export default compose(
  withTranslation(['marketplace']),
  withStyles(styles),
  withState('offerSelected', 'selectOffer', null),
)(MarketplaceWorkshop);
