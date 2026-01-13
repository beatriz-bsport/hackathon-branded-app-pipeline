import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';

import { DateTime } from 'luxon';
import { formatAsDatetimeAdapted } from '#src/utils/datetime';

import { useSequentialNumberingStatus } from '#src/libs/invoice/hooks/useSequentialNumberingStatus';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { useTheme } from '#src/pages/marketplace/passes/hooks/useTheme';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

/**
 * Component for configuring sequential invoice numbering settings.
 * Allows users to customize the invoice number format with:
 * - Optional prefix and suffix (max 7 characters each)
 * - Date format selection (year only or year-month)
 * - Starting number (1-999999)
 * - Start date selection (beginning of next month or current month)
 * Displays a live preview of how invoice numbers will be formatted.
 */
const InvoiceSequentialNumberingSettings: React.FC = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation(['b2b_invoice', 'common']);
  const theme = useTheme();
  const timezone = theme.timezone_name;

  const [selectedOption, setSelectedOption] = useState(
    'beginning_of_next_month',
  );
  const [prefix, setPrefix] = useState('');
  const [dateFormat, setDateFormat] = useState('year_only');
  const [suffix, setSuffix] = useState('');
  const [useExternalAccountingProvider, setUseExternalAccountingProvider] =
    useState(false);
  const {
    lastInvoice,
    legalIdentifierActivated,
    initializeLegalIdentifier,
    isLoading,
    firstTimestampToCheck,
    invoicePrefix,
    invoiceSuffix,
    invoiceIdentifierFormat,
    bsportFirstInvoiceNumber,
  } = useSequentialNumberingStatus();

  const [startingNumber, setStartingNumber] = useState('1');

  // Calculate current and next month names dynamically using company timezone
  const monthNames = useMemo(() => {
    const locale = i18n.language || 'en-US';

    const now = DateTime.now().setZone(timezone).setLocale(locale);
    const currentMonthName = now.toLocaleString({ month: 'long' });

    const nextMonth = now.plus({ months: 1 });
    const nextMonthName = nextMonth.toLocaleString({ month: 'long' });

    return { currentMonthName, nextMonthName };
  }, [i18n.language, timezone]);

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(
      event.target.value as
        | 'beginning_of_next_month'
        | 'beginning_of_current_month',
    );
  };

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow alphanumeric and hyphens, max 7 characters
    if (value === '' || /^[a-zA-Z0-9-]{0,7}$/.test(value)) {
      setPrefix(value);
    }
  };

  const handleStartingNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    // Only allow numbers, must be between 1-999999
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 999999) {
        setStartingNumber(value);
      }
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
  const startingNumberError =
    parseInt(startingNumber, 10) < 1 || parseInt(startingNumber, 10) > 999999;
  const suffixError =
    suffix !== '' && (suffix.length > 7 || !/^[a-zA-Z0-9-]*$/.test(suffix));

  // Compute preview
  const preview = useMemo(() => {
    if (startingNumberError) {
      return '';
    }

    const startNum = parseInt(startingNumber, 10);
    const now = DateTime.now().setZone(timezone);
    const currentYear = now.year;
    const currentMonth = String(now.month).padStart(2, '0');
    const datePart =
      dateFormat === 'year_only'
        ? String(currentYear)
        : `${currentYear}-${currentMonth}`;

    const buildInvoiceNumber = (num: number) => {
      const prefixPart = prefix?.toUpperCase() || '';
      const suffixPart = suffix?.toUpperCase() || '';
      const numberPart = String(num).padStart(6, '0');

      return `${prefixPart}${datePart}-${numberPart}${suffixPart}`;
    };

    return {
      firstNumber: buildInvoiceNumber(startNum),
      restNumbers: [
        String(startNum + 1).padStart(6, '0'),
        String(startNum + 2).padStart(6, '0'),
      ],
    };
  }, [
    prefix,
    dateFormat,
    startingNumber,
    suffix,
    startingNumberError,
    timezone,
  ]);

  // Handle save form submission
  const handleSave = () => {
    // Calculate date_to_start based on selectedOption using company timezone
    const now = DateTime.now().setZone(timezone);
    const dateToStart =
      selectedOption === 'beginning_of_next_month'
        ? now.plus({ months: 1 }).startOf('month')
        : now.startOf('month');

    // Format date as ISO string (timezone will be handled by backend)
    const dateToStartISO =
      dateToStart.toISO() ?? dateToStart.toUTC().toISO() ?? '';

    // Convert dateFormat to numeric format: 'year_only' = 1, 'year_month' = 2
    const format = dateFormat === 'year_only' ? 1 : 2;

    initializeLegalIdentifier(
      {
        date_to_start: dateToStartISO,
        prefix,
        suffix,
        format_: format,
        first_invoice_number: parseInt(startingNumber, 10),
      },
      {
        onError: (error) => {
          console.error('Failed to initialize legal identifier:', error);
        },
      },
    );
  };

  // Saved configuration non editable
  if (legalIdentifierActivated) {
    const startDateLabel = firstTimestampToCheck
      ? formatAsDatetimeAdapted(firstTimestampToCheck, 'MMMM yyyy', timezone)
      : '-';

    const startingNumberLabel =
      bsportFirstInvoiceNumber != null
        ? String(bsportFirstInvoiceNumber).padStart(6, '0')
        : '-';

    const dateToken =
      invoiceIdentifierFormat === 2
        ? '{YEAR}-{MONTH}'
        : invoiceIdentifierFormat === 1
        ? '{YEAR}'
        : '';

    const formatLabel = () => {
      const prefixPart = invoicePrefix ? invoicePrefix.toUpperCase() : '';
      const suffixPart = invoiceSuffix ? invoiceSuffix.toUpperCase() : '';

      const coreParts = [dateToken, '{NUMBER}'].filter(Boolean);
      const core = coreParts.join('-');

      // Format: {PREFIX}{DATE}-{NUMBER}{SUFFIX}
      if (!prefixPart && !core) return `{NUMBER}${suffixPart || ''}`;
      if (!prefixPart) return `${core}${suffixPart || ''}`;
      return `${prefixPart}${core}${suffixPart || ''}`;
    };

    return (
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <Typography component="h3" variant="h6">
            {t('b2b_invoice:configuration.sequentialNumbering.title')}
          </Typography>
        </div>

        <div className={classes.savedConfigurationInfo}>
          <div className={classes.configFieldsLeft}>
            <Typography variant="body2">
              {t(
                'b2b_invoice:configuration.sequentialNumbering.renamingStartDate',
              )}
            </Typography>
            <Typography variant="body2">
              {t(
                'b2b_invoice:configuration.sequentialNumbering.startingNumber',
              )}
            </Typography>
            <Typography variant="body2">
              {t(
                'b2b_invoice:configuration.sequentialNumbering.invoiceNumberingFormat',
              )}
            </Typography>
          </div>
          <div className={classes.configFieldsRight}>
            <Typography variant="body2">{startDateLabel}</Typography>
            <Typography variant="body2">{startingNumberLabel}</Typography>
            <Typography variant="body2">{formatLabel()}</Typography>
          </div>
        </div>
        <Alert className={classes.alert} severity="info">
          <Typography component="p" variant="body2">
            {t(
              'b2b_invoice:configuration.sequentialNumbering.numberingExplanation',
            )}
          </Typography>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.header}>
        <Typography component="h3" variant="h6">
          {t('b2b_invoice:configuration.sequentialNumbering.title')}
        </Typography>
      </div>
      <div className={classes.content}>
        <Typography className={classes.bodyText} variant="body2">
          {t('b2b_invoice:configuration.sequentialNumbering.subtitle')}
        </Typography>
      </div>

      <FormControl className={classes.selectControl} variant="outlined">
        <InputLabel id="sequential-numbering-select-label">
          {t('b2b_invoice:configuration.sequentialNumbering.selectLabel')}
        </InputLabel>
        <Select
          className={classes.select}
          id="sequential-numbering-select"
          label={t('b2b_invoice:configuration.sequentialNumbering.selectLabel')}
          labelId="sequential-numbering-select-label"
          onChange={handleSelectChange}
          value={selectedOption}
        >
          <MenuItem value="beginning_of_next_month">
            {t(
              'b2b_invoice:configuration.sequentialNumbering.beginningOfNextMonth',
              { nextMonth: monthNames.nextMonthName },
            )}
          </MenuItem>
          <MenuItem value="beginning_of_current_month">
            {t(
              'b2b_invoice:configuration.sequentialNumbering.beginningOfCurrentMonth',
              { currentMonth: monthNames.currentMonthName },
            )}
          </MenuItem>
        </Select>
      </FormControl>

      <Alert className={classes.alert} severity="info">
        {t(
          selectedOption === 'beginning_of_next_month'
            ? 'b2b_invoice:configuration.sequentialNumbering.infoNextMonth'
            : 'b2b_invoice:configuration.sequentialNumbering.infoCurrentMonth',
          { currentMonth: monthNames.currentMonthName },
        )}
      </Alert>

      {selectedOption === 'beginning_of_current_month' && (
        <FormControlLabel
          className={classes.toggleLabel}
          control={
            <Switch
              checked={useExternalAccountingProvider}
              color="primary"
              onChange={(event) =>
                setUseExternalAccountingProvider(event.target.checked)
              }
            />
          }
          label={t(
            'b2b_invoice:configuration.sequentialNumbering.useExternalAccountingProvider',
          )}
        />
      )}

      {selectedOption === 'beginning_of_current_month' &&
        useExternalAccountingProvider &&
        lastInvoice &&
        preview && (
          <div className={classes.infoBlock}>
            <div className={classes.lastInvoiceHeader}>
              <Typography variant="body2">
                <Trans
                  components={[<strong key="bold" />]}
                  i18nKey="b2b_invoice:configuration.sequentialNumbering.previousInvoiceTitle"
                  ns="b2b_invoice"
                  values={{
                    invoiceNumber: lastInvoice.uuid.split('-')[0],
                  }}
                />
              </Typography>
              <Link
                className={classes.viewInvoiceDetailsLink}
                color="primary"
                href={`/invoice/${lastInvoice.uuid}`}
                target="_blank"
              >
                {t(
                  'b2b_invoice:configuration.sequentialNumbering.viewInvoiceDetails',
                )}
                <OpenInNewIcon className={classes.linkIcon} />
              </Link>
            </div>
            <Typography color="textSecondary" variant="caption">
              {DateTime.fromISO(lastInvoice.issue_date)
                .setZone(timezone)
                .toLocaleString({
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
              • {lastInvoice.member_name} •{' '}
              {getCurrencyDisplayWithPrice(lastInvoice.amount_due_cts)}
            </Typography>
            {preview && (
              <div className={classes.previewFirstNumber}>
                <Typography variant="body2">
                  <Trans
                    components={[<strong key="bold" />]}
                    i18nKey="b2b_invoice:configuration.sequentialNumbering.startingNumberHint"
                    ns="b2b_invoice"
                    values={{ startingNumber }}
                  />
                </Typography>
              </div>
            )}
          </div>
        )}

      <FormControl
        fullWidth
        disabled={
          selectedOption === 'beginning_of_next_month' ||
          (selectedOption === 'beginning_of_current_month' &&
            !useExternalAccountingProvider)
        }
        error={startingNumberError}
      >
        <InputLabel htmlFor="starting-number-input">
          {t(
            'b2b_invoice:configuration.sequentialNumbering.startingNumberLabel',
          )}
        </InputLabel>
        <Input
          className={classes.input}
          id="starting-number-input"
          onChange={handleStartingNumberChange}
          value={startingNumber}
        />
        <FormHelperText className={classes.helperText}>
          {t(
            lastInvoice && selectedOption === 'beginning_of_current_month'
              ? 'b2b_invoice:configuration.sequentialNumbering.startingNumberHelperExisting'
              : 'b2b_invoice:configuration.sequentialNumbering.startingNumberHelper',
          )}
        </FormHelperText>
      </FormControl>

      <div className={classes.radioContainer}>
        <Typography className={classes.radioLabel} variant="body2">
          {t('b2b_invoice:configuration.sequentialNumbering.dateFormatLabel')}
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

      <Alert className={classes.alert} severity="warning">
        <Typography component="p">
          <Trans
            components={[<strong key="bold" />]}
            i18nKey="b2b_invoice:configuration.sequentialNumbering.warning"
            ns="b2b_invoice"
          />
        </Typography>
      </Alert>

      <Button
        color="primary"
        disabled={
          isLoading || prefixError || startingNumberError || suffixError
        }
        onClick={handleSave}
        variant="contained"
      >
        {t('common:save')}
      </Button>
    </Paper>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  select: {
    maxWidth: '320px',
  },
  input: {
    marginTop: theme.spacing(2),
    maxWidth: '320px',
    width: '100%',
  },
  content: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  bodyText: {
    width: '100%',
    color: theme.palette.text.secondary,
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  selectControl: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  radioContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  radioLabel: {
    color: theme.palette.text.secondary,
  },
  helperText: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
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
  lastInvoiceHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: theme.spacing(4),
  },
  viewInvoiceDetailsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    whiteSpace: 'nowrap',
  },
  linkIcon: {
    fontSize: '1rem',
  },
  previewFirstNumber: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  infoIcon: {
    color: theme.palette.action.disabled,
    fontSize: '1.25rem',
  },
  savedConfigurationInfo: {
    display: 'flex',
    padding: theme.spacing(2),
    gap: theme.spacing(4),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(2),
  },
  configFieldsLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    color: theme.palette.grey[700],
  },
  configFieldsRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  toggleLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

export default InvoiceSequentialNumberingSettings;
