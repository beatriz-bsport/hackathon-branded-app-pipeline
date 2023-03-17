import React from 'react';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import Search from '#components/css-only/Search';
import ClickableItem from '#components/css-only/ClickableItem';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import {
  useMarketplaceSearchPaymentComboData,
  useMarketplaceSearchPrivatePassData,
  useMarketplaceSearchPaymentPackData,
} from '../hooks';
import { BaseAdditionalData, SearchItemData } from '../Search.component';

export type Props = {
  paymentPackList: PaymentPack[];
  privatePassList: PrivatePass[];
  paymentComboList: PaymentCombo[];
  isExcludingTax: boolean;
  onPressEnter: (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => void;
  onClearInput: () => void;
  showPaymentPackDetail: (id: number) => void;
  addPaymentPackToBasket: (id: number) => void;

  showPrivatePassDetail: (id: number) => void;
  addPrivatePassToBasket: (id: number) => void;

  showPaymentComboDetail: (id: number) => void;
  addPaymentComboToBasket: (id: number) => void;
};
export const PassSearch: React.FC<Props> = (props) => {
  const {
    paymentPackList,
    privatePassList,
    paymentComboList,
    isExcludingTax,
    onClearInput,
    showPaymentPackDetail,
    addPaymentPackToBasket,
    showPrivatePassDetail,
    addPrivatePassToBasket,
    showPaymentComboDetail,
    addPaymentComboToBasket,
    onPressEnter,
  } = props;

  const actionIcon = <ShoppingCartIcon className="bs-search__item__icon" />;

  const { paymentPackItems } = useMarketplaceSearchPaymentPackData({
    paymentPackList,
    actionIcon,
    isExcludingTax,
    showPaymentPackDetail,
    addPaymentPackToBasket,
  });

  const { privatePassItems } = useMarketplaceSearchPrivatePassData({
    privatePassList,
    actionIcon,
    isExcludingTax,
    showPrivatePassDetail,
    addPrivatePassToBasket,
  });

  const { paymentComboItems } = useMarketplaceSearchPaymentComboData({
    paymentComboList,
    actionIcon,
    isExcludingTax,
    showPaymentComboDetail,
    addPaymentComboToBasket,
  });

  const data = React.useMemo(
    () => [...paymentPackItems, ...privatePassItems, ...paymentComboItems],
    [paymentComboItems, paymentPackItems, privatePassItems],
  );

  return (
    <Search
      data={data}
      onPressEnter={onPressEnter}
      onClearInput={onClearInput}
      renderItem={(item: SearchItemData<BaseAdditionalData>) => (
        <ClickableItem {...item.additionalData} />
      )}
    />
  );
};

export default PassSearch;
