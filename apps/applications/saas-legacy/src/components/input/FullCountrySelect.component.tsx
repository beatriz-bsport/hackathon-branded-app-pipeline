import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { countries } from '#src/i18n/utils/countries';

type FullCountrySelectProps = {
  value: string;
  onChange: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => void;
  label: string;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
};

const getFlagPath = (countryCode: string): string => {
  try {
    return require(`#src/components/input/flags/${countryCode}.png`);
  } catch {
    return '';
  }
};

/**
 * FullCountrySelect - A country selector component that includes all countries.
 *
 * This component is different from CountrySelector.component.tsx, which only
 * includes a limited set of countries (FR, DE, AT, BE, IE, NL, IT, ES, PT, CZ).
 * FullCountrySelect uses the full countries list from #src/i18n/utils/countries
 * and displays all available countries with flags, sorted alphabetically.
 *
 * @param value - The ISO country code of the currently selected country (e.g., 'FR', 'ES', 'US').
 * @param onChange - Callback function invoked when the user selects a different country. Receives a React change event with the new country code as the value.
 * @param label - The text label displayed above the select input field.
 * @param required - If true, marks the field as required and adds visual indication.
 */
const FullCountrySelect: React.FC<FullCountrySelectProps> = ({
  value,
  onChange,
  label,
  id = 'country-select',
  name = 'country',
  required = false,
  autoComplete = 'country',
  className,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('login');

  const sortedCountries = useMemo(
    () =>
      countries
        .map((country) => ({
          ...country,
          translatedLabel: t(`country.${country.code}`, {
            defaultValue: country.label,
          }),
          flagPath: getFlagPath(country.code),
        }))
        .sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel)),
    [t],
  );

  return (
    <FormControl
      className={className || classes.formControl}
      required={required}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        autoComplete={autoComplete}
        classes={{ select: classes.countrySelect }}
        id={id}
        name={name}
        onChange={onChange}
        value={value}
      >
        {sortedCountries.map((country) => (
          <MenuItem
            key={country.code}
            className={classes.countrySelect}
            value={country.code}
          >
            {country.flagPath && (
              <img
                alt={country.code}
                className={classes.countryFlag}
                src={country.flagPath}
              />
            )}
            {country.translatedLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  formControl: {
    width: '100%',
  },
  countrySelect: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  countryFlag: {
    width: 21,
    height: 15,
  },
}));

export default FullCountrySelect;
