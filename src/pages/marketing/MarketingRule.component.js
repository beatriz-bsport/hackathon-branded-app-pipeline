import React, { Component } from 'react';

import {
  FormControl,
  Select,
  Typography,
  Grid,
  Paper,
  MenuItem,
  LinearProgress,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import Sms from '@material-ui/icons/Sms';
import Smartphone from '@material-ui/icons/Smartphone';
import Email from '@material-ui/icons/Email';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing.unit,
  },
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing.unit,
  },
});

const ACTION_KIND = [
  { id: 0, name: 'SMS' },
  { id: 1, name: 'Email' },
  { id: 2, name: 'Notification' },
];

const NB_OFFER_BEFORE_TRIGGER = [1, 2, 3, 5, 10, 15];

const PROMO = [0, 10, 25, 40, 50, 75, 100];

const RULE = {
  name: 1,
  actions: [
    {
      kind: 0,
      message:
        'Bonjour <Prenom> une nouvelle séance de Yoga arrive le <Date>, cela fait quelques temps que nous ne t...',
      afterMatchingOffers: 1,
      promo: 0,
    },
    {
      kind: 1,
      message:
        'Bonjour <Prenom> une nouvelle séance de Yoga arrive le <Date>, cela fait quelques temps que nous ne t...',
      afterMatchingOffers: 2,
      promo: 0,
    },
    {
      kind: 2,
      message:
        'Bonjour <Prenom> une nouvelle séance de Yoga arrive le <Date>, cela fait quelques temps que nous ne t...',
      afterMatchingOffers: 5,
      promo: 25,
    },
  ],
};
export class MarketingRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: RULE,
    };
  }

  handleChange = () => {};

  renderActionKind = (kindId) => {
    let icon = <Sms color="primary" />;
    switch (kindId) {
      case 1:
        icon = <Email color="primary" />;
        break;
      case 2:
      default:
        icon = <Smartphone color="primary" />;
        break;
    }
    return (
      <MenuItem value={kindId}>
        <Grid container direction="row" spacing={8} alignItems="center">
          <Grid item>{icon}</Grid>
          <Grid item>
            <Typography>{ACTION_KIND[kindId].name}</Typography>
          </Grid>
        </Grid>
      </MenuItem>
    );
  };

  renderActionKindSelect = (action) => {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl} margin="normal">
        <Select value={action.kind} onChange={this.handleChange}>
          {ACTION_KIND.map((kind) => this.renderActionKind(kind.id))}
        </Select>
      </FormControl>
    );
  };

  renderMessageDisplay = (action) => {
    const { t } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography>{t('marketing.message')}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">{action.message}</Typography>
        </Grid>
      </Grid>
    );
  };

  renderTriggerSelect = (action) => {
    const { classes, t } = this.props;
    return (
      <FormControl className={classes.formControlLarge} margin="normal">
        <Select value={action.afterMatchingOffers} onChange={this.handleChange}>
          {NB_OFFER_BEFORE_TRIGGER.map((nb) => (
            <MenuItem value={nb}>
              <Typography>
                {t('marketing.after')} {nb} {t('marketing.offersMatching')}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  renderPromoSelect = (action) => {
    const { classes, t } = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography>{t('marketing.promoTitle')}</Typography>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl} margin="normal">
            <Select value={action.promo} onChange={this.handleChange}>
              {PROMO.map((promo) => (
                <MenuItem value={promo}>
                  {promo ? (
                    <Typography>
                      {`${t('marketing.promo')} ${promo}%`}
                    </Typography>
                  ) : (
                    <Typography>{t('marketing.noPromo')}</Typography>
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  renderAction = (action) => (
    <Grid container direction="row">
      <Grid item xs={3}>
        {this.renderTriggerSelect(action)}
      </Grid>
      <Grid item xs={2}>
        {this.renderActionKindSelect(action)}
      </Grid>
      <Grid item xs={4}>
        {this.renderMessageDisplay(action)}
      </Grid>
      <Grid item xs={3}>
        {this.renderPromoSelect(action)}
      </Grid>
    </Grid>
  );

  render() {
    const { rule } = this.state;
    const { t, classes } = this.props;
    return (
      <Grid container direction="row" spacing={32}>
        <Grid item xs={6}>
          <Grid container direction="row" spacing={8}>
            <Grid item>
              <Typography variant="title">{t('marketing.strategy')}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="title" color="primary">
                {rule.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <Typography>{t('marketing.estimatedTarget')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="title">31 %</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress variant="determinate" value={30} />
            </Grid>
          </Grid>
        </Grid>
        {rule.actions.map((a) => (
          <Grid item xs={12}>
            <Paper className={classes.paperContainer}>
              {this.renderAction(a)}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(MarketingRule));
