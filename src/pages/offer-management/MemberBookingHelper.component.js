// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  classes: Object,

  member: Member,
  selected: boolean,
  hasBooked: ?boolean,

  showMember: ?() => void,
  onClickListItem: ?() => void,
  onClickBill: () => void,
  onClickRegister: () => void,
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
          <React.Fragment>
            <IconButton color="secondary" onClick={props.onClickBill}>
              <EuroSymbolIcon />
            </IconButton>
            <Button color="primary" onClick={props.onClickRegister}>
              <AddIcon className={props.classes.rightIcon} />
              {props.t('offer.reCreateBooking')}
            </Button>
          </React.Fragment>
        ) : (
          <Button color="primary" onClick={props.onClickRegister}>
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
