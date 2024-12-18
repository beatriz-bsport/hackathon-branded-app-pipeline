import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, Collapse, Grid, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SettingsIcon from '@material-ui/icons/Settings';
import InputAdornment from '@material-ui/core/InputAdornment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { InstalmentPaymentApi } from '#src/libs/instalment-payment-configuration/types';
import {
  CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
} from '#src/libs/instalment-payment-configuration/constants';
import {
  PriceField,
  SwitchField,
  RadioGroupField,
  TextField,
  // @ts-expect-error
} from '../../../components/forms';

export const InstalmentPaymentAdvancedForm = () => {
  const { t } = useTranslation('instalmentPayment');
  const classes = useStyles();
  const [openAdvancedOptions, setOpenAdvancedOptions] =
    useState<boolean>(false);

  const toggleOpenAdvancedOptions = useCallback(
    () => setOpenAdvancedOptions(!openAdvancedOptions),
    [setOpenAdvancedOptions, openAdvancedOptions],
  );

  const { values } = useFormikContext<InstalmentPaymentApi>();

  return (
    <>
      <div className={classes.advancedOptionsSection}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div className={classes.row}>
              <ButtonBase
                className={classes.advancedOptionsHeader}
                onClick={toggleOpenAdvancedOptions}
              >
                <SettingsIcon className={classes.icon} />
                <Typography variant="h6">{t('form.advanced')}</Typography>
                {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ButtonBase>
            </div>
          </Grid>
          <Collapse in={openAdvancedOptions}>
            <div className={classes.padding}>
              <Grid item xs={6}>
                <PriceField
                  fullWidth
                  required
                  helperText={t('form.minimumAmountHelperText')}
                  id="minimum_amount"
                  label={t('form.minimum_amount')}
                  name="minimum_amount"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.column}>
                  <SwitchField
                    label={t('form.onlyAvailable')}
                    name="is_only_available_when_all_items_are_compatible"
                  />

                  <Typography color="textSecondary" variant="body2">
                    {t('form.onlyAvailableInfo')}
                  </Typography>
                </div>
              </Grid>
            </div>

            {!values.partial_payment_enabled && (
              <div className={classes.padding}>
                <SwitchField
                  label={t('form.customInstalmentAmount.label')}
                  name="custom_first_instalment_enabled"
                />

                {values.custom_first_instalment_enabled && (
                  <RadioGroupField
                    choices={[
                      {
                        label: t('form.customInstalmentAmount.type.amount'),
                        value: CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString(),
                      },
                      {
                        label: t('form.customInstalmentAmount.type.percent'),
                        value: CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString(),
                      },
                    ]}
                    className={classes.radioGroup}
                    name="custom_first_instalment_type"
                  />
                )}

                {values.custom_first_instalment_enabled &&
                  values.custom_first_instalment_type.toString() ===
                    CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString() && (
                    <TextField
                      fullWidth
                      required
                      InputProps={{
                        inputProps: { min: 0, max: 100, step: 1 },
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      label={t(
                        'form.customInstalmentAmount.amountHelperText.percent',
                      )}
                      max={100}
                      name="custom_first_instalment_percent"
                      type="number"
                    />
                  )}

                {values.custom_first_instalment_enabled &&
                  values.custom_first_instalment_type.toString() ===
                    CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString() && (
                    <PriceField
                      fullWidth
                      required
                      label={t(
                        'form.customInstalmentAmount.amountHelperText.amount',
                      )}
                      name="custom_first_instalment_amount"
                    />
                  )}
              </div>
            )}
          </Collapse>
        </Grid>
      </div>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  advancedOptionsSection: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  padding: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  radioGroup: {
    marginBottom: theme.spacing(1),
  },
}));
export default InstalmentPaymentAdvancedForm;
