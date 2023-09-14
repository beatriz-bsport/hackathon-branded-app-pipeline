import React from 'react';
import MarketplaceContractTermsModal, {
  Props as MarketplaceContractTermsModalProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractTermsModalCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

import { contractFactory } from '#libs/subscription/factory';

const contractFromFactory = contractFactory();

const usePropsFromVariation = (): MarketplaceContractTermsModalProps => {
  return {
    contractTerms: contractFromFactory.contract,
    isOpen: true,
    contractTermsLink: contractFromFactory.contract_terms_pdf_link,
    onDialogClose: () => {},
    onDownloadTerms: () => {},
  };
};

export const MARKETPLACE_CONTRACT_TERMS_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_TERMS_MODAL,
    css: MarketplaceContractTermsModalCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_CONTRACT_TERMS_MODAL_PREVIEW: React.FC = () => {
  const componentProps = usePropsFromVariation();
  return <MarketplaceContractTermsModal {...componentProps} />;
};
