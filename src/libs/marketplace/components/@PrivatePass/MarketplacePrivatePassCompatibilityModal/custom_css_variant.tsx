import React from 'react';
import MarketplacePrivatePassCompatibilityModal, {
  Props as MarketplacePrivatePassCompatibilityModalProps,
} from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePrivatePassCompatibilityModalCss from './styles.css?raw';
import { privateServiceListFactory } from '#libs/private-service/factory';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';
import { PrivateServiceWithSlots } from '#libs/private-service/types';

const fakePrivateServices = privateServiceListFactory(3, { withCoaches: true });

const usePropsFromVariation =
  (): MarketplacePrivatePassCompatibilityModalProps => {
    return {
      compatiblePrivateServices:
        fakePrivateServices as PrivateServiceWithSlots[],
      isOpen: true,
      onDialogClose: () => {},
    };
  };

export const MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL,
    css: MarketplacePrivatePassCompatibilityModalCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_PREVIEW: React.FC =
  () => {
    const componentProps = usePropsFromVariation();
    return <MarketplacePrivatePassCompatibilityModal {...componentProps} />;
  };
