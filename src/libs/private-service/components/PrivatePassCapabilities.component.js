// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import { compose, withState } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import RefreshIcon from '@material-ui/icons/Refresh';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import PrivatePassBookerListItem from './booking-module/PrivatePassBookerListItem.component';
import PrivateConsumerPassBookerListItem from './booking-module/PrivateConsumerPassBookerListItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  needRefresh: boolean,
  setNeedRefresh: (boolean) => void,

  registerPrivateBooking: (privateConsumerPassId: number) => void,
  billMemberPrivatePass: (privatePassId: number) => void,
  fetchPass: () => void,
  compatiblePrivatePass: Array<PrivatePass>,
  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>,
  recurrenceRule?: boolean,
  createRecurrentRule?: () => void,
};

export const PrivatePassCapabilities = (props: Props) => {
  const { t, classes } = props;
  return (
    <div>
      <Typography variant="h5" className={classes.sectionTitle}>
        {t('privateBooking.managerAdd.compatiblePrivateConsumerPass')}
      </Typography>
      <Divider className={props.classes.divider} />
      {props.needRefresh ? (
        <div className={classes.refreshButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.fetchPass();
              props.setNeedRefresh(false);
            }}
          >
            <RefreshIcon className={classes.leftIcon} />
            {t('privateBooking.managerAdd.privateConsumerPassNeedRefresh')}
          </Button>
        </div>
      ) : (
        <List disablePadding>
          {props.compatiblePrivateConsumerPass.length ? (
            <Paper>
              {props.compatiblePrivateConsumerPass.map((pcp) => (
                <PrivateConsumerPassBookerListItem
                  private_consumer_pass={pcp}
                  onBook={(options) =>
                    props.recurrenceRule
                      ? props.createRecurrentRule(options)
                      : props.registerPrivateBooking(pcp.id, options)
                  }
                  key={pcp.id}
                  divider
                />
              ))}
            </Paper>
          ) : null}
        </List>
      )}
      {props.compatiblePrivateConsumerPass.length === 0 &&
      !props.needRefresh ? (
        <Typography color="textSecondary">
          {t('privateBooking.managerAdd.emptyPrivateConsumerPass')}
        </Typography>
      ) : null}
      <Typography variant="h5" className={classes.sectionTitle}>
        {t('privateBooking.managerAdd.compatiblePrivatePass')}
      </Typography>
      <Divider className={props.classes.divider} />
      <List disablePadding>
        {props.compatiblePrivatePass.length ? (
          <Paper>
            {props.compatiblePrivatePass.map((pp) => (
              <PrivatePassBookerListItem
                private_pass={pp}
                onClick={() => {
                  props.billMemberPrivatePass(pp.id);
                  props.setNeedRefresh(true);
                }}
                key={pp.id}
                divider
              />
            ))}
          </Paper>
        ) : null}
      </List>
      {props.compatiblePrivatePass.length === 0 ? (
        <Typography color="textSecondary">
          {t('privateBooking.managerAdd.emptyPrivatePass')}
        </Typography>
      ) : null}
    </div>
  );
};

const styles = (theme) => ({
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  refreshButtonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('needRefresh', 'setNeedRefresh', false),
)(PrivatePassCapabilities);
