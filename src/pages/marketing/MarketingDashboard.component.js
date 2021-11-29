// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import { Moment } from '../../i18n';

import RuleCard from '../../components/marketing/RuleCard.component';

import withTitle from '../../hocs/with-title.hoc';

type Props = {
  t: (x: string) => string,
  classes: Object,
};
type State = {
  rules: Array<*>,
};

const getRules = function (t) {
  return [
    {
      id: 1,
      name: `${t('strategy.strategy')} #1`,
      date: Moment(),
      conversionRate: 0.04,
      averageBuy: 70,
      sales: 10,
      totalBuy: 700,
      SMSSent: 240,
      EmailSent: 510,
      notificationSent: 110,
      clientReached: 521,
      criterias: [
        {
          name: t('strategy.sport'),
          value: t('strategy.yoga'),
        },
        {
          name: t('strategy.gender'),
          value: t('strategy.female'),
        },
        {
          name: t('strategy.location'),
          value: t('strategy.gym'),
        },
        {
          name: t('strategy.gaveUp'),
          value: `4 ${t('strategy.sessions')}`,
        },
      ],
    },
    {
      id: 2,
      name: `${t('strategy.strategy')} #2`,
      date: Moment(),
      conversionRate: 0.12,
      averageBuy: 20,
      sales: 40,
      totalBuy: 800,
      SMSSent: 430,
      EmailSent: 600,
      clientReached: 1232,
      notificationSent: 60,
      criterias: [
        {
          name: t('strategy.sport'),
          value: t('strategy.crossfit'),
        },
        {
          name: t('strategy.membership'),
          value: t('strategy.none'),
        },
        {
          name: t('strategy.offersWithoutMembership'),
          value: 5,
        },
      ],
    },
  ];
};

export class MarketingDashboard extends Component<Props, State> {
  state = {
    rules: getRules(this.props.t),
  };

  render() {
    const { rules } = this.state;
    const { classes, t } = this.props;
    return (
      <div>
        <Grid container direction="row" spacing={4}>
          {rules.map((r) => (
            <RuleCard key={r.id} rule={r} />
          ))}
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    marginBottom: theme.spacing(4),
  },
});

export default withStyles(styles)(
  withTranslation()(
    withTitle(({ t }: { t: TFunction }) =>
      t('titles:marketing.marketingDashboard'),
    )(MarketingDashboard),
  ),
);
