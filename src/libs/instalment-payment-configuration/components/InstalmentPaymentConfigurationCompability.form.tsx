import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DoneAll from '@material-ui/icons/DoneAll';

import {
  CheckboxField,
  MaterialUiMultiSelectorField,
} from '#libs/custom-form/components/GenericFormik.input';

import { getShopItemName } from '#libs/shop/utils';

import type { PaymentPack } from '#libs/payment-packs/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { Giftcard } from '#libs/giftcard/types';
import type { ShopItem } from '#libs/shop/types';

type OwnProps = {
  paymentPackList: Array<PaymentPack>;
  privatePassList: Array<PrivatePass>;
  comboList: Array<PaymentCombo>;
  shopItemList: Array<ShopItem>;
  giftcardList: Array<Giftcard>;
  is_available_on_all_payment_pack: boolean;
  is_available_on_all_giftcard: boolean;
  is_available_on_all_payment_combo: boolean;
  is_available_on_all_private_pass: boolean;
  is_available_on_all_shop_item: boolean;
  isInDrawer: boolean;
  setFieldValue: (field: string, value: any) => void;
};

type Props = OwnProps;

export const InstalmentPaymentConfigurationCompatibility: React.FC<Props> = ({
  paymentPackList,
  privatePassList,
  comboList,
  shopItemList,
  giftcardList,
  is_available_on_all_payment_pack,
  is_available_on_all_giftcard,
  is_available_on_all_payment_combo,
  is_available_on_all_private_pass,
  is_available_on_all_shop_item,
  isInDrawer,
  setFieldValue,
}) => {
  const { t } = useTranslation(['instalmentPayment', 'shop']);
  const classes = useStyles();

  const paymentPackOptions = paymentPackList?.length
    ? [...paymentPackList].map((paymentPack) => ({
        value: paymentPack.id,
        label: paymentPack.name,
      }))
    : [];

  const privatePassOptions = privatePassList?.length
    ? [...privatePassList].map((privatePass) => ({
        value: privatePass.id,
        label: privatePass.name,
      }))
    : [];

  const comboOptions = comboList?.length
    ? [...comboList].map((combo) => ({
        value: combo.id,
        label: combo.name,
      }))
    : [];

  const shopItemOptions = shopItemList?.length
    ? [...shopItemList].map((shopItem) => ({
        value: shopItem.id,
        label: getShopItemName({
          name: shopItem?.name ?? '',
          variantCount:
            shopItem?.number_of_variants &&
            t('shop:variantCount', { count: shopItem.number_of_variants }),
        }),
      }))
    : [];

  const giftcardOptions = giftcardList?.length
    ? [...giftcardList].map((giftcard) => ({
        value: giftcard.id,
        label: giftcard.name,
      }))
    : [];

  return (
    <div className={!isInDrawer ? classes.padding : classes.paddingTop}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.row}>
            <DoneAll className={classes.icon} />
            <Typography variant="h6">
              {t('instalmentPayment:form.compatibility')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            {t('instalmentPayment:form.compabilityInfo')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              inScrollBar
              isDisabled={is_available_on_all_payment_pack}
              name="payment_pack_list"
              options={paymentPackOptions}
              placeholder={t('instalmentPayment:form.compability.selectPack')}
              title={
                <Typography className={classes.bold}>
                  {t('instalmentPayment:form.compability.pack')}
                </Typography>
              }
            />
            <div className={classes.row}>
              <CheckboxField
                name="is_available_on_all_payment_pack"
                onChange={(newValue) => {
                  newValue && setFieldValue('payment_pack_list', []);
                }}
              />
              <Typography className={classes.positionToLeft}>
                {t('instalmentPayment:form.compability.allPass')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              inScrollBar
              isDisabled={is_available_on_all_private_pass}
              name="private_pass_list"
              options={privatePassOptions}
              placeholder={t(
                'instalmentPayment:form.compability.selectPrivatePass',
              )}
              title={
                <Typography className={classes.bold}>
                  {t('instalmentPayment:form.compability.privateBooking')}
                </Typography>
              }
            />
            <div className={classes.row}>
              <CheckboxField
                name="is_available_on_all_private_pass"
                onChange={(newValue) => {
                  newValue && setFieldValue('private_pass_list', []);
                }}
              />
              <Typography className={classes.positionToLeft}>
                {t('instalmentPayment:form.compability.allPrivateBooking')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              inScrollBar
              isDisabled={is_available_on_all_payment_combo}
              name="payment_combo_list"
              options={comboOptions}
              placeholder={t('instalmentPayment:form.compability.selectCombo')}
              title={
                <Typography className={classes.bold}>
                  {t('instalmentPayment:form.compability.combo')}
                </Typography>
              }
            />
            <div className={classes.row}>
              <CheckboxField
                name="is_available_on_all_payment_combo"
                onChange={(newValue) => {
                  newValue && setFieldValue('payment_combo_list', []);
                }}
              />
              <Typography className={classes.positionToLeft}>
                {t('instalmentPayment:form.compability.allCombo')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              inScrollBar
              isDisabled={is_available_on_all_shop_item}
              name="shop_item_list"
              options={shopItemOptions}
              placeholder={t(
                'instalmentPayment:form.compability.selectShopItem',
              )}
              title={
                <Typography className={classes.bold}>
                  {t('instalmentPayment:form.compability.shopItem')}
                </Typography>
              }
            />
            <div className={classes.row}>
              <CheckboxField
                name="is_available_on_all_shop_item"
                onChange={(newValue) => {
                  newValue && setFieldValue('shop_item_list', []);
                }}
              />
              <Typography className={classes.positionToLeft}>
                {t('instalmentPayment:form.compability.allShopItem')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              inScrollBar
              isDisabled={is_available_on_all_giftcard}
              name="giftcard_list"
              options={giftcardOptions}
              placeholder={t(
                'instalmentPayment:form.compability.selectGiftcard',
              )}
              title={
                <Typography className={classes.bold}>
                  {t('instalmentPayment:form.compability.giftcard')}
                </Typography>
              }
            />
            <div className={classes.row}>
              <CheckboxField
                name="is_available_on_all_giftcard"
                onChange={(newValue) => {
                  newValue && setFieldValue('giftcard_list', []);
                }}
              />
              <Typography className={classes.positionToLeft}>
                {t('instalmentPayment:form.compability.allGiftcard')}
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  positionToLeft: { marginLeft: '-4px' },
  bold: { fontWeight: 500 },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 500,
  },
  padding: {
    padding: theme.spacing(4),
  },
  paddingTop: {
    paddingTop: theme.spacing(4),
  },
}));

export default React.memo(InstalmentPaymentConfigurationCompatibility);
