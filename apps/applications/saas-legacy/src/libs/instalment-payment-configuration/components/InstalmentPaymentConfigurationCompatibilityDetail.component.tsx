import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles } from '@material-ui/core/styles';

import type { Giftcard } from '#src/libs/giftcard/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { InstalmentPayment } from '#src/libs/instalment-payment-configuration/types';
import InstalmentPaymentConfigurationCompatibleItemsList from './InstalmentPaymentConfigurationCompatibleItemsList.component';

type Props = {
  instalmentPayment: InstalmentPayment;
  paymentPackList: Array<PaymentPack>;
  privatePassList: Array<PrivatePass>;
  comboList: Array<PaymentCombo>;
  shopItemList: Array<ShopItem>;
  giftcardList: Array<Giftcard>;
};

export const InstalmentPaymentConfigurationCompatibilityDetail: React.FC<
  Props
> = ({
  instalmentPayment,
  paymentPackList,
  privatePassList,
  comboList,
  shopItemList,
  giftcardList,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('instalmentPayment');

  if (!instalmentPayment) {
    return null;
  }

  return (
    <div className={classes.container}>
      <InstalmentPaymentConfigurationCompatibleItemsList
        allItemList={paymentPackList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_payment_pack}
        itemList={instalmentPayment.payment_pack_list}
        title={t('detail.paymentPack')}
      />
      <InstalmentPaymentConfigurationCompatibleItemsList
        allItemList={privatePassList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_private_pass}
        itemList={instalmentPayment.private_pass_list}
        title={t('detail.privatePass')}
      />
      <InstalmentPaymentConfigurationCompatibleItemsList
        allItemList={comboList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_payment_combo}
        itemList={instalmentPayment.payment_combo_list}
        title={t('detail.combo')}
      />
      <InstalmentPaymentConfigurationCompatibleItemsList
        allItemList={giftcardList}
        isAvailableOnAll={instalmentPayment.is_available_on_all_giftcard}
        itemList={instalmentPayment.giftcard_list}
        title={t('detail.giftcard')}
      />

      <InstalmentPaymentConfigurationCompatibleItemsList
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

export default React.memo(InstalmentPaymentConfigurationCompatibilityDetail);
