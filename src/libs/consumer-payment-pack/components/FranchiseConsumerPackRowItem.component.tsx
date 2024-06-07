import React from 'react';
import { useTranslation } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { formatAsDate } from '#src/utils/datetime';
import ConsumerPassSourceChip from '#src/components/chip/ConsumerPassSourceChip';
import CreditStatus from '#src/libs/consumer-payment-pack/components/CreditStatus.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import type { FranchiseUserPassWithPaymentPack } from '#src/libs/franchise/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';

type Props = {
  selected?: boolean;
  disabled?: boolean;
  consumerPack: FranchiseUserPassWithPaymentPack;
  paymentPack?: PaymentPack;
  onClick?: () => void;
};

const FranchiseConsumerPackRowItem: React.FC<Props> = ({
  selected,
  disabled,
  consumerPack,
  paymentPack,
  onClick,
}) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  if (!consumerPack) return null;

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
      {(hasMemberProfileAccessPermission: boolean) => (
        <div>
          <ListItem
            dense
            button={(!!onClick && hasMemberProfileAccessPermission) as any}
            className={classes.listContainer}
            disabled={!!consumerPack.reverted || !!disabled}
            onClick={
              !!onClick && hasMemberProfileAccessPermission ? onClick : null
            }
            selected={!!selected}
            style={
              consumerPack.disabled
                ? { backgroundColor: 'rgba(255,0,0,.05)' }
                : {}
            }
          >
            <ListItemText
              primary={
                <div>
                  <div className={classes.nameContainer}>
                    <Typography>{paymentPack?.name}</Typography>
                  </div>
                  <CreditStatus
                    consumerPack={consumerPack}
                    paymentPack={paymentPack}
                  />
                </div>
              }
              secondary={
                <div>
                  <Typography>
                    {`${formatAsDate(
                      consumerPack.starting_date,
                    )}→${formatAsDate(consumerPack.ending_date)}`}
                  </Typography>
                </div>
              }
            />
            <div className={classes.chipContainer}>
              {!consumerPack.reverted ? (
                <ConsumerPassSourceChip
                  companySourceName={consumerPack.company_source_name}
                  companySourcePrimaryColor={
                    consumerPack.company_source_primary_color
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

export default React.memo(FranchiseConsumerPackRowItem);
