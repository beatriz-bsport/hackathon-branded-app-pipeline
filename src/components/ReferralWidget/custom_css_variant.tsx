import React from 'react';

import ReferralWidget, { Props as ReferralWidgetProps } from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ReferralWidgetCss from './styles.css?raw';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { referralProgramFactory } from '#libs/referral/factories/ReferralProgram';

const referralProgramMock = referralProgramFactory();

const referralDetailsVariationRegistry = [
  {
    label: 'state',
    choices: [
      { label: 'authenticated', value: 'authenticated' },
      { label: 'unauthenticated', value: 'unauthenticated' },
      { label: 'loading', value: 'loading' },
      { label: 'unknownError', value: 'unknownError' },
    ],
    default: { label: 'authenticated', value: 'authenticated' },
  },
  {
    label: 'isReferralProgramAvailable',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'hasRemainingReferralUses',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];
const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): ReferralWidgetProps => {
  const hasUnknownError = variationsSelected?.state?.value === 'unknownError';
  const isLoading = variationsSelected?.state?.value === 'loading';
  const isAuthenticated = variationsSelected?.state?.value === 'authenticated';
  const isReferralProgramAvailable =
    variationsSelected?.isReferralProgramAvailable?.value === 'true';
  const hasRemainingReferralUses =
    variationsSelected?.hasRemainingReferralUses?.value === 'true';

  return {
    onLoginClick: () => {},
    hasUnknownError,
    isLoading,
    isAuthenticated,
    referralProgram: isReferralProgramAvailable
      ? referralProgramMock
      : undefined,
    nbRemainingReferralUses: hasRemainingReferralUses
      ? referralProgramMock.maximum_referral_uses
      : 0,
    referralLink: 'here your referral link',
  };
};

export const REFERRAL_DETAILS_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.REFERRAL_DETAILS,
  css: ReferralWidgetCss,
  pages: [MarketplacePage.REFERRAL_DETAILS],
  defaultState: {},
  variations: referralDetailsVariationRegistry,
};

export const REFERRAL_DETAILS_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <ReferralWidget {...componentProps} />
    </div>
  );
});
