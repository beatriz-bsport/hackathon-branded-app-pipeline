import React from 'react';
import MarketplacePrivatePassCompatibilityModal, {
  Props as MarketplacePrivatePassCompatibilityModalProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePrivatePassCompatibilityModalCss from '!!raw-loader!./styles.css';
import { private_services_factory } from '#libs/private-service/factory';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

const fakePrivateServices = private_services_factory(3);

const usePropsFromVariation =
  (): MarketplacePrivatePassCompatibilityModalProps => {
    return {
      compatiblePrivateServices: fakePrivateServices,
      isOpen: true,
      onDialogClose: () => {},
    };
  };

export const MARKETPLACE_PRIVATE_PASS_COMPATIBILITY_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'privatePassCompatibilityModal',
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
