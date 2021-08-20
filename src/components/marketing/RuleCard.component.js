import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import RotateLeft from '@material-ui/icons/RotateLeft';
import Receipt from '@material-ui/icons/Receipt';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Stars from '@material-ui/icons/Stars';

import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCurrencyDisplayWithPrice } from '../../libs/theme/selectors';

/**
 * Component is described here.
 *
 * @example ./extra.examples.md
 */
export class RuleCard extends React.Component<{}> {
  renderRuleStats = (rule) => {
    const { t } = this.props;
    return (
      <Grid
        container
        direction="row"
        spacing={2}
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography>{t('marketing.conversionRate')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <RotateLeft color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    {rule.conversionRate * 100} %
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography>{t('marketing.sales')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <Receipt color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{rule.sales}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography>{t('marketing.averageBuy')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <ShoppingCart color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{getCurrencyDisplayWithPrice(rule.averageBuy)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography>{t('marketing.totalBuy')}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" spacing={1}>
                <Grid item>
                  <Stars color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{getCurrencyDisplayWithPrice(rule.totalBuy)}</Typography>
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
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">{t('marketing.action')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={1} alignItems="flex-end">
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
          <Grid container direction="row" spacing={1} alignItems="flex-end">
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
          <Grid container direction="row" spacing={1} alignItems="flex-end">
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
          <Grid container direction="row" spacing={1} alignItems="flex-end">
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
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">{t('marketing.criterias')}</Typography>
        </Grid>
        {rule.criterias.map((c) => (
          <Grid key={c.name} item>
            <Grid
              container
              direction="row"
              spacing={1}
              alignItems="center"
              justify="space-between"
            >
              <Grid item>
                <Typography />
                {c.name} :{' '}
              </Grid>
              <Grid item>
                <Typography color="primary">{c.value} </Typography>
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
                  <Typography variant="h6" className={classes.ruleTitle}>
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
    marginBottom: theme.spacing(1),
  },
  paperContainer: {
    padding: theme.spacing(4),
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#DDDDDD',
  },
  horizontalDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(-4),
    marginLeft: theme.spacing(-4),
  },
});

export default withStyles(styles)(withTranslation()(RuleCard));
