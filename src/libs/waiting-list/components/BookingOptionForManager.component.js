// @flow

import React, { Component } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import { formatAsDatetime } from '../../../utils/datetime';
import { Member } from '../../member/types';

type Props = {
  t: TFunction,
  heading: ?string,
  option: Object,
  member: ?Member,
  onDiscard: () => void,
  classes: any,
  onClickRegister: () => void,
  disabled: boolean,
};

export class BookingOptionForManager extends Component<Props> {
  renderButton = () => (
    <React.Fragment>
      <Button disabled={this.props.disabled} variant="outlined">
        {this.props.t('booking.onHold')}
      </Button>
      {this.props.onDiscard ? (
        <IconButton
          disabled={this.props.disabled}
          onClick={this.props.onDiscard}
        >
          <CancelIcon />
        </IconButton>
      ) : null}
    </React.Fragment>
  );

  getHeading = () => {
    const { heading, option, member } = this.props;
    switch (heading) {
      case 'date_start':
        return formatAsDatetime(option.offer.date_start);
      default:
        return member ? member.name : '';
    }
  };

  getAvatar = () => {
    const { heading, member } = this.props;
    switch (heading) {
      case 'date_start':
        return null;
      default:
        return (
          <ListItemAvatar>
            <Avatar src={member ? member.photo : ''} />
          </ListItemAvatar>
        );
    }
  };

  handleListItemClick = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    const { option } = this.props;
    const url = `/member/${option.member}/`;
    const win = window.open(url);
    win.focus();
  };

  render() {
    const { option, t, classes, onClickRegister } = this.props;
    if (option.cancelled) {
      return (
        <ListItem
          divider
          button
          disableRipple
          onClick={this.handleListItemClick}
        >
          {this.getAvatar()}
          <ListItemText
            primary={this.getHeading()}
            secondary={t('booking.cancelledFromWaitingList')}
          />
        </ListItem>
      );
    }
    return (
      <ListItem divider button disableRipple onClick={this.handleListItemClick}>
        <div className={classes.outerRow}>
          <div className={classes.innerRow}>
            {this.getAvatar()}
            <ListItemText
              primary={this.getHeading()}
              secondary={
                option.is_convertible
                  ? t('booking.waitingUserConfirmation')
                  : t('booking.onWaitingList')
              }
            />
          </div>
        </div>
        <Button
          color="primary"
          variant="outlined"
          onClick={onClickRegister}
          className={classes.addButton}
          disabled={this.props.disabled}
        >
          <AddIcon />
          {t('booking.add')}
        </Button>
        <div className={classes.innerRow}>{this.renderButton()}</div>
      </ListItem>
    );
  }
}

const styles = (theme) => ({
  outerRow: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(4),
  },
  innerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
)(BookingOptionForManager);
