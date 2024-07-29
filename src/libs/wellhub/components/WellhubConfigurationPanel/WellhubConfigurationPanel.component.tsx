import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper } from '@material-ui/core';

import {
  WellhubConfigurationHeader,
  WellhubConfigurationContent,
  WellhubConfigurationFooter,
} from './subcomponents';

import { WELLHUB_GYMS } from './constants';

import type { WellhubGym } from '#src/libs/wellhub/types';

type Props = {
  deleteWellhubGym: (wellhubGym: WellhubGym) => void;
  editWellhubGym: (wellhubGym: WellhubGym) => void;
  handleAddUnit: () => void;
};

const WellhubConfigurationPanel: React.FC<Props> = ({
  deleteWellhubGym,
  editWellhubGym,
  handleAddUnit,
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.configurationPanel}>
      <WellhubConfigurationHeader />
      <WellhubConfigurationContent
        deleteWellhubGym={deleteWellhubGym}
        editWellhubGym={editWellhubGym}
        wellhubGyms={WELLHUB_GYMS}
      />
      <WellhubConfigurationFooter
        addUnitDisabled={false} //TODO: build constant to test if all establishments are already linked to a wellhub Unit
        handleAddUnit={handleAddUnit}
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
