import React from 'react';
import { useTranslation } from 'react-i18next';

import moment from 'moment-timezone';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Typography from '@material-ui/core/Typography';
import DateRangeSelector from '#components/date/DateRangeSelector.component';
// eslint-disable-next-line no-duplicate-imports
import type { Values } from '#components/date/DateRangeSelector.component';

import { CampaignExportStartEndDates } from '../types';

type Props = {
  csvExportLink: string;
  csvExportDate: string;
  csvExportLoading: boolean;
  fetchRecipientsNumber: ({
    start_date,
    end_date,
  }: CampaignExportStartEndDates) => void;
};

export const CampaignsExportSection: React.FC<Props> = ({
  csvExportLink,
  csvExportDate,
  csvExportLoading,
  fetchRecipientsNumber,
}) => {
  const { t } = useTranslation('smartList');
  const classes = useStyles();

  const [periodFilter, setPeriodFilter] =
    React.useState<CampaignExportStartEndDates>({
      start_date: moment().add(-1, 'day').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    });

  const handlePeriodChange = React.useCallback(
    (values: Values) =>
      setPeriodFilter({
        start_date: values.dateStart.toISODate(),
        end_date: values.dateEnd.toISODate(),
      }),
    [setPeriodFilter],
  );

  const handleGenerateExport = React.useCallback(() => {
    fetchRecipientsNumber(periodFilter);
  }, [fetchRecipientsNumber, periodFilter]);

  const openCsvExportLink = React.useCallback(() => {
    window.open(csvExportLink);
  }, [csvExportLink]);

  return (
    <div className={classes.container}>
      <div className={classes.flexHeaderContainer}>
        <DateRangeSelector
          isEndDateBeforeCurrentDate
          date_end={moment(periodFilter.end_date).unix()}
          date_start={moment(periodFilter.start_date).unix()}
          onSubmit={handlePeriodChange}
          timePeriod="week"
        />
        <div className={classes.downloadButtonsContainer}>
          <Button
            className={classes.buttonPDF}
            color="secondary"
            disabled={csvExportLoading}
            onClick={handleGenerateExport}
            variant="contained"
          >
            {t('generateReport')}
          </Button>
          <Button
            className={classes.buttonCSV}
            color="secondary"
            disabled={!csvExportLink}
            onClick={openCsvExportLink}
            variant="contained"
          >
            {csvExportLoading ? (
              <CircularProgress
                className={classes.leftIcon}
                color="secondary"
                size={25}
              />
            ) : (
              <CloudDownloadIcon className={classes.leftIcon} />
            )}
            {t('downloadReport')}
          </Button>
        </div>
      </div>
      <div className={classes.flexRight}>
        <Typography>
          {csvExportLink
            ? t('lastGenerated', {
                date: moment.unix(parseFloat(csvExportDate)).format('L'),
                time: moment.unix(parseFloat(csvExportDate)).format('LT'),
              })
            : t('generateHelperText')}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
  flexHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonCSV: {
    margin: theme.spacing(1.5),
    color: theme.palette.common.white,
  },
  buttonPDF: {
    margin: theme.spacing(1.5),
    color: theme.palette.common.white,
  },
  flexRight: {
    display: 'flex',
    justifyContent: 'end',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(CampaignsExportSection);
