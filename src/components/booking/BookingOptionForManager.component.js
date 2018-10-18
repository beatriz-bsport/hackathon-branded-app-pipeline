// @flow

import React, { Component } from 'react';

import { Button, Grid, Avatar, ListItemText } from '@material-ui/core';
import { translate } from 'react-i18next';

import { formatAsDatetime } from '../../datetime';
import RedButton from '../button/RedButton.component';

type Props = {
  t: (x: string) => string,
  heading: ?string,
  option: Object,
  discardOption: () => void,
};

export class BookingOptionForManager extends Component<Props> {
  renderButton = () => {
    const { t, discardOption } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item>
          <Button disabled variant="outlined">
            {t('booking.onHold')}
          </Button>
        </Grid>
        <Grid item>
          <RedButton variant="outlined" onClick={discardOption}>
            {t('booking.discard')}
          </RedButton>
        </Grid>
      </Grid>
    );
  };

  getHeading = () => {
    const { heading, option } = this.props;
    switch (heading) {
      case 'date_start':
        return formatAsDatetime(option.offer.date_start);
      default:
        return option.user.name;
    }
  };

  getAvatar = () => {
    const { heading, option } = this.props;
    switch (heading) {
      case 'date_start':
        return null;
      default:
        return (
          <Grid item>
            <Avatar src={this.props.option.user.photo} />
          </Grid>
        );
    }
  };

  render() {
    const { option, t } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={16}
          >
            {this.getAvatar()}
            <Grid item>
              <ListItemText
                primary={this.getHeading()}
                secondary={
                  option.is_convertible
                    ? t('booking.waitingUserConfirmation')
                    : t('booking.onWaitingList')
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>{this.renderButton()}</Grid>
      </Grid>
    );
  }
}

export default translate()(BookingOptionForManager);
