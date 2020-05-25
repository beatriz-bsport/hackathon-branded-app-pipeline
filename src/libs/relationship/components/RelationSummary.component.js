// @flow
import React from 'react';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoIcon from '@material-ui/icons/Info';
import RefreshIcon from '@material-ui/icons/Refresh';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import type { ConsumerPaymentPackLink } from '../types';

import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';

type Props = {
  t: TFunction,
  relation: MemberRelationDetail,
  consumerPaymentPackLinks: Array<ConsumerPaymentPackLink>,
  unlinkPassLinking: (id: number) => void,
  relinkPassLinking: (id: number) => void,
  classes: Object,
  requestPassLinking: () => void,
};

export const RelationSummary = (props: Props) => {
  const { t, classes, relation, consumerPaymentPackLinks } = props;
  if (!relation) {
    return (
      <div>
        <div className={props.classes.nothingSelectedContainer}>
          <InfoIcon fontSize="large" color="disabled" />
          <Typography
            className={props.classes.emptyMessageText}
            color="textSecondary"
            variant="caption"
          >
            {props.t('member.list.pleaseSelectOne')}
          </Typography>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h5" component="h3">
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
                  disabled={!s_cpp.is_active}
                  consumerPack={consumerPack}
                  paymentPack={(s_cpp.src || s_cpp.dst || {}).payment_pack}
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
        variant="outlined"
        color="primary"
        onClick={props.requestPassLinking}
        className={classes.addButton}
      >
        <AddIcon className={classes.leftIcon} />
        {t('consumer_payment_pack_links.list.create')}
      </Button>
    </div>
  );
};

const styles = (theme) => ({
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
