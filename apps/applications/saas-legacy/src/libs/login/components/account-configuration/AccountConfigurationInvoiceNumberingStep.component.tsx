import React, { useEffect, useMemo, useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { DateTime } from 'luxon';
import AccountConfigurationStepper from './AccountConfigurationStepper.component';
import { buildSteps } from './utils';
import { useTheme } from '#src/pages/marketplace/passes/hooks/useTheme';
import { useSequentialNumberingStatus } from '#src/libs/invoice/hooks/useSequentialNumberingStatus';

type OwnProps = {
  goNext: () => void;
  goPrevious?: () => void;
  onConfirm: (
    prefix: string,
    suffix: string,
    dateFormat: 'year_only' | 'year_month',
  ) => Promise<void>;
  has_no_need_for_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
};
type Props = OwnProps;

export const AccountConfigurationInvoiceNumberingStep: React.FC<Props> = ({
  goNext,
  goPrevious,
  onConfirm,
  has_no_need_for_stripe_configuration,
  has_no_need_for_bank_account_configuration,
  has_no_need_for_payment_method_configuration,
}) => {
  const { t } = useTranslation(['login', 'common', 'b2b_invoice']);
  const classes = useStyles();
  const theme = useTheme();
  const timezone = theme.timezone_name;

  const {
    legalIdentifierActivated,
    invoicePrefix,
    invoiceSuffix,
    invoiceIdentifierFormat,
  } = useSequentialNumberingStatus();

  const [prefix, setPrefix] = useState(invoicePrefix || '');
  const [dateFormat, setDateFormat] = useState(
    invoiceIdentifierFormat === 1 ? 'year_only' : 'year_month',
  );
  const [suffix, setSuffix] = useState(invoiceSuffix || '');
  const [isConfirmed, setIsConfirmed] = useState(legalIdentifierActivated);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already activated on mount and populate form
  // Note: In onboarding flow, if already activated, user should skip this step.
  // This handles edge cases where user navigates back or revisits the step.
  useEffect(() => {
    if (legalIdentifierActivated) {
      setIsConfirmed(true);
      if (invoicePrefix) {
        setPrefix(invoicePrefix);
      }
      if (invoiceSuffix) {
        setSuffix(invoiceSuffix);
      }
      if (invoiceIdentifierFormat) {
        setDateFormat(
          invoiceIdentifierFormat === 1 ? 'year_only' : 'year_month',
        );
      }
    } else {
      setIsConfirmed(false);
    }
  }, [
    legalIdentifierActivated,
    invoicePrefix,
    invoiceSuffix,
    invoiceIdentifierFormat,
  ]);

  const steps = React.useMemo(() => {
    return buildSteps({
      has_no_need_for_stripe_configuration,
      has_visited_stripe_configuration: true,
      has_no_need_for_bank_account_configuration,
      has_visited_bank_account_configuration: true,
      has_no_need_for_payment_method_configuration,
      has_visited_payment_method_configuration: true,
      has_visited_invoice_numbering_step: true,
      no_last_step: false,
      has_visited_last_step: false,
    });
  }, [
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  ]);

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow alphanumeric and hyphens, max 7 characters
    if (value === '' || /^[a-zA-Z0-9-]{0,7}$/.test(value)) {
      setPrefix(value);
    }
  };

  const handleSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow alphanumeric and hyphens, max 7 characters
    if (value === '' || /^[a-zA-Z0-9-]{0,7}$/.test(value)) {
      setSuffix(value);
    }
  };

  // Validation errors
  const prefixError =
    prefix !== '' && (prefix.length > 7 || !/^[a-zA-Z0-9-]*$/.test(prefix));
  const suffixError =
    suffix !== '' && (suffix.length > 7 || !/^[a-zA-Z0-9-]*$/.test(suffix));

  // Helper to build date part for invoice number
  const datePart = useMemo(() => {
    const now = DateTime.now().setZone(timezone);
    const currentYear = now.year;
    const currentMonth = String(now.month).padStart(2, '0');
    return dateFormat === 'year_only'
      ? String(currentYear)
      : `${currentYear}-${currentMonth}`;
  }, [dateFormat, timezone]);

  // Helper to build invoice number (memoized to avoid recreation)
  const buildInvoiceNumber = useMemo(() => {
    return (num: number) => {
      const prefixPart = prefix?.toUpperCase() || '';
      const suffixPart = suffix?.toUpperCase() || '';
      const numberPart = String(num).padStart(6, '0');
      // Format: {PREFIX}{DATE}-{NUMBER}{SUFFIX}
      return `${prefixPart}${datePart}-${numberPart}${suffixPart}`;
    };
  }, [prefix, datePart, suffix]);

  // Compute preview format (single number display)
  const previewFormat = useMemo(() => {
    return buildInvoiceNumber(1);
  }, [buildInvoiceNumber]);

  // Compute preview for initial display (multiple numbers)
  const preview = useMemo(() => {
    const startNum = 1; // Default starting number
    return {
      firstNumber: buildInvoiceNumber(startNum),
      restNumbers: [
        String(startNum + 1).padStart(6, '0'),
        String(startNum + 2).padStart(6, '0'),
      ],
    };
  }, [buildInvoiceNumber]);

  const handleConfirm = () => {
    if (prefixError || suffixError) return;
    setIsConfirmed(true);
  };

  const handleFinish = async () => {
    // If already activated, just navigate without API call
    if (legalIdentifierActivated) {
      goNext();
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(prefix, suffix, dateFormat as 'year_only' | 'year_month');
      goNext();
    } catch (error) {
      console.error('Failed to finish invoice numbering:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={classes.content}>
        <AccountConfigurationStepper
          className={classes.stepper}
          steps={steps}
        />
        <Typography variant="h4">
          {t('login:accountConfiguration.invoiceNumberingStep')}
        </Typography>
        {!isConfirmed ? (
          <>
            <FormControl fullWidth error={prefixError}>
              <Input
                className={classes.input}
                id="prefix-input"
                onChange={handlePrefixChange}
                placeholder={t(
                  'b2b_invoice:configuration.sequentialNumbering.prefixPlaceholder',
                )}
                value={prefix}
              />
              <FormHelperText className={classes.helperText}>
                {t(
                  'b2b_invoice:configuration.sequentialNumbering.prefixSuffixHelper',
                )}
              </FormHelperText>
            </FormControl>

            <div className={classes.radioContainer}>
              <Typography className={classes.radioLabel} variant="body2">
                {t(
                  'b2b_invoice:configuration.sequentialNumbering.dateFormatLabel',
                )}
              </Typography>
              <RadioGroup
                aria-label="date-format"
                name="date-format"
                onChange={(event) => setDateFormat(event.target.value)}
                value={dateFormat}
              >
                <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t(
                    'b2b_invoice:configuration.sequentialNumbering.dateFormatYearOnly',
                  )}
                  value="year_only"
                />
                <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t(
                    'b2b_invoice:configuration.sequentialNumbering.dateFormatYearMonth',
                  )}
                  value="year_month"
                />
              </RadioGroup>
            </div>

            <FormControl fullWidth error={suffixError}>
              <Input
                className={classes.input}
                id="suffix-input"
                onChange={handleSuffixChange}
                placeholder={t(
                  'b2b_invoice:configuration.sequentialNumbering.suffixPlaceholder',
                )}
                value={suffix}
              />
              <FormHelperText className={classes.helperText}>
                {t(
                  'b2b_invoice:configuration.sequentialNumbering.prefixSuffixHelper',
                )}
              </FormHelperText>
            </FormControl>

            {preview && (
              <div className={classes.infoBlock}>
                <div className={classes.previewContainer}>
                  <Typography component="span" variant="body2">
                    <Trans
                      components={[<strong key="bold" />]}
                      i18nKey="b2b_invoice:configuration.sequentialNumbering.previewFirstLine"
                      ns="b2b_invoice"
                      values={{ firstNumber: preview.firstNumber }}
                    />
                  </Typography>
                  <Typography component="span" variant="body2">
                    {t(
                      'b2b_invoice:configuration.sequentialNumbering.previewSecondLine',
                      { restNumbers: preview.restNumbers.join(', ') },
                    )}
                  </Typography>
                </div>
              </div>
            )}

            <div className={classes.action}>
              {goPrevious && (
                <Button onClick={goPrevious}>{t('common:previous')}</Button>
              )}
              <Button
                color="primary"
                disabled={prefixError || suffixError}
                onClick={handleConfirm}
                variant="contained"
              >
                {t('common:confirm')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={classes.infoBlock}>
              <Typography variant="body2">
                <strong>{previewFormat}</strong>
              </Typography>
            </div>

            <Alert className={classes.alert} severity="warning">
              <Typography component="p" variant="body2">
                <Trans
                  components={[<strong key="bold" />]}
                  i18nKey="b2b_invoice:configuration.sequentialNumbering.warning"
                  ns="b2b_invoice"
                />
              </Typography>
            </Alert>

            <div className={classes.action}>
              {goPrevious && (
                <Button onClick={goPrevious}>{t('common:previous')}</Button>
              )}
              <Button
                color="primary"
                disabled={isLoading}
                onClick={handleFinish}
                variant="contained"
              >
                {t('common:finish')}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  stepper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingBottom: theme.spacing(4),
      marginBottom: 'unset',
    },
  },
  subtitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  input: {
    marginTop: theme.spacing(2),
  },
  helperText: {
    marginTop: theme.spacing(0.5),
  },
  radioContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  radioLabel: {
    marginBottom: theme.spacing(1),
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
    marginTop: theme.spacing(20),
    marginLeft: '20%',
    marginRight: '20%',
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
      backgroundColor: 'unset',
      boxShadow: 'unset',
      marginLeft: '4px',
      marginRight: '4px',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(10),
    },
  },
}));

export default AccountConfigurationInvoiceNumberingStep;
