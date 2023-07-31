import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import { useMediaQuery, useTheme } from '@material-ui/core';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PrepaidLine } from '../types';

type Props = {
  prepaid_line: PrepaidLine;
  dense?: boolean;
  onRemove: () => void;
  divider?: boolean;
};

const PrepaidLineListItem = (props: Props) => {
  const classes = useStyles();
  const isInternalAccount = !!props.prepaid_line?.extra_data?.internal_account;
  const canBeDeleted = isInternalAccount;
  const Icon = () => {
    if (props.prepaid_line?.extra_data?.internal_account !== undefined) {
      return <AccountBalanceWalletIcon />;
    }
    if (props.prepaid_line?.extra_data?.consumer_giftcard_id !== undefined) {
      return <CardGiftcardIcon />;
    }
    return 'x1';
  };
  const theme = useTheme();
  const smalldevice = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <ListItem
      dense={props.dense}
      divider={props.divider}
      disableGutters={smalldevice}
    >
      <ListItemAvatar>
        <Avatar className={classes.quantity}>{Icon()}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.prepaid_line.name}
        secondary={getCurrencyDisplayWithPrice(-props.prepaid_line.unit_value)}
      />
      {canBeDeleted && props.onRemove ? (
        <ListItemSecondaryAction classes={{ root: classes.secondaryAction }}>
          <IconButton onClick={props.onRemove}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  quantity: {
    margin: 10,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
  secondaryAction: {
    [theme.breakpoints.down('xs')]: {
      right: 0,
    },
  },
}));

export default PrepaidLineListItem;
