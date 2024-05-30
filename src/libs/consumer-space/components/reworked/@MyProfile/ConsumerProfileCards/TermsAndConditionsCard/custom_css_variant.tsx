import React from 'react';

import { DateTime } from 'luxon';
import TermsAndConditionsCard from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import TermsAndConditionsCardCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

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
    const emptyFn = () => {};

    return (
      <TermsAndConditionsCard
        dateJoined={date}
        generalTermsAndConditionsDateAccepted={date}
        openTermsAndConditionsDialog={emptyFn}
        openTermsOfUseDialog={emptyFn}
      />
    );
  });
