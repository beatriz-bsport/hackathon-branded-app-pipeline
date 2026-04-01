import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

const BULK_EXPORT_CUTOFF = { year: 2025, month: 3 };

type Props = {
  loading?: boolean;
  onClose: () => void;
  onConfirm: (params: { month: number; year: number }) => void;
  open: boolean;
  timezone?: string;
};

const getMonthLabel = (month: number) =>
  DateTime.fromObject({ year: 2025, month }).toFormat('LLLL');

const InvoiceBulkExportModal: React.FC<Props> = ({
  loading = false,
  onClose,
  onConfirm,
  open,
  timezone,
}) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const timezoneName = timezone || 'UTC';

  const nowInCompanyTz = DateTime.now().setZone(timezoneName).startOf('month');
  const lastAvailableMonth = nowInCompanyTz.minus({ months: 1 });
  const cutoffDate = DateTime.fromObject(
    {
      year: BULK_EXPORT_CUTOFF.year,
      month: BULK_EXPORT_CUTOFF.month,
      day: 1,
    },
    { zone: timezoneName },
  ).startOf('month');

  const [month, setMonth] = React.useState(lastAvailableMonth.month);
  const [year, setYear] = React.useState(lastAvailableMonth.year);

  React.useEffect(() => {
    if (open) {
      const now = DateTime.now().setZone(timezoneName).startOf('month');
      const lastAvailable = now.minus({ months: 1 });
      setMonth(lastAvailable.month);
      setYear(lastAvailable.year);
    }
  }, [open, timezoneName]);

  const startYear = BULK_EXPORT_CUTOFF.year;
  const endYear = lastAvailableMonth.year;
  const yearOptions = React.useMemo(
    () =>
      Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i),
    [endYear, startYear],
  );

  const requestedDate = DateTime.fromObject(
    { year, month, day: 1 },
    { zone: timezoneName },
  ).startOf('month');

  const isBeforeCutoff = requestedDate < cutoffDate;
  const isCurrentOrFutureMonth = requestedDate >= nowInCompanyTz;
  const canRequestExport = !isBeforeCutoff && !isCurrentOrFutureMonth;

  const errorText = (() => {
    if (isBeforeCutoff) {
      return t('actions.bulkExport.monthErrorBeforeCutoff');
    }
    if (isCurrentOrFutureMonth) {
      return t('actions.bulkExport.monthErrorCurrentOrFuture');
    }
    return '';
  })();

  const handleDownload = () => {
    if (!canRequestExport || loading) return;
    onConfirm({ year, month });
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{t('actions.bulkExport.modalTitle')}</DialogTitle>
      <DialogContent>
        <Typography className={classes.description} variant="body2">
          {t('actions.bulkExport.modalDescription')}
        </Typography>
        <Alert className={classes.infoAlert} severity="info">
          <Typography variant="body2">
            {t('actions.bulkExport.alertDescription')}
          </Typography>
        </Alert>
        <div className={classes.fieldsRow}>
          <FormControl className={classes.field} variant="outlined">
            <InputLabel id="invoice-bulk-export-month-label">
              {t('actions.bulkExport.month')}
            </InputLabel>
            <Select
              label={t('actions.bulkExport.month')}
              labelId="invoice-bulk-export-month-label"
              onChange={(event) => setMonth(Number(event.target.value))}
              value={month}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((monthValue) => (
                <MenuItem key={monthValue} value={monthValue}>
                  {getMonthLabel(monthValue)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.field} variant="outlined">
            <InputLabel id="invoice-bulk-export-year-label">
              {t('actions.bulkExport.year')}
            </InputLabel>
            <Select
              label={t('actions.bulkExport.year')}
              labelId="invoice-bulk-export-year-label"
              onChange={(event) => setYear(Number(event.target.value))}
              value={year}
            >
              {yearOptions.map((yearValue) => (
                <MenuItem key={yearValue} value={yearValue}>
                  {yearValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {errorText && <FormHelperText error>{errorText}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.bulkExport.cancel')}</Button>
        <Button
          color="primary"
          disabled={!canRequestExport || loading}
          onClick={handleDownload}
          variant="contained"
        >
          {loading
            ? t('actions.bulkExport.downloading')
            : t('actions.bulkExport.download')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    marginBottom: theme.spacing(2),
  },
  infoAlert: {
    marginBottom: theme.spacing(2),
  },
  fieldsRow: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  field: {
    flex: 1,
  },
}));

export default React.memo(InvoiceBulkExportModal);
