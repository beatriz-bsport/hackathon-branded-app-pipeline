// @flow

import React from 'react';

import { compose, withState, withProps } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import type { ReportConfiguration, ReportCategoryEnum } from './types';

import ReportCategorySelector from './ReportCategorySelector.component';
import ReportList from './ReportList.component';

type Props = {
  setSelectedCategory: (ReportCategoryEnum) => void,
  reportConfigurations: ReportConfiguration[],
  classes: { [string]: string },
  setShowModalAdd: (boolean) => void,
  showModalAdd: boolean,
};

export function ReportDashboard(props: Props) {
  const {
    setSelectedCategory,
    reportConfigurations,
    classes,
    showModalAdd,
    setShowModalAdd,
  } = props;
  return (
    <Paper className={classes.root}>
      <ReportCategorySelector onSelect={setSelectedCategory} />
      <ReportList items={reportConfigurations} className={classes.list} />
      <Fab
        color="primary"
        className={classes.fabAdd}
        onClick={() => setShowModalAdd(true)}
      >
        <AddIcon />
      </Fab>
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
});

export default compose(
  withStyles(styles),
  withState('selectedCategory', 'setSelectedCategory', null),
  withProps(({ reportConfigurations, selectedCategory }) => ({
    reportConfigurations: selectedCategory
      ? reportConfigurations.filter((c) => c.category === selectedCategory)
      : reportConfigurations,
  })),
  withState('showModalAdd', 'setShowModalAdd', false),
)(ReportDashboard);
