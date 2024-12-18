import React, { Component } from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  createStyles,
  withStyles,
  WithStyles,
  Paper,
  Typography,
  Avatar,
  Theme,
} from '@material-ui/core';

import ConsumerPackRowItem from '#src/libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import { anonymizeName, anonymizeEmail } from '#src/libs/member/utils';

import type { BookingWithConsumerPaymentPack } from '#src/libs/booking/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { MemberMinimal } from '#src/libs/member/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { SpotInformation } from '#src/libs/spot-scheduling/types';

type OwnProps = {
  booking: BookingWithConsumerPaymentPack;
  member: MemberMinimal;
  offer: OfferREST;
  establishment: Establishment;
  goBack: () => void;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;

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
    const { classes, member } = this.props;

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
              // @ts-expect-error TODO - typing
              consumerPack={this.props.booking?.consumer_payment_pack}
              paymentPack={
                this.props.booking?.consumer_payment_pack?.payment_pack
              }
            />
          </Paper>
        </div>
      </React.Fragment>
    );
  };

  renderRightPanel = () => {
    const { classes, t, offer, booking } = this.props;

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
            {this.props.establishment?.title ?? '-'}
          </Typography>
          {!!offer?.room_blueprint && (
            <>
              <Typography align="center" color="textSecondary">
                {t('confirmPage.spotInfo', {
                  spotName:
                    (booking?.spot_information as SpotInformation)?.name ||
                    'Spot',
                })}
              </Typography>
              <Typography align="center" variant="h6">
                {booking?.spot_id
                  ? `${
                      (booking?.spot_information as SpotInformation)?.prefix ||
                      ''
                    }${
                      (booking?.spot_information as SpotInformation)
                        ?.indexType || ''
                    }${
                      (booking?.spot_information as SpotInformation)?.suffix ||
                      ''
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

const styles = (theme: Theme) =>
  createStyles({
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
  });

export default compose<OwnProps, Props>(
  withStyles(styles),
  withTranslation(['selfCheckIn']),
)(CheckInConfirm);
