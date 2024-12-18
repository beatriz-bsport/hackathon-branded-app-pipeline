import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';
import CustomChip from '../chip/CustomChip.component';

type Props = {
  isNotConnected: boolean;
  isConnectedWithNoIssue: boolean;
  isConnectedWithIssue: boolean;
  isStatusUnknown: boolean;
};

const PayPalStatus: React.FC<Props> = ({
  isNotConnected,
  isConnectedWithNoIssue,
  isConnectedWithIssue,
  isStatusUnknown,
}) => {
  const { t } = useTranslation(['settings']);
  const muiTheme = useTheme();

  return (
    <>
      {isNotConnected && (
        <CustomChip
          displayedValue={t('company.paypal.status.notConnected')}
          mainColor={muiTheme.palette.grey[600]}
        />
      )}
      {isConnectedWithNoIssue && (
        <CustomChip
          displayedValue={t('company.paypal.status.connected')}
          mainColor={muiTheme.palette.success.main}
        />
      )}
      {isConnectedWithIssue && (
        <CustomChip
          displayedValue={t('company.paypal.status.hasIssues')}
          mainColor={muiTheme.palette.error.main}
        />
      )}
      {isStatusUnknown && (
        <CustomChip
          displayedValue={t('company.paypal.status.unknown')}
          mainColor={muiTheme.palette.error.main}
        />
      )}
    </>
  );
};

export default PayPalStatus;
