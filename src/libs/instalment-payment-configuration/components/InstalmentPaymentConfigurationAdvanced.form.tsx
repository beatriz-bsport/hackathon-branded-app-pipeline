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
import { InstalmentPaymentApi } from '#libs/instalment-payment-configuration/types';
import {
  CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
} from '#libs/instalment-payment-configuration/constants';
import {
  PriceField,
  SwitchField,
  RadioGroupField,
  TextField,
  // @ts-ignore
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
                onClick={toggleOpenAdvancedOptions}
                className={classes.advancedOptionsHeader}
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
                  id="minimum_amount"
                  type="number"
                  fullWidth
                  name="minimum_amount"
                  required
                  label={t('form.minimum_amount')}
                  helperText={t('form.minimumAmountHelperText')}
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.column}>
                  <SwitchField
                    name="is_only_available_when_all_items_are_compatible"
                    label={t('form.onlyAvailable')}
                  />

                  <Typography variant="body2" color="textSecondary">
                    {t('form.onlyAvailableInfo')}
                  </Typography>
                </div>
              </Grid>
            </div>

            {!values.partial_payment_enabled && (
              <div className={classes.padding}>
                <SwitchField
                  name="custom_first_instalment_enabled"
                  label={t('form.customInstalmentAmount.label')}
                />

                {values.custom_first_instalment_enabled && (
                  <RadioGroupField
                    className={classes.radioGroup}
                    name="custom_first_instalment_type"
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
                  />
                )}

                {values.custom_first_instalment_enabled &&
                  values.custom_first_instalment_type.toString() ===
                    CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString() && (
                    <TextField
                      fullWidth
                      name="custom_first_instalment_percent"
                      label={t(
                        'form.customInstalmentAmount.amountHelperText.percent',
                      )}
                      type="number"
                      required
                      max={100}
                      InputProps={{
                        inputProps: { min: 0, max: 100, step: 1 },
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  )}

                {values.custom_first_instalment_enabled &&
                  values.custom_first_instalment_type.toString() ===
                    CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString() && (
                    <PriceField
                      fullWidth
                      name="custom_first_instalment_amount"
                      label={t(
                        'form.customInstalmentAmount.amountHelperText.amount',
                      )}
                      required
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
