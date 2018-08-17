import React from 'react';

import {
  Paper,
  Typography,
  Grid,
  withStyles,
  Divider,
  Button,
} from '@material-ui/core';
import { RotateLeft, Receipt, ShoppingCart, Stars } from '@material-ui/icons';

import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

type Props = {};

export class RuleCard extends React.Component<Props> {
  renderRuleStats = (rule) => {
    const { t } = this.props;
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
    const { t } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="title">{t('marketing.action')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={8} alignItems="flex-end">
            <Grid item>
              <Typography variant="body1">{rule.SMSSent}</Typography>
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
              <Typography variant="body1">{rule.EmailSent}</Typography>
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
              <Typography variant="body1">{rule.notificationSent}</Typography>
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
              <Typography variant="body1">{rule.clientReached}</Typography>
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
    const { t } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="title">{t('marketing.criterias')}</Typography>
        </Grid>
        {rule.criterias.map((c) => (
          <Grid key={c.name} item>
            <Grid container direction="row" spacing={8}>
              <Grid item>
                <Typography variant="caption" style={{ color: 'black' }} />
                {c.name} :{' '}
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
    const { classes } = this.props;
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

  render() {
    const { rule } = this.props;
    const { t, classes } = this.props;
    return (
      <Grid item xs={12} lg={6}>
        <Paper className={classes.paperContainer}>
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
        </Paper>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  ruleTitle: {
    marginBottom: theme.spacing.unit,
  },
  paperContainer: {
    padding: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(translate()(RuleCard));
