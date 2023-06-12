import { ReactElement } from 'react';

import { PaymentCombo } from '#libs/payment-combo/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PrivatePass } from '#libs/private-service/types';
import { ContractWithPaymentPack } from '#libs/subscription/types';

export type SearchItem = any;

type MarketplaceSearchDataParamsBase = {
  actionIcon?: ReactElement;
};

export interface MarketplaceSearchPaymentPackDataParams
  extends MarketplaceSearchDataParamsBase {
  paymentPackList: PaymentPack[];
  isExcludingTax: boolean;
  showPaymentPackDetail: (id?: number) => void;
  addPaymentPackToBasket: (id?: number) => void;
}

export interface MarketplaceSearchPrivatePassDataParams
  extends MarketplaceSearchDataParamsBase {
  privatePassList: PrivatePass[];
  isExcludingTax: boolean;
  showPrivatePassDetail: (id?: number) => void;
  addPrivatePassToBasket: (id?: number) => void;
}

export interface MarketplaceSearchPaymentComboDataParams
  extends MarketplaceSearchDataParamsBase {
  paymentComboList: PaymentCombo[];
  isExcludingTax: boolean;
  showPaymentComboDetail: (id?: number) => void;
  addPaymentComboToBasket: (id?: number) => void;
}

export interface MarketplaceSearchContractDataParams
  extends MarketplaceSearchDataParamsBase {
  contractList: ContractWithPaymentPack[];
  isExcludingTax: boolean;
  showContractDetail: (id?: number) => void;
  addContractToBasket: (contract?: ContractWithPaymentPack) => void;
}

export enum MarketplaceSearchDataIdentifier {
  PAYMENT_PACK = 'paymentPack',
  PRIVATE_PASS = 'privatePass',
  PAYMENT_COMBO = 'paymentCombo',
  CONTRACT = 'contract',
}
