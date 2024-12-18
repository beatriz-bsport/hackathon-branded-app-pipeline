import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Info from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import Warning from '@material-ui/icons/Warning';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import RedButton from '#src/components/button/RedButton.component';
import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';

import {
  generateComboCompatibilityInfo,
  generateDuration,
  generateGiftcardCompatibilityInfo,
  generatePackCompatibilityInfo,
  generatePrivatePassCompatibilityInfo,
  generateShopItemCompatibilityInfo,
  identifyCompability,
} from '#src/libs/instalment-payment-configuration/utils';

import type { Giftcard } from '#src/libs/giftcard/types';
import type { InstalmentPayment } from '#src/libs/instalment-payment-configuration/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { ShopItem } from '#src/libs/shop/types';
import InstalmentPaymentConfigurationCompatibilityDetail from './InstalmentPaymentConfigurationCompatibilityDetail.component';

type Props = {
  instalmentPayment: InstalmentPayment;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  instalmentPaymentId: number;
  paymentPackList: Array<PaymentPack>;
  privatePassList: Array<PrivatePass>;
  comboList: Array<PaymentCombo>;
  shopItemList: Array<ShopItem>;
  giftcardList: Array<Giftcard>;
};

export const InstalmentPaymentConfigurationDetail: React.FC<Props> = ({
  comboList,
  giftcardList,
  instalmentPayment,
  instalmentPaymentId,
  loading,
  onDelete,
  onEdit,
  paymentPackList,
  privatePassList,
  shopItemList,
}) => {
  const [isCompabilityDialogOpen, setIsCompabilityDialogOpen] =
    React.useState(false);

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const { t } = useTranslation('instalmentPayment');

  const classes = useStyles();

  const noCompatibility = identifyCompability(instalmentPayment);

  if (loading && instalmentPaymentId) {
    return (
      <Skeleton animation="wave" height={640} variant="rect" width="100%" />
    );
  }

  if (!instalmentPayment) {
    return (
      <div className={classes.containerNothing}>
        <Info />
        <Typography>{t('detail.noConfiguration')}</Typography>
      </div>
    );
  }

  return (
    <>
      <Paper>
        <div className={classes.container}>
          <div className={classes.row}>
            <div className={classes.title}>
              <Typography variant="h4">{instalmentPayment.name}</Typography>
            </div>
            <div className={classes.button}>
              <Button
                color="primary"
                onClick={() => onEdit(instalmentPayment.id)}
              >
                {t('modify')}
              </Button>
              <RedButton onClick={() => setIsConfirmDeleteDialogOpen(true)}>
                {t('delete')}
              </RedButton>
            </div>
          </div>
          <div className={classes.content}>
            <Typography variant="h6">{t('detail.recurrency')}</Typography>
            <Typography className={classes.grey}>
              {generateDuration(
                t,
                instalmentPayment.recurrency,
                instalmentPayment.frequency,
                instalmentPayment.number_of_billing,
              )}
            </Typography>
          </div>
          <div className={classes.content}>
            <Typography variant="h6">
              {t('detail.number_of_billing')}
            </Typography>
            <Typography className={classes.grey}>
              {t('detail.paymentNumber', {
                number_of_billing: instalmentPayment.number_of_billing,
                count: instalmentPayment.number_of_billing,
              })}
            </Typography>
          </div>
          {/* instalmentPayment.fee && (
            <div className={classes.content}>
              <Typography variant="h6">{t('detail.fee')}</Typography>
              <Typography className={classes.grey}>
                {getCurrencyDisplayWithPrice(instalmentPayment.fee)}
              </Typography>
            </div>
            ) */}
          {instalmentPayment.minimum_amount && (
            <div className={classes.content}>
              <Typography variant="h6">{t('detail.minimumAmount')}</Typography>
              <Typography className={classes.grey}>
                {getCurrencyDisplayWithPrice(instalmentPayment.minimum_amount)}
              </Typography>
            </div>
          )}
          <div className={classes.content}>
            <div className={classes.row}>
              <Typography variant="h6">{t('detail.compatibility')}</Typography>
              {!noCompatibility && (
                <Button
                  className={classes.buttonRight}
                  color="primary"
                  onClick={() => setIsCompabilityDialogOpen(true)}
                >
                  {t('detail.seeAll')}
                </Button>
              )}
            </div>
            {noCompatibility && (
              <div className={classes.row}>
                <Warning className={classes.iconLeft} color="error" />
                <Typography>{t('detail.noCompability')}</Typography>
              </div>
            )}

            {(!!instalmentPayment.payment_pack_list?.length ||
              instalmentPayment.is_available_on_all_payment_pack) && (
              <Typography className={classes.grey}>
                {generatePackCompatibilityInfo(
                  t,
                  instalmentPayment.payment_pack_list?.length,
                  instalmentPayment.is_available_on_all_payment_pack,
                )}
              </Typography>
            )}
            {(!!instalmentPayment.private_pass_list?.length ||
              instalmentPayment.is_available_on_all_private_pass) && (
              <Typography className={classes.grey}>
                {generatePrivatePassCompatibilityInfo(
                  t,
                  instalmentPayment.private_pass_list?.length,
                  instalmentPayment.is_available_on_all_private_pass,
                )}
              </Typography>
            )}
            {(!!instalmentPayment.payment_combo_list?.length ||
              instalmentPayment.is_available_on_all_payment_combo) && (
              <Typography className={classes.grey}>
                {generateComboCompatibilityInfo(
                  t,
                  instalmentPayment.payment_combo_list?.length,
                  instalmentPayment.is_available_on_all_payment_combo,
                )}
              </Typography>
            )}
            {(!!instalmentPayment.giftcard_list?.length ||
              instalmentPayment.is_available_on_all_giftcard) && (
              <Typography className={classes.grey}>
                {generateGiftcardCompatibilityInfo(
                  t,
                  instalmentPayment.giftcard_list?.length,
                  instalmentPayment.is_available_on_all_giftcard,
                )}
              </Typography>
            )}
            {(!!instalmentPayment.shop_item_list?.length ||
              instalmentPayment.is_available_on_all_shop_item) && (
              <Typography className={classes.grey}>
                {generateShopItemCompatibilityInfo(
                  t,
                  instalmentPayment.shop_item_list?.length,
                  instalmentPayment.is_available_on_all_shop_item,
                )}
              </Typography>
            )}
          </div>
          {instalmentPayment.is_only_available_when_all_items_are_compatible && (
            <Typography className={classes.bold}>
              {t('detail.onlyWhenAllAvailable')}
            </Typography>
          )}
          {!instalmentPayment.is_only_available_when_all_items_are_compatible && (
            <Typography className={classes.bold}>
              {t('detail.whenOneAvailable')}
            </Typography>
          )}
        </div>
      </Paper>
      <Dialog
        maxWidth={false}
        onClose={() => setIsCompabilityDialogOpen(false)}
        open={isCompabilityDialogOpen}
      >
        <div className={classes.dialog}>
          <InstalmentPaymentConfigurationCompatibilityDetail
            comboList={comboList}
            giftcardList={giftcardList}
            instalmentPayment={instalmentPayment}
            paymentPackList={paymentPackList}
            privatePassList={privatePassList}
            shopItemList={shopItemList}
          />
          <div className={classes.action}>
            <Button
              color="primary"
              onClick={() => setIsCompabilityDialogOpen(false)}
            >
              {t('close')}
            </Button>
          </div>
        </div>
      </Dialog>
      <GenericMuiDialog
        confirmText={t('delete')}
        content={t('deleteDialog.content')}
        onCancel={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(instalmentPayment.id);
          setIsConfirmDeleteDialogOpen(false);
        }}
        open={isConfirmDeleteDialogOpen}
        title={t('deleteDialog.title')}
      />
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  containerNothing: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
  },
  dialog: { padding: theme.spacing(3) },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(3),
  },
  bold: { fontWeight: 500 },
  buttonRight: { marginLeft: theme.spacing(1) },
  iconLeft: { marginRight: theme.spacing(2) },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flex: '1 1 auto',
  },
  button: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  grey: { color: 'rgba(0, 0, 0, 0.6)' },
}));

export default React.memo(InstalmentPaymentConfigurationDetail);
