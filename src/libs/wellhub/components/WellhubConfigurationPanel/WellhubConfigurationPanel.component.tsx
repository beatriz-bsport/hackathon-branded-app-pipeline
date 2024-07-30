import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper } from '@material-ui/core';

import {
  WellhubConfigurationHeader,
  WellhubConfigurationContent,
  WellhubConfigurationFooter,
} from './subcomponents';

import type { WellhubGym } from '#src/libs/wellhub/types';
import type { Establishment } from '#src/libs/establishment/types';

type Props = {
  establishmentsNotLinked: Establishment[];
  wellhubGyms: WellhubGym[];
  wellhubLoading: boolean;
  deleteWellhubGym: (wellhubGym: WellhubGym) => void;
  editWellhubGym: (wellhubGym: WellhubGym) => void;
  handleAddUnit: () => void;
};

const WellhubConfigurationPanel: React.FC<Props> = ({
  establishmentsNotLinked,
  wellhubGyms,
  wellhubLoading,
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
        wellhubGyms={wellhubGyms}
        wellhubLoading={wellhubLoading}
      />
      <WellhubConfigurationFooter
        addUnitDisabled={establishmentsNotLinked?.length == 0}
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
