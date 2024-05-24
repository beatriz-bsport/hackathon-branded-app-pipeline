import React from 'react';
import MarketplacePaymentPackCompatibilityModal, {
  Props as MarketplacePaymentPackCompatibilityModalProps,
} from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePaymentPackCompatibilityModalCss from './styles.css?raw';
import { factory_scts } from '#libs/category/factory';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { establishment_factory } from '#libs/establishment/factory';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';
import { generateRandomInt } from '../../../../../utils/factories';

const fakeCategories = factory_scts(generateRandomInt(5));
const fakeMetaActivities = meta_activity_factory(generateRandomInt(5));
const fakeEstablishments = establishment_factory(generateRandomInt(5));

const usePropsFromVariation =
  (): MarketplacePaymentPackCompatibilityModalProps => {
    return {
      categories: fakeCategories,
      metaActivities: fakeMetaActivities,
      establishments: fakeEstablishments,
      isOpen: true,
      onDialogClose: () => {},
    };
  };

export const MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL,
    css: MarketplacePaymentPackCompatibilityModalCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_PAYMENT_PACK_COMPATIBILITY_MODAL_PREVIEW: React.FC =
  () => {
    const componentProps = usePropsFromVariation();
    return <MarketplacePaymentPackCompatibilityModal {...componentProps} />;
  };
