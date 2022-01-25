import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Typography } from '@material-ui/core';
import { DoneAll } from '@material-ui/icons';
import { ShopItem } from '@bsport/common/lib/master-data/available-payment.type';
import {
  CheckboxField,
  MaterialUiMultiSelectorField,
} from '#libs/custom-form/components/GenericFormik.input';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { Giftcard } from '#libs/giftcard/types';

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
  setFieldValue: (field: string, value: any) => void;
};
type Props = OwnProps;
export const InstalmentPaymentCompablityForm: React.FC<Props> = (props) => {
  const { t } = useTranslation('instalmentPayment');
  const classes = useStyles();
  const {
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
    setFieldValue,
  } = props;
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
        label: shopItem.name,
      }))
    : [];

  const giftcardOptions = giftcardList?.length
    ? [...giftcardList].map((giftcard) => ({
        value: giftcard.id,
        label: giftcard.name,
      }))
    : [];
  return (
    <div className={classes.padding}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.row}>
            <DoneAll className={classes.icon} />
            <Typography variant="h6">{t('form.compatibility')}</Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">{t('form.compabilityInfo')}</Typography>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              isDisabled={is_available_on_all_payment_pack}
              inScrollBar
              placeholder={t('form.compability.selectPack')}
              name="payment_pack_list"
              options={paymentPackOptions}
              title={
                <Typography className={classes.bold}>
                  {t('form.compability.pack')}
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
                {t('form.compability.allPass')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              isDisabled={is_available_on_all_private_pass}
              inScrollBar
              placeholder={t('form.compability.selectPrivatePass')}
              name="private_pass_list"
              options={privatePassOptions}
              title={
                <Typography className={classes.bold}>
                  {t('form.compability.privateBooking')}
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
                {t('form.compability.allPrivateBooking')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              isDisabled={is_available_on_all_payment_combo}
              inScrollBar
              placeholder={t('form.compability.selectCombo')}
              name="payment_combo_list"
              options={comboOptions}
              title={
                <Typography className={classes.bold}>
                  {t('form.compability.combo')}
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
                {t('form.compability.allCombo')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              isDisabled={is_available_on_all_shop_item}
              inScrollBar
              placeholder={t('form.compability.selectShopItem')}
              name="shop_item_list"
              options={shopItemOptions}
              title={
                <Typography className={classes.bold}>
                  {t('form.compability.shopItem')}
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
                {t('form.compability.allShopItem')}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.column}>
            <MaterialUiMultiSelectorField
              isDisabled={is_available_on_all_giftcard}
              inScrollBar
              placeholder={t('form.compability.selectGiftcard')}
              name="giftcard_list"
              options={giftcardOptions}
              title={
                <Typography className={classes.bold}>
                  {t('form.compability.giftcard')}
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
                {t('form.compability.allGiftcard')}
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
}));
export default InstalmentPaymentCompablityForm;
