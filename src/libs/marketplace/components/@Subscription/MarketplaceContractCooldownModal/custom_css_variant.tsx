import React from 'react';
import MarketplaceContractCooldownModal, {
  Props as MarketplaceContractCooldownModalProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractCooldownModalCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

const usePropsFromVariation = (): MarketplaceContractCooldownModalProps => {
  return {
    isOpen: true,
    onDialogClose: () => {},
  };
};

export const MARKETPLACE_CONTRACT_COOLDOWN_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_COOLDOWN_MODAL,
    css: MarketplaceContractCooldownModalCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_CONTRACT_COOLDOWN_MODAL_PREVIEW: React.FC = () => {
  const componentProps = usePropsFromVariation();
  return <MarketplaceContractCooldownModal {...componentProps} />;
};
