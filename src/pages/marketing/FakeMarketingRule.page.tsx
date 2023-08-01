// @ts-nocheck
import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import { WithStyles, Theme, withStyles } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Sms from '@material-ui/icons/Sms';
import Smartphone from '@material-ui/icons/Smartphone';
import Email from '@material-ui/icons/Email';
import withTitle from '../../hocs/with-title.hoc';

const styles = (theme: Theme) => ({
  paperContainer: {
    padding: theme.spacing(3),
  },
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing(1),
  },
  formControlLarge: {
    minWidth: 200,
    marginRight: theme.spacing(1),
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

type Props = WithTranslation & WithStyles<typeof styles>;
type State = { rule: any };

export class MarketingRule extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rule: RULE,
    };
  }

  handleChange = () => {};

  renderActionKind = (kindId: number) => {
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
        <Grid container alignItems="center" direction="row" spacing={1}>
          <Grid item>{icon}</Grid>
          <Grid item>
            <Typography>{ACTION_KIND[kindId].name}</Typography>
          </Grid>
        </Grid>
      </MenuItem>
    );
  };

  renderActionKindSelect = (action: any) => {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl} margin="normal">
        <Select onChange={this.handleChange} value={action.kind}>
          {ACTION_KIND.map((kind) => this.renderActionKind(kind.id))}
        </Select>
      </FormControl>
    );
  };

  renderMessageDisplay = (action: any) => {
    const { t } = this.props;
    return (
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography>{t('marketing.message')}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">{action.message}</Typography>
        </Grid>
      </Grid>
    );
  };

  renderTriggerSelect = (action: any) => {
    const { classes, t } = this.props;
    return (
      <FormControl className={classes.formControlLarge} margin="normal">
        <Select onChange={this.handleChange} value={action.afterMatchingOffers}>
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

  renderPromoSelect = (action: any) => {
    const { classes, t } = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography>{t('marketing.promoTitle')}</Typography>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl} margin="normal">
            <Select onChange={this.handleChange} value={action.promo}>
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

  renderAction = (action: any) => (
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
      <Grid container direction="row" spacing={4}>
        <Grid item xs={6}>
          <Grid container direction="row" spacing={1}>
            <Grid item>
              <Typography variant="h6">{t('marketing.strategy')}</Typography>
            </Grid>
            <Grid item>
              <Typography color="primary" variant="h6">
                {rule.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <Typography>{t('marketing.estimatedTarget')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">31 %</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress value={30} variant="determinate" />
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

export default withStyles(styles)(
  withTranslation()(
    withTitle(({ t }: { t: TFunction }) => t('titles:marketing.marketingRule'))(
      MarketingRule,
    ),
  ),
);
