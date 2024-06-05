import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

import { contractFactory } from '#libs/subscription/factory';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractTermsModalCss from './styles.css?raw';
import MarketplaceContractTermsModal, {
  Props as MarketplaceContractTermsModalProps,
} from '.';

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
