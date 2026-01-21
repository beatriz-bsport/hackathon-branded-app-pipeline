import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Paper } from '@material-ui/core';
import {
  PartnershipConfigurationContent,
  PartnershipConfigurationFooter,
  PartnershipConfigurationHeader,
} from './components';

import { PartnershipDisplayConfig, PartnershipAccount } from '../../types';

type Props = {
  displayConfig: PartnershipDisplayConfig;
  slots?: { alert?: React.ReactNode };
  partnershipAccounts: PartnershipAccount[];
  loading: boolean;
  onActivateAccount?: (account: PartnershipAccount) => void;
  onDeleteAccount: (account: PartnershipAccount) => void;
  onEditAccount: (account: PartnershipAccount) => void;
  onAddConnection: () => void;
  addConnectionDisabled?: boolean;
};

const PartnershipConfigurationPanel: React.FC<Props> = ({
  displayConfig,
  partnershipAccounts,
  loading,
  onActivateAccount,
  onDeleteAccount,
  onEditAccount,
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
        onActivateAccount={onActivateAccount}
        onDeleteAccount={onDeleteAccount}
        onEditAccount={onEditAccount}
        partnershipAccounts={partnershipAccounts}
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
