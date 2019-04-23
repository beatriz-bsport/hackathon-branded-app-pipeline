// @flow
import React from 'react';

import {
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  selected: boolean,
  member: Member,
  hasBooked: ?boolean,
  t: TFunction,
  onClick: () => void,
  onClickListItem: ?() => void,
  classes: Object,
};

const MemberBookingHelper = (props: Props) => (
  <ListItem
    button={props.onClickListItem}
    selected={props.selected}
    divider
    dense
    onClick={props.onClickListItem || (() => {})}
  >
    <ListItemText
      primary={props.member.name}
      secondary={
        props.hasBooked
          ? props.t('offer.hasBooked')
          : props.t('offer.hasntBooked')
      }
      secondaryTypographyProps={{
        color: props.hasBooked ? 'primary' : 'secondary',
      }}
    />
    <ListItemSecondaryAction>
      {props.hasBooked ? (
        <Button color="secondary" onClick={props.onClick}>
          {props.t('offer.addInvoice')}
          <AttachMoneyIcon className={props.classes.leftIcon} />
        </Button>
      ) : (
        <Button color="primary" onClick={props.onClick}>
          {props.t('offer.createBooking')}
          <AddIcon className={props.classes.leftIcon} />
        </Button>
      )}
    </ListItemSecondaryAction>
  </ListItem>
);

const styles = (theme) => ({
  leftIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export default withStyles(styles)(withNamespaces()(MemberBookingHelper));
