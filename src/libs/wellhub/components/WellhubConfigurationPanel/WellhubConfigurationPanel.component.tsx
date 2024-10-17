import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper } from '@material-ui/core';

import WellhubProductAlert from '#src/libs/wellhub/components/WellhubProductAlert';
import {
  WellhubConfigurationHeader,
  WellhubConfigurationContent,
  WellhubConfigurationFooter,
} from './subcomponents';

import type { WellhubGym } from '#src/libs/wellhub/types';
import type { Establishment } from '#src/libs/establishment/types';

type Props = {
  establishmentsNotLinked: Establishment[];
  offersMissingWellhubProductCount: number;
  wellhubGyms: WellhubGym[];
  wellhubLoading: boolean;
  deleteWellhubGym: (wellhubGym: WellhubGym) => void;
  editWellhubGym: (wellhubGym: WellhubGym) => void;
  handleAddUnit: () => void;
  openWellhubProductSelectionDrawer: () => void;
};

const WellhubConfigurationPanel: React.FC<Props> = ({
  establishmentsNotLinked,
  offersMissingWellhubProductCount,
  wellhubGyms,
  wellhubLoading,
  deleteWellhubGym,
  editWellhubGym,
  handleAddUnit,
  openWellhubProductSelectionDrawer,
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.configurationPanel}>
      <WellhubConfigurationHeader />
      <WellhubProductAlert
        onActionClick={openWellhubProductSelectionDrawer}
        total={offersMissingWellhubProductCount}
      />
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
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

export default React.memo(WellhubConfigurationPanel);
