import React, { Component } from 'react';

import {
  Paper,
  Typography,
  Grid,
  withStyles,
  Divider,
  Button,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { RotateLeft } from '@material-ui/icons';
import { Receipt } from '@material-ui/icons';
import { ShoppingCart } from '@material-ui/icons';
import { Stars } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import { Moment } from '../i18n';

const styles = (theme) => ({
  container: {},
  title: {
    marginBottom: theme.spacing.unit * 4,
  },
  ruleTitle: {
    marginBottom: theme.spacing.unit,
  },
  paperContainer: {
    padding: theme.spacing.unit * 4,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#DDDDDD',
  },
  horizontalDivider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: -theme.spacing.unit * 4,
    marginLeft: -theme.spacing.unit * 4,
  },
});

type Props = {
  rules: Array,
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

export class MarketingDashboard extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      rules: RULES,
    };
  }

  renderRuleStats = (rule) => {
    const { t, classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        spacing={16}
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <Grid container direction="column" spacing={8}>
            <Grid item>
              <Typography>{t('marketing.conversionRate')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={8}>
                <Grid item>
                  <RotateLeft color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="title">
                    {rule.conversionRate * 100} %
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={8}>
            <Grid item>
              <Typography>{t('marketing.sales')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={8}>
                <Grid item>
                  <Receipt color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="title">{rule.sales}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={8}>
            <Grid item>
              <Typography>{t('marketing.averageBuy')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={8}>
                <Grid item>
                  <ShoppingCart color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="title">{rule.averageBuy} €</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={8}>
            <Grid item>
              <Typography>{t('marketing.totalBuy')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={8}>
                <Grid item>
                  <Stars color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="title">{rule.totalBuy} €</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderRuleActions = (rule) => {
    const { classes, t } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="title">{t('marketing.action')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={8} alignItems="flex-end">
            <Grid item>
              <Typography variant="body">{rule.SMSSent}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {t('marketing.SMSSent')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={8} alignItems="flex-end">
            <Grid item>
              <Typography variant="body">{rule.EmailSent}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {t('marketing.EmailSent')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={8} alignItems="flex-end">
            <Grid item>
              <Typography variant="body">{rule.notificationSent}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {t('marketing.notificationsSent')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={8} alignItems="flex-end">
            <Grid item>
              <Typography variant="body">{rule.clientReached}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                {t('marketing.clientsReached')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderRuleTriggers = (rule) => {
    const { classes, t } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="title">{t('marketing.criterias')}</Typography>
        </Grid>
        {rule.criterias.map((c) => (
          <Grid item>
            <Grid container direction="row" spacing={8}>
              <Grid item>
                <Typography variant="caption" style={{ color: 'black' }}>
                  {c.name} :{' '}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption">{c.value} </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  };

  renderRuleDetails = (rule) => {
    const { t, classes } = this.props;
    return (
      <Grid container direction="row">
        <Grid item xs={6}>
          {this.renderRuleActions(rule)}
        </Grid>
        <Grid item xs={1}>
          <div className={classes.verticalDivider} />
        </Grid>
        <Grid item xs={5}>
          {this.renderRuleTriggers(rule)}
        </Grid>
      </Grid>
    );
  };

  renderRule = (rule) => {
    const { t, classes } = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="title" className={classes.ruleTitle}>
                {rule.name}
              </Typography>
            </Grid>
            <Grid item>
              <Link
                to={`/marketing/rule/${rule.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Button color="primary">{t('common.edit')}</Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Divider className={classes.horizontalDivider} />
        <Grid item>{this.renderRuleStats(rule)}</Grid>
        <Divider className={classes.horizontalDivider} />
        <Grid item>{this.renderRuleDetails(rule)}</Grid>
      </Grid>
    );
  };

  render() {
    const { rules } = this.state;
    const { classes, t } = this.props;
    return (
      <div>
        <Typography variant="display2" className={classes.title}>
          {' '}
          {t('marketing.dashboard')}
        </Typography>
        <Grid container direction="row" spacing={32}>
          {rules.map((r) => (
            <Grid item xs={12} lg={6}>
              <Paper className={classes.paperContainer}>
                {this.renderRule(r)}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(MarketingDashboard));
