// @flow
import React, { Component } from 'react';

import { Grid, Typography, Button, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { translate } from 'react-i18next';
import DateInput from '../input/DateInput.component';
import BonusRuleForm, { initBonusRuleProps } from './BonusRuleForm.component';
import type { BonusRule } from '../form/types';

import { Moment } from '../../i18n';

type Props = {
  t: (x: string) => string,
  classes: Object,
  onSubmit: (performanceForm: PerformanceForm) => void,
};

type State = {
  date_start: Object,
  date_end: Object,
  bonusRules: Array<BonusRule>,
};

export class CoachPerformanceForm extends Component<Props, State> {
  state = {
    date_start: Moment().add('months', -1),
    date_end: Moment(),
    bonusRules: [initBonusRuleProps()],
  };

  onFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    const { bonusRules, date_start, date_end } = this.state;
    this.props.onSubmit({ bonusRules, date_start, date_end });
  };

  addABonusRule = () => {
    const bonusRule = initBonusRuleProps();
    this.setState((prevState) => ({
      bonusRules: [...prevState.bonusRules, bonusRule],
    }));
  };

  handleChangeBonusRule = (bonusRule: BonusRule) => {
    this.setState((prevState) => ({
      bonusRules: [
        ...prevState.bonusRules.filter((br) => br.id !== bonusRule.id),
        bonusRule,
      ].sort((br, br_) => br.id < br_.id),
    }));
  };

  renderBonusRules = () => {
    if (this.state.bonusRules.length) {
      return (
        <Grid item>
          <Grid
            container
            direction="column"
            spacing={32}
            className={this.props.classes.bonusRules}
          >
            {this.state.bonusRules.map((br) => (
              <Grid item>
                <BonusRuleForm
                  key={br.id}
                  bonusRule={br}
                  onChange={this.handleChangeBonusRule}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { t, classes } = this.props;
    const { date_start, date_end } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container direction="column" spacing={40}>
          <Grid item>
            <Typography variant="subheading" className={classes.subheading}>
              {t('form.coachPerformance.dateTitle')}
            </Typography>
            <Grid container direction="row" spacing={24}>
              <Grid item>
                <DateInput
                  required
                  value={date_start}
                  onChange={this.onFieldChange('date_start')}
                  label={t('common.from')}
                />
              </Grid>
              <Grid item>
                <DateInput
                  required
                  value={date_end}
                  onChange={this.onFieldChange('date_end')}
                  label={t('common.until')}
                />
              </Grid>
            </Grid>
          </Grid>
          {this.renderBonusRules()}
          <Grid item>
            <Button onClick={this.addABonusRule} color="secondary">
              <AddIcon className={classes.leftButton} />
              {t('form.coachPerformance.addBonus')}
            </Button>
          </Grid>
          <Grid item>
            <Grid container item justify="center">
              <Button variant="contained" color="primary" type="submit">
                {t('coach.performance.calculate')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

const styles = (theme) => ({
  subheading: { marginBottom: theme.spacing.unit * 2 },
  bonusRules: { marginRight: theme.spacing.unit * 2 },
  leftButton: { marginRight: theme.spacing.unit },
});

export default withStyles(styles)(translate()(CoachPerformanceForm));
