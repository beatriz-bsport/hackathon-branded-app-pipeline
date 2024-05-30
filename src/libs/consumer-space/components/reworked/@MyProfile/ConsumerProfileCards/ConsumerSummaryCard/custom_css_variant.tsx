import React from 'react';

import ConsumerSummaryCard from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConsumerSummaryCardCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import { MemberFactory } from '#src/libs/member/factories/Member';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import type { ConsumerSummaryCardProps } from '#libs/consumer-space/components/reworked/@MyProfile/types';

const member = MemberFactory({});

const emptyFn = () => {};

const defaultProps: Omit<
  ConsumerSummaryCardProps,
  'acceptEmail' | 'acceptSms'
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
  totalUnpaidAmount: member.total_unpaid_amount,
  handleToggleBarcodeModal: emptyFn,
  spiviPrivacySettingsLoading: false,
  updateSpiviPrivacySettings: emptyFn,
  isMobile: false,
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
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return (
    <div>
      <ConsumerSummaryCard {...componentProps} {...defaultProps} />
    </div>
  );
});
