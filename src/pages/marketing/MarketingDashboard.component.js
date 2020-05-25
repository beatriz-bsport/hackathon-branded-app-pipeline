// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

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

const RULES = [
  {
    id: 1,
    name: 'Stratégie #1',
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
        name: 'sport',
        value: 'Yoga',
      },
      {
        name: 'sexe',
        value: 'F',
      },
      {
        name: 'location',
        value: 'Gymnase Beaulieu',
      },
      {
        name: 'Abandon depuis',
        value: '4 séances',
      },
    ],
  },
  {
    id: 2,
    name: 'Stratégie #2',
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
        name: 'sport',
        value: 'Crossfit',
      },
      {
        name: 'Abonnement',
        value: 'aucun',
      },
      {
        name: 'Séance sans abonnement',
        value: 5,
      },
    ],
  },
];

export class MarketingDashboard extends Component<Props, State> {
  state = {
    rules: RULES,
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
