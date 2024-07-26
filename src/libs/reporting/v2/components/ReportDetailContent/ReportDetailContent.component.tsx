import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import { MuiThemeProvider } from '@material-ui/core';
import { cardHeaderStatsTheme } from '#src/libs/reporting/v2/mui-theme-providers';

import ReportDetailContentHeader from './ReportDetailContentHeader.component';
import ReportTableHeaders from '#src/libs/reporting/common/components/ReportTableHeaders.component';

import type {
  ReportHeader,
  ReportConfiguration,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Props = {
  categoryName: ReportCategoryEnum;
  handleExport: () => void;
  handleGeneration: () => void;
  loading: boolean;
  report: ReportConfiguration;
  reportCategoryMetadata: ReportMetadataValue;
  reportHeaders: ReportHeader;
};

const ReportDetailContent: React.FC<Props> = ({
  categoryName,
  handleExport,
  handleGeneration,
  loading,
  report,
  reportCategoryMetadata,
  reportHeaders,
}) => {
  const classes = useStyles();
  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Paper className={classes.contentPaper}>
      <ReportDetailContentHeader
        categoryName={categoryName}
        handleExport={handleExport}
        handleGeneration={handleGeneration}
        report={report}
        reportCategoryMetadata={reportCategoryMetadata}
      />
      <Divider />
      <MuiThemeProvider theme={cardHeaderStatsTheme}>
        <ReportTableHeaders v2 reportHeaders={reportHeaders} />
      </MuiThemeProvider>
      <Divider />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  contentPaper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(3),
  },
}));

export default React.memo(ReportDetailContent);
