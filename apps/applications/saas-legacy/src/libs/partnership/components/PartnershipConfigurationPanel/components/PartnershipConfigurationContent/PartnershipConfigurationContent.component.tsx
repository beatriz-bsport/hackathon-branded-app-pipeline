import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import InformationIcon from '#src/components/InformationIcon';
import PartnershipAccountTable from './PartnershipAccountTable.component';
import {
  PartnershipDisplayConfig,
  PartnershipAccount,
} from '#src/libs/partnership/types';

type Props = {
  displayConfig: PartnershipDisplayConfig;
  partnershipAccounts: PartnershipAccount[];
  loading: boolean;
  onDeleteAccount: (partnershipAccount: PartnershipAccount) => void;
  onEditAccount: (partnershipAccount: PartnershipAccount) => void;
  onActivateAccount?: (partnershipAccount: PartnershipAccount) => void;
};

const PartnershipConfigurationContent: React.FC<Props> = ({
  displayConfig,
  partnershipAccounts,
  loading,
  onDeleteAccount,
  onEditAccount,
  onActivateAccount,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <Typography variant="h6">
          {t(
            `${displayConfig.partnershipIdentifier}.configuration.panel.content.title`,
          )}
        </Typography>
        {displayConfig.helperTextKey && (
          <InformationIcon text={t(displayConfig.helperTextKey)} />
        )}
      </div>
      <PartnershipAccountTable
        displayConfig={displayConfig}
        loading={loading}
        onActivateAccount={onActivateAccount}
        onDeleteAccount={onDeleteAccount}
        onEditAccount={onEditAccount}
        partnershipAccounts={partnershipAccounts}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  header: {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default React.memo(PartnershipConfigurationContent);
