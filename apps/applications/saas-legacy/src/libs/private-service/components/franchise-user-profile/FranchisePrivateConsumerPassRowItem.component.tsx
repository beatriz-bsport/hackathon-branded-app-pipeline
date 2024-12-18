import React from 'react';
import { useTranslation } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ConsumerPassSourceChip from '#src/components/chip/ConsumerPassSourceChip';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import type {
  FranchisePrivatePass,
  FranchiseUserPrivatePass,
} from '#src/libs/franchise/types';
import { PrivatePassCreditStatusAndPrice } from './PrivatePassCreditStatusAndPrice.component';
import { getPassDate } from '#src/libs/private-service/utils';

type Props = {
  selected?: boolean;
  disabled?: boolean;
  privateConsumerPass: FranchiseUserPrivatePass;
  privatePass?: FranchisePrivatePass;
  onClick?: () => void;
};

const FranchisePrivateConsumerPassRowItem: React.FC<Props> = ({
  selected,
  disabled,
  privateConsumerPass,
  privatePass,
  onClick,
}) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  if (!privateConsumerPass) return null;

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
      {(hasMemberProfileAccessPermission: boolean) => (
        <div>
          <ListItem
            dense
            button={(!!onClick && hasMemberProfileAccessPermission) as any}
            className={classes.listContainer}
            disabled={!!privateConsumerPass.reverted || !!disabled}
            onClick={
              !!onClick && hasMemberProfileAccessPermission ? onClick : null
            }
            selected={!!selected}
            style={
              privateConsumerPass.disabled
                ? { backgroundColor: 'rgba(255,0,0,.05)' }
                : {}
            }
          >
            <ListItemText
              primary={
                <div>
                  <div className={classes.nameContainer}>
                    <Typography>{privatePass?.name}</Typography>
                  </div>
                  <PrivatePassCreditStatusAndPrice
                    privateConsumerPass={privateConsumerPass}
                    privatePass={privatePass}
                  />
                </div>
              }
              secondary={
                <div>
                  <Typography>{getPassDate(privateConsumerPass)[0]}</Typography>
                </div>
              }
            />
            <div className={classes.chipContainer}>
              {!privateConsumerPass.reverted ? (
                <ConsumerPassSourceChip
                  companySourceName={privateConsumerPass.company_source_name}
                  companySourcePrimaryColor={
                    privateConsumerPass.company_source_primary_color
                  }
                />
              ) : (
                <Button>{t('reverted')}</Button>
              )}
            </div>
          </ListItem>
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  listContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  chipContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

export default React.memo(FranchisePrivateConsumerPassRowItem);
