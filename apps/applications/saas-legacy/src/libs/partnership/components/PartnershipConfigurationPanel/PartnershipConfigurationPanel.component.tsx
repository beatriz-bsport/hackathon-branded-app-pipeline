import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper } from '@material-ui/core';
import {
  PartnershipConfigurationContent,
  PartnershipConfigurationFooter,
  PartnershipConfigurationHeader,
} from './components';

import { PartnershipDisplayConfig, PartnershipVenue } from '../../types';

type Props = {
  displayConfig: PartnershipDisplayConfig;
  slots?: { alert?: React.ReactNode };
  partnershipVenues: PartnershipVenue[];
  loading: boolean;
  onActivateVenue?: (venue: PartnershipVenue) => void;
  onDeleteVenue: (venue: PartnershipVenue) => void;
  onEditVenue: (venue: PartnershipVenue) => void;
  onAddConnection: () => void;
  addConnectionDisabled?: boolean;
};

const PartnershipConfigurationPanel: React.FC<Props> = ({
  displayConfig,
  partnershipVenues,
  loading,
  onActivateVenue,
  onDeleteVenue,
  onEditVenue,
  onAddConnection,
  addConnectionDisabled = false,
  slots,
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.configurationPanel}>
      <PartnershipConfigurationHeader displayConfig={displayConfig} />
      {slots?.alert}
      <PartnershipConfigurationContent
        displayConfig={displayConfig}
        loading={loading}
        onActivateVenue={onActivateVenue}
        onDeleteVenue={onDeleteVenue}
        onEditVenue={onEditVenue}
        partnershipVenues={partnershipVenues}
      />
      <PartnershipConfigurationFooter
        addConnectionDisabled={addConnectionDisabled}
        displayConfig={displayConfig}
        onAddConnection={onAddConnection}
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

export default React.memo(PartnershipConfigurationPanel);
