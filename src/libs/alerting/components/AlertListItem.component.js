// @flow

import React from 'react';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Trans, withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import type { Alerting, UnevenInvoiceAlerting } from '../types';

type Props = {
  alerting: Alerting,
  pushRouter: (path: string) => void,
  deleteAlert: (id: number) => void,
};

const styles = () => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const UnevenAlertListItemBase = (props: {
  t: TFunction,
  pushRouter: (string) => void,
  alerting: UnevenInvoiceAlerting,
  classes: Object,
}) => {
  const { t, alerting, classes } = props;
  const { uuid, price_payed, price_due } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {t('unevenInvoice.title')}
          </Typography>
          <IconButton>
            <ArrowForwardIcon
              color="secondary"
              onClick={() => props.pushRouter(`/invoice/${alerting.data.uuid}`)}
            />
          </IconButton>
        </div>
        <Typography variant="caption" component="p">
          <Trans i18nKey="unevenInvoice.explainUneven" uuid={uuid}>
            The invoice <strong>{{ uuid }}</strong> is uneven
          </Trans>
          <br />
          {t('unevenInvoice.pricePayed', { price_payed })}
          <br />
          {t('unevenInvoice.priceDue', { price_due })}
        </Typography>
      </div>
    </ListItem>
  );
};

const UnevenAlertListItem = compose(
  withStyles(styles),
  withNamespaces(['alerting']),
)(UnevenAlertListItemBase);

const NewOrderAlertListItemBase = (props: {
  t: TFunction,
  pushRouter: (string) => void,
  deleteAlert: (id: number) => void,
  alerting: NewOrderAlerting,
  classes: Object,
}) => {
  const { t, alerting, classes } = props;
  const { order, price, name } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {t('newOrder.title')}
          </Typography>
          <div className={classes.titleContainer}>
            <IconButton onClick={() => props.pushRouter(`/order/${order}`)}>
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          <Trans i18nKey="newOrder.explain" name={name}>
            New order paid by <strong>{{ name }}</strong>
          </Trans>
          <br />
          {t('newOrder.price', { price })}
        </Typography>
      </div>
    </ListItem>
  );
};

const NewOrderAlertListItem = compose(
  withStyles(styles),
  withNamespaces(['alerting']),
)(NewOrderAlertListItemBase);

export default function AlertList(props: Props) {
  const { alerting, pushRouter, deleteAlert } = props;
  switch (alerting.alert_kind) {
    case 1:
      return (
        <UnevenAlertListItem alerting={alerting} pushRouter={pushRouter} />
      );
    case 2:
      return (
        <NewOrderAlertListItem
          alerting={alerting}
          pushRouter={pushRouter}
          deleteAlert={deleteAlert}
        />
      );
    default:
      return null;
  }
}
