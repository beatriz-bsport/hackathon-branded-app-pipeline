// @flow

import React from 'react';

import { compose, withState, withProps } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import type {
  ReportConfiguration,
  ReportCategoryEnum,
  ReportMetadata,
} from './types';

import ReportCategorySelector from './ReportCategorySelector.component';
import ReportList from './ReportList.component';
import ReportConfigurationForm from './ReportConfigurationForm.component';

type ExternalProps = {
  reportConfigurations: ReportConfiguration[],
  upsertReportConfiguration: (ReportConfiguration) => void,
};
type Props = ExternalProps & {
  setSelectedCategory: (ReportCategoryEnum) => void,
  classes: { [string]: string },
  setShowModalAdd: (boolean) => void,
  showModalAdd: boolean,
  reportConfiguration: ReportConfiguration,
  onReportDetail: (ReportConfiguration) => void,
  metadata: ReportMetadata,
  setReportConfigurationToEdit: (ReportConfiguration) => void,
};

export function ReportDashboard(props: Props) {
  const {
    setSelectedCategory,
    reportConfigurations,
    classes,
    showModalAdd,
    setShowModalAdd,
    upsertReportConfiguration,
    reportConfiguration,
    onReportDetail,
    setReportConfigurationToEdit,
    metadata,
  } = props;
  const itemProps = {
    onEdit: (report: ReportConfiguration) => {
      setReportConfigurationToEdit(report);
      setShowModalAdd(true);
    },
    onDetail: onReportDetail,
  };
  const categories = metadata.map((c) => c.category);
  return (
    <Paper className={classes.root}>
      <ReportCategorySelector
        categories={categories}
        onSelect={setSelectedCategory}
      />
      {reportConfigurations.length ? (
        <ReportList
          items={reportConfigurations}
          className={classes.list}
          itemProps={itemProps}
        />
      ) : (
        <Typography variant="body1" className={classes.messageNoReports}>
          No reports here? Create a new one now!
        </Typography>
      )}
      <Fab
        color="primary"
        className={classes.fabAdd}
        onClick={() => setShowModalAdd(true)}
      >
        <AddIcon />
      </Fab>
      {showModalAdd ? (
        <Dialog open>
          <DialogTitle>New report</DialogTitle>
          <DialogContent>
            <ReportConfigurationForm
              metadata={metadata}
              initial={reportConfiguration}
              onSubmit={(data) => {
                upsertReportConfiguration(data);
                setShowModalAdd(false);
              }}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </Paper>
  );
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  list: {
    marginTop: theme.spacing.unit * 2,
  },
  fabAdd: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  messageNoReports: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 10,
    paddingBottom: theme.spacing.unit * 10,
  },
});

export default compose(
  withStyles(styles),
  withState('selectedCategory', 'setSelectedCategory', null),
  withState('reportConfiguration', 'setReportConfigurationToEdit', null),
  withProps(({ reportConfigurations, selectedCategory }) => ({
    reportConfigurations: selectedCategory
      ? reportConfigurations.filter((c) => c.category === selectedCategory)
      : reportConfigurations,
  })),
  withState('showModalAdd', 'setShowModalAdd', false),
)(ReportDashboard);
