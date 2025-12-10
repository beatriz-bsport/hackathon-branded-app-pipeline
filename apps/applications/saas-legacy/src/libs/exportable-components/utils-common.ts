/**
 * Common utilities that don't require CSS_COMPONENTS (and thus don't load faker).
 * Import from this file for components in the main bundle.
 */
import { TFunction } from 'i18next';
import {
  EXPORTABLE_COMPONENTS,
  EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
} from './constants';

import EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE from './components/settings';

export const getDefaultTitleForComponent = (
  componentType: string,
  tAll: TFunction,
) => {
  return tAll(
    EXPORTABLE_COMPONENTS.find((mc) => mc.identifier === componentType)
      ?.label || componentType,
  );
};

export const getDefaultMarketplaceTabTitle = (
  componentType: string,
  t: TFunction,
) => {
  return t(`marketplace:defaultTabTitle.${componentType}`);
};

export const getDefaultConfigByIdentifier = (identifier: string) => {
  const component = EXPORTABLE_COMPONENTS.find(
    (ec) => ec.identifier === identifier,
  );
  if (!component || !component.defaultConfig) return {};
  return component.defaultConfig;
};

// @ts-expect-error
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
      errors.privateService = 'marketplaceSettings.createDialog.noServiceError'; // will be translated in settings namespace
    }
  }
  return errors;
};

export const EXPORTABLE_COMPONENT_WITH_ADVANCED_SETTINGS = Object.keys(
  EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE,
);
