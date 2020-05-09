// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyle from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment';

import type { TFunction } from 'react-i18next';

type RecapProps = {
  member: ?Member,
  price: ?number,
  periodName: ?string,
  nbPeriod: ?number,
  subscriptionContentName: ?string,
  recurrentVoucher: ?number,

  classes: Object,
  t: TFunction,
};

const RecapSubscription = (props: RecapProps) => (
  <div>
    <div className={props.classes.section}>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {props.member ? props.member.name : ' -- '}
      </Typography>
      <Typography inline>{`${props.t('recap.willBecharged')}`}</Typography>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {props.price
          ? parseFloat(props.price) - parseFloat(props.recurrentVoucher)
          : '-- '}{' '}
        €
      </Typography>
      <Typography inline>{`${props.t('recap.every')}`}</Typography>
      <Typography inline>{props.t(`recap.${props.periodName}`)}</Typography>
      <Typography inline>{`${props.t('recap.forObject')}`}</Typography>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {props.subscriptionContentName || '--'}
      </Typography>
    </div>
    <div className={props.classes.section}>
      <Typography inline>{`${props.t('recap.from')}`}</Typography>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {moment().format('DD/MM/YYYY') || '--/--/----'}
      </Typography>
      <Typography inline>{`${props.t('recap.to')}`}</Typography>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {props.nbPeriod
          ? moment()
              .add('months', props.nbPeriod)
              .format('DD/MM/YYYY')
          : '--/--/----'}
      </Typography>
    </div>
    <div className={props.classes.section}>
      <Typography inline>{props.t('recap.forATotalOf')}</Typography>
      <Typography color="error" inline className={props.classes.highlightText}>
        {props.price && props.nbPeriod
          ? parseInt(props.nbPeriod, 10) *
            (parseFloat(props.price) - parseFloat(props.recurrentVoucher))
          : '--'}{' '}
        €
      </Typography>
    </div>
  </div>
);

const styles = (theme) => ({
  highlightText: {
    fontSize: 16,
  },
  section: {
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withStyle(styles),
  withNamespaces(['subscription']),
)(RecapSubscription);
