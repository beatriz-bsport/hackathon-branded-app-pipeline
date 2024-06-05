import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import Button from '#Fabrique/Button';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
// @ts-expect-error
import AlertCss from './styles.css?raw';
import Alert, { AlertSeverity } from '.';

const VariationRegistry = [
  {
    label: 'alertSeverity',
    choices: [
      {
        label: `alert.${AlertSeverity.SUCCESS}`,
        value: AlertSeverity.SUCCESS,
      },
      {
        label: `alert.${AlertSeverity.INFO}`,
        value: AlertSeverity.INFO,
      },
      {
        label: `alert.${AlertSeverity.WARNING}`,
        value: AlertSeverity.WARNING,
      },
      {
        label: `alert.${AlertSeverity.ERROR}`,
        value: AlertSeverity.ERROR,
      },
    ],
    default: {
      label: `alert.${AlertSeverity.SUCCESS}`,
      value: AlertSeverity.SUCCESS,
    },
  },
  {
    label: 'alertWithAction',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: {
      label: 'false',
      value: 'false',
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): React.ComponentProps<typeof Alert> => {
  const severity =
    variationsSelected?.alertSeverity?.value ?? AlertSeverity.SUCCESS;

  const withActionElement =
    variationsSelected?.alertWithAction?.value === 'true';

  const message = faker.lorem.sentence(40);
  const buttonText = faker.lorem.word(5);
  return {
    // @ts-expect-error
    severity,
    children: message,
    ...(withActionElement
      ? { actionElement: <Button> {buttonText}</Button> }
      : {}),
  };
};

export const ALERT_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.ALERT,
  css: AlertCss,
  pages: [MarketplacePage.COMMON],
  defaultState: {},
  variations: VariationRegistry,
};

export const ALERT_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <Alert {...componentProps} />;
});
