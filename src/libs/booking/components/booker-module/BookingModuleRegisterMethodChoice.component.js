// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import List from '@material-ui/core/List';

import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '../../../consumer-payment-pack/components/ConsumerPackRowItem.component';

import type { ConsumerPaymentPack } from '../../../consumer-payment-pack/types';
import type { PaymentPack } from '../../../payment-packs/types';

type Props = {
  consumerPacks: Array<ConsumerPaymentPack>,
  consumerPacksNonCompatible: Array<ConsumerPaymentPack>,
  compatiblePacks: Array<PaymentPack>,
  registerToOffer: ({
    consumerPaymentPack?: ConsumerPaymentPack,
    paymentPack?: PaymentPack,
  }) => void,
  onBookMultiple: ({
    consumerPaymentPack?: ConsumerPaymentPack,
    paymentPack?: PaymentPack,
  }) => void,
};

export const BookingModuleRegisterMethodChoice = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.container}>
      <Typography variant="h6" component="h4">
        {t('offerManagement.forms.register.passOwnedByMember')}
      </Typography>
      {!props.consumerPacks.length && (
        <div>
          <div className={classes.alertRow}>
            <WarningIcon color="error" />
            <Typography variant="caption">
              {t('offer.noConsumerPackAvailableForPurchase')}
            </Typography>
          </div>
          {props.consumerPacksNonCompatible.length > 0 && (
            <div>
              <Typography variant="h6" component="h4">
                {t('offer.noncompatibleConsumerPaymentPacksAre')}
              </Typography>

              {props.consumerPacksNonCompatible.map((cp) => (
                <ConsumerPackRowItem
                  key={cp.id}
                  hideConsumer
                  isNonCompatible
                  paymentPack={cp.payment_pack}
                  consumerPack={cp}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {props.consumerPacks.length && (
        <List>
          {props.consumerPacks.map((cp) => (
            <ConsumerPackRowItem
              key={cp.id}
              hideConsumer
              onBookOne={() =>
                props.registerToOffer({ consumerPaymentPack: cp })
              }
              onBookMultiple={() =>
                props.onBookMultiple({ consumerPaymentPack: cp })
              }
              consumerPack={cp}
              paymentPack={cp.payment_pack}
            />
          ))}
        </List>
      )}
      <Typography variant="h6" component="h4">
        {t('offerManagement.forms.register.passCompatibleNotOwnedByMember')}
      </Typography>
      {!props.compatiblePacks.length ? (
        <div className={classes.alertRow}>
          <WarningIcon color="error" />
          <Typography variant="caption">
            {t('offer.noPackAvailableForOfferPurchase')}
          </Typography>
        </div>
      ) : (
        <List>
          {props.compatiblePacks
            .filter((pack) => !pack.disabled)
            .map((pack) => (
              <PaymentPackListItem
                showDuration
                hidePacksNumber
                onBookOne={() => props.registerToOffer({ paymentPack: pack })}
                onBookMultiple={() =>
                  props.onBookMultiple({ paymentPack: pack })
                }
                divider
                key={pack.id}
                pack={pack}
              />
            ))}
        </List>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  alertRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
}));

export default BookingModuleRegisterMethodChoice;
