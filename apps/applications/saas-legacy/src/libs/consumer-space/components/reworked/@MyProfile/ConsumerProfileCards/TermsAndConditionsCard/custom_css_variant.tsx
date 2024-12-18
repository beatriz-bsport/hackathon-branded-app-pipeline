import React from 'react';

import { DateTime } from 'luxon';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#src/libs/exportable-components/types';
import TermsAndConditionsCard from '.';
// @ts-expect-error
import TermsAndConditionsCardCss from './styles.css?raw';

const date = DateTime.now().toFormat('D');

export const CONSUMER_TERMS_AND_CONDITIONS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_TERMS_AND_CONDITIONS,
    css: TermsAndConditionsCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: [],
  };

export const CONSUMER_TERMS_AND_CONDITIONS_CARD_PREVIEW: React.FC<{}> =
  React.memo(() => {
    return (
      <TermsAndConditionsCard
        dateJoined={date}
        generalTermsAndConditionsDateAccepted={date}
        generalTermsOfUseDateAccepted={date}
        isLoading={false}
      />
    );
  });
