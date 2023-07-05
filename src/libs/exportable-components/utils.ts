import { TFunction } from 'i18next';
import {
  EXPORTABLE_COMPONENTS,
  EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
  CSS_COMPONENTS,
} from './constants';
import EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE from './components/settings';

import { MarketplacePage, VariantionConfiguration } from './types';

export const getDefaultTitleForComponent = (
  componentType: string,
  tAll: TFunction,
) => {
  return tAll(
    EXPORTABLE_COMPONENTS.find((mc) => mc.identifier === componentType)
      ?.label || componentType,
  );
};

export const getDefaultConfigByIdentifier = (identifier: string) => {
  const component = EXPORTABLE_COMPONENTS.find(
    (ec) => ec.identifier === identifier,
  );
  if (!component || !component.defaultConfig) return {};
  return component.defaultConfig;
};

// @ts-ignore
export const checkExportableComponentConfig = (componentType, config) => {
  const errors = { privateService: '', playlist: '' };

  if (componentType === EXPORTABLE_COMPONENT_TYPE_PLAYLIST && config.playlist) {
    const { playlistId } = config.playlist;
    if (playlistId === undefined || playlistId === null || playlistId === -1) {
      errors.playlist = 'marketplaceSettings.createDialog.noPlaylistError'; // will be translated in settings namespace
    }
  }

  if (
    componentType === EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE &&
    config.privateService
  ) {
    let typeValue = config.privateService.type;

    if (!typeValue) {
      if (typeof config.privateService.serviceId === 'number') {
        typeValue = 'detail';
      } else {
        typeValue = 'list';
      }
    }

    const { serviceId } = config.privateService;

    if (
      typeValue === 'detail' &&
      (serviceId === undefined || serviceId === null || serviceId === -1)
    ) {
      errors.playlist = 'marketplaceSettings.createDialog.noServiceError'; // will be translated in settings namespace
    }
  }
  return errors;
};

export const EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS = Object.keys(
  EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE,
);

export const getCssComponentsForPage = (page: MarketplacePage) => {
  return CSS_COMPONENTS.filter((c) => c.pages.includes(page));
};

export const getCssComponentByLabel = (label: string) => {
  return (
    CSS_COMPONENTS.find((c) => c.label === label) ?? {
      css: '',
      label: '',
      pages: [] as MarketplacePage[],
      showAsFlex: false,
      defaultState: {},
      variations: [] as VariantionConfiguration[],
    }
  );
};
