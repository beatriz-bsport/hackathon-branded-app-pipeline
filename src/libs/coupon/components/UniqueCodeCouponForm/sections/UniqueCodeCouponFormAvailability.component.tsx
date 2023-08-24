import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import Checkbox from '@material-ui/core/Checkbox';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DatePicker from 'material-ui-pickers/DatePicker';
import MomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import { UniqueCodeCouponCreationPayload } from '#libs/coupon/types';
import FormSection from '#components/forms/FormSection';
import { DATE_PICKER_MASK } from '../../../../../constants';

type Props = {
  isProcessing: boolean;
  withExpirationDate: boolean;
  setWithExpirationDate: React.Dispatch<React.SetStateAction<boolean>>;
};

const UniqueCodeCouponFormAvailability: React.FC<Props> = ({
  isProcessing,
  withExpirationDate,
  setWithExpirationDate,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const { values, setFieldValue, errors } =
    useFormikContext<UniqueCodeCouponCreationPayload>();

  const handleIsActiveChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('is_active', event.target.checked);
      setWithExpirationDate(false);
    },
    [setFieldValue, setWithExpirationDate],
  );

  const handleWithExpirationDate = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setWithExpirationDate(event.target.checked);
      if (!withExpirationDate) {
        setFieldValue('expiration_date', null);
      }
    },
    [setFieldValue, withExpirationDate, setWithExpirationDate],
  );

  const handleExpirationDateChange = useCallback(
    (date) => setFieldValue('expiration_date', date),
    [setFieldValue],
  );

  const getDatePickerMask = useCallback((value) => {
    if (value) {
      return DATE_PICKER_MASK;
    }
    return [];
  }, []);

  const isDatePickerDisabled =
    !withExpirationDate || !values.is_active || isProcessing;

  const initialFocusedDate = moment().format('L');

  return (
    <FormSection
      id="unique-code-coupon-form-availability"
      sectionTitle={t('form.section.availability')}
    >
      <FormControl disabled={isProcessing}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.is_active}
              id="unique-code-coupon-form-is-active-checkbox"
              onChange={handleIsActiveChange}
            />
          }
          label={t('form.is_active.label')}
        />
        <FormHelperText>{t('form.is_active.helperText')}</FormHelperText>
      </FormControl>
      <div className={classes.field}>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Checkbox
                checked={withExpirationDate}
                disabled={!values?.is_active || isProcessing}
                id="unique-code-coupon-form-with-expiration-checkbox"
                onChange={handleWithExpirationDate}
              />
            }
            label={t('form.with_expiration_date.label')}
          />
          <div className={classes.dateField}>
            <MuiPickersUtilsProvider
              locale={moment.locale()}
              moment={moment}
              utils={MomentUtils}
            >
              <DatePicker
                clearable
                keyboard
                cancelLabel={t('form.expiration_date.cancel')}
                clearLabel={t('form.expiration_date.clear_date')}
                disabled={isDatePickerDisabled}
                error={
                  errors.expiration_date ===
                  'coupon:uniqueCodeCoupon.form.errors.expirationDate'
                }
                format="L"
                id="unique-code-coupon-form-expiration-date-input"
                initialFocusedDate={initialFocusedDate}
                label={t('form.expiration_date.label')}
                mask={getDatePickerMask}
                minDate={moment()}
                onChange={handleExpirationDateChange}
                value={values.expiration_date}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dateField: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default React.memo(UniqueCodeCouponFormAvailability);
