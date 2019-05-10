// @flow
import React from 'react';

import {
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  classes: Object,

  member: Member,
  selected: boolean,
  hasBooked: ?boolean,

  showMember: ?() => void,
  onClick: () => void,
  onClickListItem: ?() => void,
};

function MemberBookingHelper(props: Props) {
  return (
    <ListItem
      button={!!props.onClickListItem}
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
            <AttachMoneyIcon className={props.classes.rightIcon} />
            {props.t('offer.addInvoice')}
          </Button>
        ) : (
          <Button color="primary" onClick={props.onClick}>
            <AddIcon className={props.classes.rightIcon} />
            {props.t('offer.createBooking')}
          </Button>
        )}
        {props.showMember ? (
          <IconButton color="secondary" onClick={props.showMember}>
            <VisibilityIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const styles = (theme) => ({
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(withNamespaces()(MemberBookingHelper));
