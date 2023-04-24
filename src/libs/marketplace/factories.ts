// @ts-nocheck

import { MarketplaceSettings } from './types';

function random_int(max: number) {
  return Math.floor(Math.random() * max);
}

const titles = [
  'Class Timetable',
  'Workshops',
  'Appointments',
  'Pricing Options',
  'VOD',
  'Memberships',
  'Shop',
];

const component_types = [
  'calendar',
  'workshop',
  'privateService',
  'pass',
  'vod',
  'subscription',
  'shop',
];

export const marketplaceSettingsFactory = (length?: number) => {
  const marketplaceSettings: MarketplaceSettings = {
    id: random_int(9999),
    company: random_int(999),
    is_custom: true,
    config: [],
  };
  for (let i = 0; i < (length || titles.length); i += 1) {
    marketplaceSettings.config.push(
      i < titles.length
        ? {
            title: titles[i],
            component_type: component_types[i],
            index: i,
            config: {},
          }
        : {
            title: `Onglet+${i + 1}`,
            component_type: `onglet${i + 1}`,
            index: i,
            config: {},
          },
    );
  }
  return marketplaceSettings;
};
