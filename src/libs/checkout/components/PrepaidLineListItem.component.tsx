import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PrepaidLine } from '../types';

type Props = { prepaid_line: PrepaidLine; dense?: boolean };

const PrepaidLineListItem = (props: Props) => {
  const classes = useStyles();
  return (
    <ListItem dense={props.dense}>
      <ListItemAvatar>
        <Avatar className={classes.quantity}>x1</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.prepaid_line.name}
        secondary={getCurrencyDisplayWithPrice(-props.prepaid_line.unit_value)}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  quantity: {
    margin: 10,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
}));

export default PrepaidLineListItem;
