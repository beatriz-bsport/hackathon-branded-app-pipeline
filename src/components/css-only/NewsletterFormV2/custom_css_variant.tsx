import React from 'react';

import NewsletterForm, { Props as NewsletterFormProps } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import NewsletterFormCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { NewsletterV2FieldsKind } from '#libs/marketplace/constants';

const newsletterFormV2VariationRegistry = [
  {
    label: 'newsletterV2FieldsType',
    choices: [
      {
        label: NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL,
        value: NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL,
      },
      {
        label: NewsletterV2FieldsKind.FIRST_NAME_AND_EMAIL,
        value: NewsletterV2FieldsKind.FIRST_NAME_AND_EMAIL,
      },
      {
        label: NewsletterV2FieldsKind.EMAIL_ONLY,
        value: NewsletterV2FieldsKind.EMAIL_ONLY,
      },
    ],
    default: {
      label: NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL,
      value: NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL,
    },
  },
  {
    label: 'showTitle',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showSubtitle',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): NewsletterFormProps => {
  const fieldsTypeSelected = variationsSelected?.newsletterV2FieldsType
    ?.value as `${NewsletterV2FieldsKind}`;
  const isShowTitleSelected = variationsSelected?.showTitle.value === 'true';
  const isShowSubtitleSelected =
    variationsSelected?.showSubtitle.value === 'true';
  return {
    fieldsType: fieldsTypeSelected,
    showTitle: isShowTitleSelected,
    showSubtitle: isShowSubtitleSelected,
    onSubmit: () => {},
  };
};

export const MARKETING_NEWSLETTER_FORM_V2_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETING_NEWSLETTER_FORM_V2,
    css: NewsletterFormCss,
    pages: [MarketplacePage.MARKETING],
    defaultState: {},
    variations: newsletterFormV2VariationRegistry,
  };

export const MARKETING_NEWSLETTER_FORM_V2_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <NewsletterForm {...componentProps} />;
});
