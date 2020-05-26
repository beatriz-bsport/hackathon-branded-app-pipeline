// @flow

import React from 'react';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Trans, useTranslation } from 'react-i18next';
import moment from 'moment';

import type { Alerting, UnevenInvoiceAlerting } from '../types';

type Props = {
  alerting: Alerting,
  pushRouter: (path: string) => void,
};

const useStyles = makeStyles(() => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const UnevenAlertListItem = (props: {
  pushRouter: (string) => void,
  alerting: UnevenInvoiceAlerting,
}) => {
  const { alerting } = props;
  const { t } = useTranslation(['alerting']);
  const classes = useStyles();
  const { uuid, price_payed, price_due } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {t('unevenInvoice.title')}
          </Typography>
          <IconButton
            onClick={() => props.pushRouter(`/invoice/${alerting.data.uuid}`)}
          >
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>
        <Typography variant="caption" component="p">
          <Trans t={t} i18nKey="unevenInvoice.explainUneven" uuid={uuid}>
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

const NewOrderAlertListItem = (props: {
  pushRouter: (string) => void,
  alerting: NewOrderAlerting,
}) => {
  const { alerting } = props;
  const classes = useStyles();
  const { order, price, name } = alerting.data;
  const { t } = useTranslation(['alerting']);
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
          <Trans t={t} i18nKey="newOrder.explain" name={name}>
            New order paid by <strong>{{ name }}</strong>
          </Trans>
          <br />
          {t('newOrder.price', { price })}
        </Typography>
      </div>
    </ListItem>
  );
};

const TaskAlertListItem = (props: {
  pushRouter: (string) => void,
  alerting: TaskAlerting,
}) => {
  const { alerting } = props;
  const classes = useStyles();
  const { name, description, date_due, member } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div>
            <Typography variant="subtitle1" component="h3">
              {name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(date_due).format('LL')}
            </Typography>
          </div>
          <div className={classes.titleContainer}>
            <IconButton
              onClick={() => props.pushRouter(`/member/${member.id}/`)}
            >
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          {member ? member.name : null}
          <br />
          {description}
        </Typography>
      </div>
    </ListItem>
  );
};

export default function AlertList(props: Props) {
  const { alerting, pushRouter } = props;
  switch (alerting.alert_kind) {
    case 1:
      return (
        <UnevenAlertListItem alerting={alerting} pushRouter={pushRouter} />
      );
    case 2:
      return (
        <NewOrderAlertListItem alerting={alerting} pushRouter={pushRouter} />
      );
    case 3:
      return <TaskAlertListItem alerting={alerting} pushRouter={pushRouter} />;
    default:
      return null;
  }
}
