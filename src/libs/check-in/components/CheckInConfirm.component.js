// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import type { Member } from '../../member/types';

import ConsumerPackRowItem from '../../payment-packs/ConsumerPackRowItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  member: Member,
  paymentPack: any,
  booking: any,
  offer: any,
  goBack: () => void,
};

const DISMISS_TIMER = 1000 * 6; // this page dismiss in 20 second

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
    const { classes, member, paymentPack, booking } = this.props;

    return (
      <React.Fragment>
        <div item className={classes.leftHeader} />
        <div className={classes.column}>
          <Avatar src={member.photo} className={classes.memberAvatar} />
          <Typography variant="h5">
            {member && member.name ? member.name : ''}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {member && member.email ? member.email : ''}
          </Typography>
          <Paper className={classes.footer}>
            <ConsumerPackRowItem
              hideConsumer
              noDivider
              consumerPack={booking.consumer_payment_pack}
              paymentPack={paymentPack}
            />
          </Paper>
        </div>
      </React.Fragment>
    );
  };

  renderRightPanel = () => {
    const { classes, t, offer } = this.props;

    return (
      <React.Fragment>
        <div className={classes.rightHeader}>
          <Typography variant="h3" className={classes.headerTitle}>
            {t('confirmPage.signIn')}
          </Typography>
        </div>
        <div className={classes.columnCentered}>
          <Typography className={classes.paddedElement} variant="h2">
            {t('confirmPage.headOnIn')}
          </Typography>
          <Typography
            className={classes.paddedElement}
            variant="subtitle1"
            color="textSecondary"
            align="center"
          >
            {t('confirmPage.classLocation')}
          </Typography>
          <Typography variant="h6" align="center">
            {offer
              ? (offer.establishment_override || offer.etablissement).title
              : ''}
          </Typography>
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
          <Button
            variant="extendedFab"
            color="primary"
            className={this.props.classes.backButton}
            onClick={this.dismissConfirm}
          >
            <ChevronLeftIcon className={this.props.classes.buttonIcon} />
            {this.props.t('translation:navigation.goBack')}
          </Button>
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
      minHeight: '70vh',
    },
    leftPanel: {
      backgroundColor: theme.palette.grey[200],
      padding: '0 !important',
      width: '40%',
      minHeight: '70vh',
    },
    rightPanel: {
      position: 'relative',
      width: '60%',
      minHeight: '70vh',
      padding: '0 !important',
    },
    leftHeader: {
      backgroundColor: theme.palette.primary.dark,
      height: theme.spacing.unit * 12,
    },
    rightHeader: {
      backgroundColor: theme.palette.primary.main,
      height: theme.spacing.unit * 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: theme.palette.grey[50],
      textAlign: 'center',
    },
    memberAvatar: {
      marginTop: -theme.spacing.unit * 8,
      width: theme.spacing.unit * 16,
      height: theme.spacing.unit * 16,
    },
    visitsLeft: {
      border: `3px solid ${theme.palette.grey[50]}`,
      width: theme.spacing.unit * 8,
      height: theme.spacing.unit * 8,
      borderRadius: theme.shape.borderRadius * 11,
      paddingTop: theme.spacing.unit * 2 - 2,
    },
    columnCentered: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      paddingTop: theme.spacing.unit * 8,
    },
    paddedElement: {
      paddingTop: theme.spacing.unit * 2,
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    footer: {
      margin: theme.spacing.unit * 3,
    },
    marginTop: {
      marginTop: theme.spacing.unit * 3,
    },
    backButton: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      left: theme.spacing.unit * 2,
    },
    buttonIcon: {
      marginRight: theme.spacing.unit,
    },
  };
};

export default withStyles(style)(
  withNamespaces(['selfCheckIn'])(CheckInConfirm),
);
