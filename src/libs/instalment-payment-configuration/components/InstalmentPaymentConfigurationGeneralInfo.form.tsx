import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import {
  TextFieldEnhancedLabelWithError,
  PriceField,
} from '../../../components/forms';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { generateInfo, generateRecurrencyString } from '../utils';
import { ANUAL, DAILY, MONTHLY, WEEKLY } from '../constants';

type OwnProps = {
  recurrency: 1 | 2 | 3 | 4;
  frequency: number;
  number_of_billing: number;
  hideFee?: boolean;
};
type Props = OwnProps;
export const InstalmentPaymentGeneralInfoForm: React.FC<Props> = (props) => {
  const { t } = useTranslation('instalmentPayment');
  const classes = useStyles();
  const { recurrency, frequency, number_of_billing } = props;
  const RECURRENCY_OPTIONS = [
    { value: DAILY, label: t('form.recurrency.daily') },
    { value: WEEKLY, label: t('form.recurrency.weekly') },
    { value: MONTHLY, label: t('form.recurrency.montly') },
    { value: ANUAL, label: t('form.recurrency.annual') },
  ];

  return (
    <>
      <div className={classes.padding}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>
              {t('form.create')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.row}>
              <div className={classes.icon}>
                <Info />
              </div>
              <Typography variant="h6">{t('form.generalInfo')}</Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextFieldEnhancedLabelWithError
              id="name"
              fullWidth
              name="name"
              required
              label={t('form.name')}
            />
          </Grid>
          <Grid item xs={6}>
            <MaterialUiSingleSelectorField
              inScrollBar
              name="recurrency"
              options={RECURRENCY_OPTIONS}
              title={
                <Typography variant="subtitle1">
                  {t('form.recurrency.title')}
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={12}>
            <div className={classes.rowWithGap}>
              <Typography>{t('form.frequency.start')}</Typography>

              <div className={classes.shrink}>
                <TextFieldEnhancedLabelWithError
                  id="frequency"
                  type="number"
                  fullWidth
                  name="frequency"
                  required
                  variant="outlined"
                />
              </div>
              <Typography>
                {generateRecurrencyString(t, recurrency, 2)}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <TextFieldEnhancedLabelWithError
              id="number_of_billing"
              type="number"
              fullWidth
              name="number_of_billing"
              required
              label={t('form.numberOfBilling')}
            />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={12}>
            <div className={classes.row}>
              <Info color="primary" className={classes.iconUncolored} />

              <Typography variant="body2">
                {generateInfo(t, recurrency, frequency, number_of_billing)}
              </Typography>
            </div>
          </Grid>
          {!props.hideFee && (
            <Grid item xs={6}>
              <PriceField
                id="fee"
                type="number"
                fullWidth
                name="fee"
                required
                label={t('form.fee')}
                helperText={t('form.feeHelperText')}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  shrink: {
    width: theme.spacing(8),
    minWidth: theme.spacing(8),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  rowWithGap: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  iconUncolored: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 500,
  },
  padding: {
    padding: theme.spacing(4),
  },
}));
export default InstalmentPaymentGeneralInfoForm;
