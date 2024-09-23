import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { referralProgramFactory } from '#src/libs/referral/factories/ReferralProgram';
// @ts-expect-error
import ReferralCardCss from './styles.css?raw';
import ReferralCard from '.';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import type { ReferralCardProps } from './types';

const referralProgramMock = referralProgramFactory();

const referralCardVariationRegistry = [
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
): ReferralCardProps => {
  const hasUnknownError = variationsSelected?.state?.value === 'unknownError';
  const isLoading = variationsSelected?.state?.value === 'loading';
  const isAuthenticated = variationsSelected?.state?.value === 'authenticated';
  const isReferralProgramAvailable =
    variationsSelected?.isReferralProgramAvailable?.value === 'true';
  const hasRemainingReferralUses =
    variationsSelected?.hasRemainingReferralUses?.value === 'true';

  return {
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

export const REFERRAL_CARD_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.CONSUMER_REFERRAL_CARD,
  css: ReferralCardCss,
  pages: [MarketplacePage.CONSUMER_SPACE],
  defaultState: {},
  variations: referralCardVariationRegistry,
};

export const REFERRAL_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const { t } = useTranslation('widget');

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
      <Alert severity="info" style={{ alignItems: 'center' }}>
        {t('widget.cssConfig.authenticationTextField', {
          component_name: t('widget.components.referral_details'),
          page: t('widget.page.referral_details'),
        })}
      </Alert>
      <ReferralCard {...componentProps} />
    </div>
  );
});
