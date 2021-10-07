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
import Divider from '@material-ui/core/Divider';
import PriceInput from '../../../../components/input/PriceInput.component';
import PercentInput from '../../../../components/input/PercentInput.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '../../../consumer-payment-pack/components/ConsumerPackRowItem.component';

import type { ConsumerPaymentPack } from '../../../consumer-payment-pack/types';
import type { PaymentPack } from '../../../payment-packs/types';
import { MaxoutBooking } from '../../../consumer-payment-pack/types';
import { Offer } from '../../../offer/types';
import EstablishmentSelector from '../../../establishment/components/EstablishmentSelector.component';

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
  offer?: Offer,
  cppMaxoutBookingsByCpp?: { [cpp_id: string]: MaxoutBooking },
  disableMultiBooking?: boolean,
  establishments: Array<Establishment>,
  establishmentLoading: boolean,
  enableMultiLocalization: boolean,
};

export const BookingModuleRegisterMethodChoice = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [voucher, setVoucher] = useState(0);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [billingEstablishmentId, setBillingEstablishmentId] = useState(null);

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
              {...{
                onBook: props.disableMultiBooking
                  ? () => props.registerToOffer({ consumerPaymentPack: cp })
                  : undefined,
              }}
              onBookOne={() =>
                props.registerToOffer({ consumerPaymentPack: cp })
              }
              onBookMultiple={
                props.disableMultiBooking
                  ? undefined
                  : () => props.onBookMultiple({ consumerPaymentPack: cp })
              }
              consumerPack={cp}
              paymentPack={cp.payment_pack}
              maxoutBooking={props.cppMaxoutBookingsByCpp[cp.id]}
              offer={props.offer}
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
                onBookMultiple={
                  props.disableMultiBooking
                    ? undefined
                    : () => props.onBookMultiple({ paymentPack: pack })
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
            <div className={classes.voucherRight}>
              <PriceInput
                variant="outlined"
                value={voucher}
                onChange={(ev) =>
                  setVoucher(
                    Math.round(parseFloat(ev.target.value) * 100) / 100,
                  )
                }
                label={t('translation:payment.voucher')}
                error={Number.isNaN(voucher) || voucher < 0}
              />
              <PercentInput
                variant="outlined"
                style={{ minWidth: 480 }}
                value={
                  selectedPack
                    ? parseInt((voucher / selectedPack.price) * 100, 10)
                    : 0
                }
                onChange={(ev) =>
                  setVoucher(
                    selectedPack
                      ? Math.round(
                          parseFloat(ev.target.value) * selectedPack.price,
                        ) / 100
                      : voucher,
                  )
                }
                label={t('translation:payment.voucher')}
              />
            </div>
          </div>
          {props.enableMultiLocalization && (
            <div>
              <Typography variant="h6" className={classes.sectionTitle}>
                {t('invoice:section.invoiceItemList.billing_establishment')}
              </Typography>
              <Divider className={classes.divider} />

              <EstablishmentSelector
                establishments={props.establishments}
                isClearable
                isLoading={props.establishmentLoading}
                isOptionDisabled
                selectOption={async (item: {
                  value: number,
                  label: string,
                }) => {
                  setBillingEstablishmentId(item ? item.value : null);
                }}
                selectedEstablishments={[billingEstablishmentId]}
                noMulti
                closeMenuOnSelect
              />
            </div>
          )}
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
              props.registerToOffer(
                { paymentPack: selectedPack },
                voucher,
                billingEstablishmentId,
              );
              setSelectedPack(null);
              setVoucherDialogOpen(false);
              setVoucher(0);
              setBillingEstablishmentId(null);
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingTop: theme.spacing(2),
  },
  voucherRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    '&>*': {
      marginBottom: theme.spacing(1.5),
    },
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
}));

export default BookingModuleRegisterMethodChoice;
