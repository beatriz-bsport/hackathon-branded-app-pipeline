// @flow
import React from 'react';
import Alert from '@material-ui/lab/Alert/Alert';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import RefreshIcon from '@material-ui/icons/Refresh';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import type {
  ConsumerPaymentPackLink,
  PrivateConsumerPassLink,
} from '../types';

import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import PrivateConsumerPassBookerListItem from '../../private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';

type Props = {
  t: TFunction,
  relation: MemberRelationDetail,
  consumerPaymentPackLinks: Array<ConsumerPaymentPackLink>,
  unlinkPassLinking: (id: number) => void,
  relinkPassLinking: (id: number) => void,
  classes: Object,
  requestPassLinking: () => void,
  privateConsumerPassLinks: Array<PrivateConsumerPassLink>,
  requestPrivatePassLinking: () => void,
  unlinkPrivateConsumerPass: (id: number) => void,
  relinkPrivateConsumerPass: (id: number) => void,
};

export const RelationSummary = (props: Props) => {
  const {
    t,
    classes,
    relation,
    consumerPaymentPackLinks,
    privateConsumerPassLinks,
  } = props;
  if (!relation) {
    return (
      <div>
        <div className={props.classes.nothingSelectedContainer}>
          <Alert className={classes.alertInfo} color="grey" severity="info">
            {props.t('member.list.pleaseSelectOne')}
          </Alert>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={classes.container}>
        <Typography className={classes.title} component="h3" variant="h5">
          {t('consumer_payment_pack_links.list.title')}
        </Typography>
        {consumerPaymentPackLinks.length ? (
          <Paper>
            <List disablePadding>
              {consumerPaymentPackLinks.map((s_cpp, idx) => {
                // we dont know wether src or dst consumerPack is
                // loaded but they are assumed to be the same
                const consumerPack = s_cpp.src || s_cpp.dst || {};
                return (
                  <ConsumerPackRowItem
                    key={idx}
                    hideConsumer
                    button={
                      s_cpp.is_active ? (
                        <IconButton
                          onClick={() => props.unlinkPassLinking(s_cpp.id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => props.relinkPassLinking(s_cpp.id)}
                        >
                          <RefreshIcon />
                        </IconButton>
                      )
                    }
                    consumerPack={consumerPack}
                    disabled={!s_cpp.is_active}
                    paymentPack={(s_cpp.src || s_cpp.dst || {}).payment_pack}
                  />
                );
              })}
            </List>
          </Paper>
        ) : (
          <div>
            <Typography className={classes.emptyText} color="textSecondary">
              {t('consumer_payment_pack_links.list.isEmpty')}
            </Typography>
          </div>
        )}
        <Button
          className={classes.addButton}
          color="primary"
          onClick={props.requestPassLinking}
          variant="outlined"
        >
          <AddIcon className={classes.leftIcon} />
          {t('consumer_payment_pack_links.list.create')}
        </Button>
      </div>
      <div className={classes.container}>
        <Typography className={classes.title} component="h3" variant="h5">
          {t('private_consumer_pass_links.list.title')}
        </Typography>
        {privateConsumerPassLinks && privateConsumerPassLinks.length ? (
          <Paper>
            <List disablePadding>
              {privateConsumerPassLinks.map((s_pcp, idx) => {
                const privateConsumerPass = s_pcp.src || s_pcp.dst || {};
                return (
                  <PrivateConsumerPassBookerListItem
                    key={idx}
                    divider
                    button={
                      s_pcp.is_active ? (
                        <IconButton
                          onClick={() =>
                            props.unlinkPrivateConsumerPass(s_pcp.id)
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() =>
                            props.relinkPrivateConsumerPass(s_pcp.id)
                          }
                        >
                          <RefreshIcon />
                        </IconButton>
                      )
                    }
                    disabled={!s_pcp.is_active}
                    private_consumer_pass={privateConsumerPass}
                  />
                );
              })}
            </List>
          </Paper>
        ) : (
          <div>
            <Typography className={classes.emptyText} color="textSecondary">
              {t('private_consumer_pass_links.list.isEmpty')}
            </Typography>
          </div>
        )}
        <Button
          className={classes.addButton}
          color="primary"
          onClick={props.requestPrivatePassLinking}
          variant="outlined"
        >
          <AddIcon className={classes.leftIcon} />
          {t('private_consumer_pass_links.list.create')}
        </Button>
      </div>
    </>
  );
};

const styles = (theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  loadingContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    padding: theme.spacing(2),
    paddingLeft: 0,
  },
  container: {
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  nothingSelectedContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  emptyMessageText: {
    marginTop: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['relationship']),
)(RelationSummary);
