// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyle from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';

type RecapProps = {
  member: ?Member,
  price: ?number,
  periodName: ?string,
  nbPeriod: ?number,
  dateStart: ?Object,
  subscriptionContentName: ?string,

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
        {props.price || '--'} €
      </Typography>
      <Typography inline>{`${props.t('recap.every')}`}</Typography>
      <Typography inline>{props.t(`recap.${props.periodName}`)}</Typography>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {props.nbPeriod || '--'}
      </Typography>
      <Typography inline>{props.t('recap.times')}</Typography>
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
        {(props.dateStart && props.dateStart.format('DD/MM/YYYY')) ||
          '--/--/----'}
      </Typography>
      <Typography inline>{`${props.t('recap.to')}`}</Typography>
      <Typography
        className={props.classes.highlightText}
        color="primary"
        inline
      >
        {(props.dateStart &&
          props.dateStart
            .clone()
            .add('months', props.nbPeriod)
            .format('DD/MM/YYYY')) ||
          '--/--/----'}
      </Typography>
    </div>
    <div className={props.classes.section}>
      <Typography inline>{props.t('recap.forATotalOf')}</Typography>
      <Typography color="error" inline className={props.classes.highlightText}>
        {props.price && props.nbPeriod
          ? parseInt(props.nbPeriod, 10) * parseFloat(props.price)
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
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withStyle(styles),
  withNamespaces(['subscription']),
)(RecapSubscription);
