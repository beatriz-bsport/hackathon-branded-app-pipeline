import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { FormikProps } from 'formik';
import type {
  FormValues,
  FormFieldConfig,
} from '#src/libs/invoice/verifactu/types';
import FullCountrySelect from '#src/components/input/FullCountrySelect.component';

type VerifactuFormFieldsProps = {
  formikProps: FormikProps<FormValues>;
};

const formFieldConfigs: FormFieldConfig[] = [
  {
    name: 'first_name',
    labelKey: 'configuration.verifactu.form.first_name',
    xs: 6,
    hasError: true,
  },
  {
    name: 'last_name',
    labelKey: 'configuration.verifactu.form.last_name',
    xs: 6,
    hasError: true,
  },
  {
    name: 'dni_nie',
    labelKey: 'configuration.verifactu.form.dni_nie',
    xs: 12,
  },
  {
    name: 'address',
    labelKey: 'configuration.verifactu.form.address',
    xs: 9,
  },
  {
    name: 'street_number',
    labelKey: 'configuration.verifactu.form.street_number',
    xs: 3,
  },
  {
    name: 'postal_code',
    labelKey: 'configuration.verifactu.form.postal_code',
    xs: 3,
  },
  { name: 'city', labelKey: 'configuration.verifactu.form.city', xs: 9 },
  {
    name: 'municipality',
    labelKey: 'configuration.verifactu.form.municipality',
    xs: 6,
  },
];

const VerifactuFormFields: React.FC<VerifactuFormFieldsProps> = ({
  formikProps,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');

  return (
    <Grid container className={classes.formGrid} spacing={2}>
      {formFieldConfigs.map((fieldConfig) => {
        const fieldId = `verifactu-${fieldConfig.name}`;
        return (
          <Grid key={fieldConfig.name} item xs={fieldConfig.xs}>
            <FormControl
              required
              className={classes.formControl}
              error={!!formikProps.errors[fieldConfig.name]}
            >
              <InputLabel htmlFor={fieldId}>
                {t(fieldConfig.labelKey)}
              </InputLabel>
              <Input
                id={fieldId}
                name={fieldConfig.name}
                onBlur={
                  // Only validate on blur for fields with error handling or DNI/NIE
                  // (which has custom Spanish validation)
                  fieldConfig.hasError || fieldConfig.name === 'dni_nie'
                    ? formikProps.handleBlur
                    : undefined
                }
                onChange={formikProps.handleChange}
                value={formikProps.values[fieldConfig.name]}
              />
              {formikProps.errors[fieldConfig.name] && (
                <FormHelperText error>
                  {typeof formikProps.errors[fieldConfig.name] === 'string'
                    ? t(formikProps.errors[fieldConfig.name] as string)
                    : String(formikProps.errors[fieldConfig.name])}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        );
      })}

      <Grid item xs={6}>
        <FullCountrySelect
          required
          id="verifactu-country"
          label={t('configuration.verifactu.form.country')}
          name="country"
          onChange={formikProps.handleChange}
          value={formikProps.values.country}
        />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  formGrid: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  formControl: {
    width: '100%',
  },
}));

export default VerifactuFormFields;
