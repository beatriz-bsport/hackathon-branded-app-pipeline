import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { ShopItem } from '@bsport/common/lib/master-data/available-payment.type';
import { InstalmentPayment } from '../types';
import InstalmentPaymentCompatibleItemsList from './InstalmentPaymentConfigurationCompatibleItemsList.component';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { Giftcard } from '#libs/giftcard/types';

type OwnProps = {
  instalmentPayment: InstalmentPayment;
  paymentPackList: Array<PaymentPack>;
  privatePassList: Array<PrivatePass>;
  comboList: Array<PaymentCombo>;
  shopItemList: Array<ShopItem>;
  giftcardList: Array<Giftcard>;
};
type Props = OwnProps;
export const InstalmentPaymentCompatibilityDetail: React.FC<Props> = (
  props,
) => {
  const classes = useStyles();
  const {
    instalmentPayment,
    paymentPackList,
    privatePassList,
    comboList,
    shopItemList,
    giftcardList,
  } = props;
  const { t } = useTranslation('instalmentPayment');
  if (!instalmentPayment) {
    return null;
  }

  return (
    <div className={classes.container}>
      <InstalmentPaymentCompatibleItemsList
        allItemList={paymentPackList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_payment_pack}
        itemList={instalmentPayment.payment_pack_list}
        title={t('detail.paymentPack')}
      />
      <InstalmentPaymentCompatibleItemsList
        allItemList={privatePassList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_private_pass}
        itemList={instalmentPayment.private_pass_list}
        title={t('detail.privatePass')}
      />
      <InstalmentPaymentCompatibleItemsList
        allItemList={comboList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_payment_combo}
        itemList={instalmentPayment.payment_combo_list}
        title={t('detail.combo')}
      />
      <InstalmentPaymentCompatibleItemsList
        allItemList={giftcardList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_giftcard}
        itemList={instalmentPayment.giftcard_list}
        title={t('detail.giftcard')}
      />

      <InstalmentPaymentCompatibleItemsList
        allItemList={shopItemList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_shop_item}
        itemList={instalmentPayment.shop_item_list}
        title={t('detail.shopItem')}
      />
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    gap: theme.spacing(6),
    justifyContent: 'center',
  },
}));
export default InstalmentPaymentCompatibilityDetail;
