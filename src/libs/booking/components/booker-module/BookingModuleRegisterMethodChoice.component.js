// @flow
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import List from '@material-ui/core/List';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import PriceInput from '../../../../components/input/PriceInput.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '../../../consumer-payment-pack/components/ConsumerPackRowItem.component';

import type { ConsumerPaymentPack } from '../../../consumer-payment-pack/types';
import type { PaymentPack } from '../../../payment-packs/types';

type Props = {
  consumerPacks: Array<ConsumerPaymentPack>,
  consumerPacksNonCompatible: Array<ConsumerPaymentPack>,
  compatiblePacks: Array<PaymentPack>,
  registerToOffer: (
    {
      consumerPaymentPack?: ConsumerPaymentPack,
      paymentPack?: PaymentPack,
    },
    voucher?: number,
  ) => void,
  onBookMultiple: ({
    consumerPaymentPack?: ConsumerPaymentPack,
    paymentPack?: PaymentPack,
  }) => void,
};

export const BookingModuleRegisterMethodChoice = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [voucher, setVoucher] = useState(0);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
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
                onBookOne={() => {
                  setSelectedPack(pack);
                  setVoucherDialogOpen(true);
                }}
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
      <Dialog open={voucherDialogOpen}>
        <DialogTitle>
          {t('translation:payment.updateInvoiceVoucher')}
        </DialogTitle>
        <DialogContent>
          <Typography>{t('translation:quickInvoiceVoucher')}</Typography>
          <Typography variant="caption">
            {t('translation:quickInvoiceNoVoucher')}
          </Typography>
          <div className={classes.voucherField}>
            <PaymentPackListItem
              showDuration
              hidePacksNumber
              pack={selectedPack}
            />
            <PriceInput
              variant="outlined"
              value={voucher}
              onChange={(ev) => setVoucher(parseFloat(ev.target.value))}
              label={t('translation:payment.voucher')}
              error={Number.isNaN(voucher) || voucher < 0}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedPack(null);
              setVoucherDialogOpen(false);
              setVoucher(0);
            }}
          >
            {t('translation:common.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              props.registerToOffer({ paymentPack: selectedPack }, voucher);
              setSelectedPack(null);
              setVoucherDialogOpen(false);
              setVoucher(0);
            }}
            disabled={Number.isNaN(voucher) || voucher < 0}
          >
            {t('translation:common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
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
  voucherField: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
}));

export default BookingModuleRegisterMethodChoice;
