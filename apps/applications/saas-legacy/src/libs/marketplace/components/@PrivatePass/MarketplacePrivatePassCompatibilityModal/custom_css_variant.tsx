import React from 'react';
import { privateServiceListFactory } from '#src/libs/private-service/factory';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#src/libs/exportable-components/types';
import { PrivateServiceWithSlots } from '#src/libs/private-service/types';
// @ts-expect-error
import MarketplacePrivatePassCompatibilityModalCss from './styles.css?raw';
import MarketplacePrivatePassCompatibilityModal, {
  Props as MarketplacePrivatePassCompatibilityModalProps,
} from '.';

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
