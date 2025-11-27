import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import { MemberFactory } from '#src/libs/member/factories/Member';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import type { ConsumerSummaryCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import { CompanyTheme } from '#src/libs/theme/types';

// @ts-expect-error
import ConsumerSummaryCardCss from './styles.css?raw';
import ConsumerSummaryCard from '.';

const member = MemberFactory({});

const emptyFn = () => {};

const defaultProps: Omit<
  ConsumerSummaryCardProps,
  | 'acceptEmail'
  | 'acceptSms'
  | 'showAccountBalance'
  | 'showBarcodeButton'
  | 'showMembershipNumber'
> = {
  address: {
    address_line_1: 'Carrer de la Diputacio, 7',
    address_line_2: '2/1A',
    city: 'Barcelona',
    country: 'Spain',
    state: null,
    zipcode: '08012',
  },
  birthday: member.birthday,
  companyId: 1,
  creditAccountBalance: member.credit_account_balance,
  email: member.email,
  emergencyContact: member.emergency_contact,
  firstName: member.firstname,
  gender: member.gender,
  lastName: member.lastname,
  memberId: member.id,
  membershipId: member.membership_ID,
  officialDocumentId: member.official_document_id,
  phoneNumber: member.official_document_id,
  photo: member.photo,
  spiviPrivacySettingsAccepted: member.spivi_privacy_settings_accepted,
  spiviPrivacySettingsLoading: false,
  updateSpiviPrivacySettings: emptyFn,
  isLoading: false,
  regularizeBalanceAllowed: false,
};

const ConsumerSummaryCardVariationRegistry = [
  {
    label: 'acceptEmail',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'acceptSms',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

export const CONSUMER_SUMMARY_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_SUMMARY_CARD,
    css: ConsumerSummaryCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerSummaryCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
) => {
  const acceptEmail = variationsSelected?.acceptEmail?.value === 'true';
  const acceptSms = variationsSelected?.acceptSms?.value === 'true';
  return {
    acceptEmail,
    acceptSms,
  };
};

export const CONSUMER_SUMMARY_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <div>
      <ConsumerSummaryCard
        {...componentProps}
        {...defaultProps}
        showAccountBalance={theme?.show_member_account_balance}
        showBarcodeButton={theme?.show_barcode_button}
        showMembershipNumber={theme?.show_membership_number}
      />
    </div>
  );
});
