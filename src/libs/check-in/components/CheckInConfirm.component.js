// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { anonymizeName, anonymizeEmail } from '#libs/member/utils';
import type { MemberWithBooking } from '../../member/types';
import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  member: MemberWithBooking,
  booking: any,
  offer: any,
  goBack: () => void,
};

const DISMISS_TIMER = 1000 * 3; // this page dismiss in 3 seconds

class CheckInConfirm extends Component<Props> {
  dismissTimer: any;

  componentDidMount() {
    const { goBack } = this.props;
    this.dismissTimer = setTimeout(goBack, DISMISS_TIMER);
  }

  dismissConfirm = () => {
    this.props.goBack();
  };

  componentWillUnmount() {
    clearTimeout(this.dismissTimer);
  }

  renderLeftPanel = () => {
    const { classes, member, booking } = this.props;

    return (
      <React.Fragment>
        <div className={classes.leftHeader} />
        <div className={classes.column}>
          <Avatar className={classes.memberAvatar} src={member?.photo ?? ''} />
          <Typography variant="h5">
            {member && member.first_name ? member.first_name : ''}
            &nbsp;
            {member && member.last_name ? anonymizeName(member.last_name) : ''}
          </Typography>
          <Typography align="center" color="textSecondary" variant="body1">
            {member && member.email ? anonymizeEmail(member.email) : ''}
          </Typography>
          <Paper className={classes.footer}>
            <ConsumerPackRowItem
              hideConsumer
              noDivider
              consumerPack={booking?.consumer_payment_pack}
              paymentPack={booking?.consumer_payment_pack?.payment_pack}
            />
          </Paper>
        </div>
      </React.Fragment>
    );
  };

  renderRightPanel = () => {
    const { classes, t, offer, member } = this.props;

    return (
      <React.Fragment>
        <div className={classes.rightHeader}>
          <Typography className={classes.headerTitle} variant="h3">
            {t('confirmPage.signIn')}
          </Typography>
        </div>
        <div className={classes.columnCentered}>
          <Typography className={classes.paddedElement} variant="h2">
            {t('confirmPage.headOnIn')}
          </Typography>
          <Typography
            align="center"
            className={classes.paddedElement}
            color="textSecondary"
            variant="subtitle1"
          >
            {t('confirmPage.classLocation')}
          </Typography>
          <Typography align="center" variant="h6">
            {offer?.etablissement?.title ?? '-'}
          </Typography>
          {!!offer?.room_blueprint && (
            <>
              <Typography align="center" color="textSecondary">
                {t('confirmPage.spotInfo', {
                  spotName: member?.booking?.spot_information?.name || 'Spot',
                })}
              </Typography>
              <Typography align="center" variant="h6">
                {member?.booking?.spot_id
                  ? `${member.booking.spot_information?.prefix || ''}${
                      member.booking.spot_id || ''
                    }`
                  : t('confirmPage.spotUnassigned')}
              </Typography>
            </>
          )}
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <Paper className={this.props.classes.paper}>
        <div className={this.props.classes.leftPanel}>
          {this.renderLeftPanel()}
        </div>
        <div className={this.props.classes.rightPanel}>
          {this.renderRightPanel()}
        </div>
      </Paper>
    );
  }
}

const style = (theme) => {
  return {
    paper: {
      borderRadius: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      height: '100%',
      width: '100%',
    },
    leftPanel: {
      backgroundColor: theme.palette.grey[200],
      padding: '0 !important',
      width: '40%',
      height: '100%',
    },
    rightPanel: {
      position: 'relative',
      width: '60%',
      height: '100%',
      padding: '0 !important',
    },
    leftHeader: {
      backgroundColor: theme.palette.primary.dark,
      height: theme.spacing(12),
    },
    rightHeader: {
      backgroundColor: theme.palette.primary.main,
      height: theme.spacing(12),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: theme.palette.grey[50],
      textAlign: 'center',
    },
    memberAvatar: {
      marginTop: theme.spacing(-8),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
    visitsLeft: {
      border: `3px solid ${theme.palette.grey[50]}`,
      width: theme.spacing(8),
      height: theme.spacing(8),
      borderRadius: theme.shape.borderRadius * 11,
      paddingTop: theme.spacing(2) - 2,
    },
    columnCentered: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      paddingTop: theme.spacing(8),
    },
    paddedElement: {
      paddingTop: theme.spacing(2),
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    footer: {
      margin: theme.spacing(3),
    },
    marginTop: {
      marginTop: theme.spacing(3),
    },
    backButton: {
      position: 'absolute',
      bottom: theme.spacing(2),
      left: theme.spacing(2),
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
    },
  };
};

export default withStyles(style)(
  withTranslation(['selfCheckIn'])(CheckInConfirm),
);
