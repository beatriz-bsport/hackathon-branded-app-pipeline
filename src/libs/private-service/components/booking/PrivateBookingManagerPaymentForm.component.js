// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PrivateConsumerPassBookerListItem from '../booking-module/PrivateConsumerPassBookerListItem.component';
import PrivatePassBookerListItem from '../booking-module/PrivatePassBookerListItem.component';

type Props = {
  t: TFunction,
  classes: Object,

  privateSlotId: number,
  fetchPass: (privateSlotId: number) => void,
  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>,
  compatiblePrivatePass: Array<PrivatePass>,

  onSelectConsumerPass: (private_consumer_pass: number) => void,

  billMemberPrivatePass: (privatePassId: number) => void,
};

type State = {
  privateConsumerPassNeedRefresh: boolean,
};

export class PrivateBookingManagerPaymentForm extends React.Component<
  Props,
  State,
> {
  state = {
    privateConsumerPassNeedRefresh: false,
  };

  componentDidMount() {
    this.props.fetchPass(this.props.privateSlotId);
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('privateBooking.managerAdd.compatiblePrivateConsumerPass')}
        </Typography>
        {this.state.privateConsumerPassNeedRefresh ? (
          <div className={classes.refreshButtonContainer}>
            <Button
              variant="outlined"
              onClick={() => {
                this.props.fetchPass(this.props.privateSlotId);
                this.setState({ privateConsumerPassNeedRefresh: false });
              }}
            >
              <RefreshIcon className={classes.leftIcon} />
              {t('privateBooking.managerAdd.privateConsumerPassNeedRefresh')}
            </Button>
          </div>
        ) : (
          <List disablePadding>
            {this.props.compatiblePrivateConsumerPass.map((pcp) => (
              <PrivateConsumerPassBookerListItem
                private_consumer_pass={pcp}
                onBook={() => {
                  this.props.onSelectConsumerPass(pcp.id);
                }}
                key={pcp.id}
              />
            ))}
          </List>
        )}
        {this.props.compatiblePrivateConsumerPass.length === 0 &&
        !this.state.privateConsumerPassNeedRefresh ? (
          <Typography color="textSecondary">
            {t('privateBooking.managerAdd.emptyPrivateConsumerPass')}
          </Typography>
        ) : null}
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('privateBooking.managerAdd.compatiblePrivatePass')}
        </Typography>
        <List disablePadding>
          {this.props.compatiblePrivatePass.map((pp) => (
            <PrivatePassBookerListItem
              private_pass={pp}
              onClick={() => {
                this.props.billMemberPrivatePass(pp.id);
                this.setState({ privateConsumerPassNeedRefresh: true });
              }}
              key={pp.id}
            />
          ))}
        </List>
        {this.props.compatiblePrivatePass.length === 0 ? (
          <Typography color="textSecondary">
            {t('privateBooking.managerAdd.emptyPrivatePass')}
          </Typography>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  refreshButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateBookingManagerPaymentForm);
