import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import MarketplaceSpotSelector from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceSportSelectorCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { offerFactory } from '#libs/offer/factories';

const offer = offerFactory({
  withLevel: true,
  withCoach: true,
  withEstablishment: true,
  withMetaActivity: true,
  offerStatus: 'bookable',
});

const usePropsFromVariation = (): Omit<
  React.ComponentProps<typeof MarketplaceSpotSelector>,
  'theme'
> => {
  const coachPicture = faker.image.urlPicsumPhotos({ grayscale: true });
  return {
    offer: {
      ...offer,
      coach: { ...offer.coach, photo: coachPicture },
      room_blueprint: 1,
    },
    closeSpotSelector: () => {},
    updateSpotForOffer: () => {},
    fetchOfferStatus: () => {},
    fetchSpotForBlueprint: () => {},
    goToCheckout: () => {},
    selectedSpot: null,
    roomBlueprintsById: {
      1: {
        id: 1,
        disabled: false,
        name: 'Map',
        company: 1,
        establishment: offer.establishment.id,
        canvas: {
          elements: [
            {
              type: 'rect',
              id: 'unbound-asset-css-preview',
              data: {
                width: 2000,
                x: 0,
                y: 0,
                fill: '#75726F',
                height: 1000,
                rotation: 0,
                selected: false,
                stroke: 'transparent',
                strokeWidth: '2',
              },
            },
            {
              type: 'teacher',
              id: 'fake-teacher-1',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 975,
                y: 100,
                height: 150,
                rotation: 0,
                selected: false,
                stroke: null,
                strokeWidth: '6',
                fontSize: '40px',
                textOffsetY: 10,
                fontColor: 'white',
                fontWeight: 'bold',
              },
            },
            {
              type: 'spot',
              id: 'fake-spot-1',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 650,
                y: 400,
                fill: 'rgba(255,255,255,0.101)',
                height: 150,
                rotation: 0,
                selected: false,
                stroke: null,
                strokeWidth: '6',
              },
            },
            {
              type: 'spot',
              id: 'fake-spot-2',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 950,
                y: 400,
                fill: 'rgba(255,255,255,0.101)',
                height: 150,
                rotation: 0,
                selected: false,
                stroke: null,
                strokeWidth: '6',
              },
            },
            {
              type: 'spot',
              id: 'fake-spot-3',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 1250,
                y: 400,
                fill: '#49997e',
                height: 150,
                rotation: 0,
                selected: false,
                strokeWidth: '6',
                stroke: '#489279',
              },
            },
            {
              type: 'spot',
              id: 'fake-spot-4',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 650,
                y: 700,
                fill: '#49997e',
                height: 150,
                rotation: 0,
                selected: false,
                strokeWidth: '6',
                stroke: '#489279',
              },
            },
            {
              type: 'spot',
              id: 'fake-spot-5',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 950,
                y: 700,
                fill: 'black',
                height: 150,
                rotation: 0,
                selected: false,
                stroke: null,
                strokeWidth: '6',
              },
            },
            {
              type: 'spot',
              id: 'fake-spot-6',
              data: {
                spotTypeId: 1,
                width: 100,
                x: 1250,
                y: 700,
                fill: '#49997e',
                height: 150,
                rotation: 0,
                selected: false,
                strokeWidth: '6',
                stroke: '#489279',
              },
            },
          ],
        },
      },
    },
    assetByIdBlueprintByIdentifier: {},
    offerStatusById: {},
    spotTypes: [
      {
        id: 1,
        shape: 'circular',
        customization: 'predefined',
        name: 'Example',
        prefix: '',
        fill_color: '',
        stroke_color: '',
        free_image: '',
        selected_image: '',
        taken_image: '',
      },
    ],
  };
};

export const MARKETPLACE_SPOT_SELECTOR_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_SPOT_SELECTOR,
    css: MarketplaceSportSelectorCss,
    pages: [MarketplacePage.SPOT_SCHEDULING],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_SPOT_SELECTOR_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme }) => {
  const componentProps = usePropsFromVariation();
  return <MarketplaceSpotSelector {...componentProps} theme={theme} />;
});
