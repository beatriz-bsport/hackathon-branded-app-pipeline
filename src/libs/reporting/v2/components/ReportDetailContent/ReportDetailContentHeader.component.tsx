import React from 'react';
import { withFormik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InformationIcon from '#src/components/InformationIcon';

import {
  CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES,
  ReportDateType,
} from '#src/libs/reporting/common/constants';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import { mapTimePeriodToDateValues } from '#src/components/date/utils';

import type {
  ReportConfiguration,
  ReportMetadataValue,
  ReportGenerationParams,
} from '#src/libs/reporting/common/types';
import type {
  DateFilterEnum,
  DateFilterRangeEnum,
} from '#src/libs/datatype-filtering/types';
import ReportDetailDateSelectors from '#src/libs/reporting/v2/components/ReportDetailContent/ReportDetailDateSelectors.component';

type Props = {
  categoryName: ReportCategoryEnum;
  generationLoading: boolean;
  handleExport: () => void;
  reportCategoryMetadata: ReportMetadataValue;
};

export type FormikValues = {
  dateEnd: string;
  dateStart: string;
  dateType: ReportDateType;
  timeEnd: string;
  timePeriod: DateFilterEnum | DateFilterRangeEnum;
  timeStart: string;
  timeWindowPeriod: string;
};

type FormikHOCProps = {
  handleGeneration: (values: ReportGenerationParams) => void;
  report: ReportConfiguration;
};

const ReportDetailContentHeader: React.FC<
  Props & FormikProps<FormikValues>
> = ({
  categoryName,
  generationLoading,
  handleExport,
  handleSubmit,
  reportCategoryMetadata,
}) => {
  const { t } = useTranslation(['reporting', 'smartList']);
  const classes = useStyles();

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.root}>
        <div className={classes.titleWrapper}>
          <Typography variant="h6">
            {t('reporting:reportDetailContent.title')}
          </Typography>
          {CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES.includes(categoryName) && (
            <InformationIcon text={t(`helperText.${categoryName}`)} />
          )}
        </div>
        <ReportDetailDateSelectors
          dateType={reportCategoryMetadata.date_type}
          timeWindowFilteringEnabled={
            reportCategoryMetadata.time_window_filtering_enabled
          }
        />
        <Button color="primary" startIcon={<AddIcon />} variant="text">
          {/* Quick filter logic to be added here and no translation needed*/}
          Add a quick filter
        </Button>
        <div className={classes.actionButtonsWrapper}>
          <Button
            color="primary"
            disabled={generationLoading}
            type="submit"
            variant="contained"
          >
            {t('smartList:generateReport')}
          </Button>
          <Button color="primary" onClick={handleExport} variant="outlined">
            {t('smartList:downloadReport')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
  },
  titleWrapper: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  actionButtonsWrapper: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

const FormikHOC = withFormik<Props & FormikHOCProps, FormikValues>({
  mapPropsToValues: ({ report }) => {
    if (report) {
      return {
        dateEnd: report.date_end,
        dateStart: report.date_start,
        dateType: report.date_type,
        timeEnd: report.time_window_end,
        timePeriod: mapTimePeriodToDateValues(
          report.date_start,
          report.date_end,
        ),
        timeStart: report.time_window_start,
        timeWindowPeriod: 'custom',
      };
    }
  },
  handleSubmit: (values, { props: { handleGeneration } }) => {
    const { dateEnd, dateStart, timeEnd, timeStart } = values;

    handleGeneration({
      dateEnd,
      dateStart,
      timeEnd,
      timeStart,
    });
  },
});

export default FormikHOC(React.memo(ReportDetailContentHeader));
