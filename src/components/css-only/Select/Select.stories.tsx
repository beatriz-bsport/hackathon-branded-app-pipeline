// @ts-nocheck
import React from 'react';

import { Props, SelectForStorybook } from '#components/css-only/Select';
import { PaymentPackStorybookListFactory } from '#libs/payment-packs/factory';
import { LOCALE_LIST } from '../../input/LocaleSelector.component.tsx';

import './style.css';
import { useTranslation } from 'react-i18next';

const options: { label: string; value: string }[] =
  PaymentPackStorybookListFactory(20).map((paymentPack) => ({
    label: paymentPack.name,
    value: paymentPack.id.toString(),
  }));

const SelectTemplate = (args: Props) => <SelectForStorybook {...args} />;
const CountrySelectTemplate = (args: Props) => {
  const { t } = useTranslation('login');
  return (
    <SelectForStorybook
      options={LOCALE_LIST.map((localeContainer) => {
        const [_, country] = localeContainer.locale.split('_');
        return {
          label: t(`country.${country}`),
          value: country,
          metaData: {
            locale: localeContainer.locale,
            icon: localeContainer.icon,
          },
        };
      })}
      renderListItem={(option: {
        label: string;
        value: string;
        metaData: { locale: string; icon: string };
      }) => (
        <div className="bs-select__dropdown__list__item__with__indicator">
          <img
            className="bs-select_dropdown__list__item__indicator"
            alt={option.metaData.locale}
            src={option.metaData.icon}
          />
          {option.label}
        </div>
      )}
      {...args}
    />
  );
};

export const IdleSelect = SelectTemplate.bind({});
IdleSelect.args = {
  placeholder: 'Select your pass',
  options,
  value: null,
  onChange: () => {},
};

export const SelectWithValue = SelectTemplate.bind({});
SelectWithValue.args = {
  placeholder: 'Select your pass',
  options,
  isClearable: true,
  value: '1',
  onChange: () => {},
};

export const CountrySelect = CountrySelectTemplate.bind({});
CountrySelect.args = {
  fullWidth: true,
  classes: { buttonContainer: 'bs-select__button__square' },
  value: 'FR',
  placeholder: 'Select a country',
  onChange: (country: string) =>
    handleChangeBillingDetails(country, 'address.country'),
};

export default {
  title: 'Components/CssOnly/Select',
  component: SelectForStorybook,
  argTypes: {
    onChange: { action: 'onChange' },
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      page: null,
    },
  },
};
