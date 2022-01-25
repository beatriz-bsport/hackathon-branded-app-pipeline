import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Typography } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { PriceField, SwitchField } from '../../../components/forms';

export const InstalmentPaymentAdvancedForm = () => {
  const { t } = useTranslation('instalmentPayment');
  const classes = useStyles();
  return (
    <div className={classes.padding}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.row}>
            <Settings className={classes.icon} />
            <Typography variant="h6">{t('form.advanced')}</Typography>
          </div>
        </Grid>
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
      </Grid>
    </div>
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
  padding: {
    padding: theme.spacing(4),
  },
}));
export default InstalmentPaymentAdvancedForm;
