import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper } from '@material-ui/core';

import WellhubConfigurationHeader from './WellhubConfigurationHeader.component';
import WellhubConfigurationContent from './WellhubConfigurationContent.component';
import WellhubConfigurationFooter from './WellhubConfigurationFooter.component';

type Props = {};

const WellhubConfigurationPanel: React.FC<Props> = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.configurationPanel}>
      <WellhubConfigurationHeader />
      <WellhubConfigurationContent />
      <WellhubConfigurationFooter
        addUnitDisabled={false} //TODO: build constant to test if all establishments are already linked to a wellhub Unit
        handleAddUnit={() => {}}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  configurationPanel: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

export default React.memo(WellhubConfigurationPanel);
