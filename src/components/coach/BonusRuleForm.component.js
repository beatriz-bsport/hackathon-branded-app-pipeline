// @flow
import React, { Component } from 'react';

import { Grid, InputAdornment, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import NumericInput from '../input/NumericInput.component';
import PriceInput from '../input/PriceInput.component';
import type { BonusRule } from '../form/types';

const styles = (theme) => ({
  paddedLeftBlock: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
  bonusRule: BonusRule,
  onChange: (bonusRule: BonusRule) => void,
};

let SEED_ID = 1;

export function initBonusRuleProps(): BonusRule {
  SEED_ID += 1;
  return { threshold: SEED_ID, fixedBonus: 20, variableBonus: 0, id: SEED_ID };
}

export class BonusRuleForm extends Component<Props> {
  handleChangeThreshold = (event: Object) => {
    const { bonusRule } = this.props;
    this.props.onChange({
      ...bonusRule,
      threshold: parseInt(event.target.value, 10),
    });
  };

  handleChangeFixedBonus = (event: Object) => {
    const { bonusRule } = this.props;
    this.props.onChange({
      ...bonusRule,
      fixedBonus: parseInt(event.target.value, 10),
    });
  };

  handleChangeVariableBonus = (event: Object) => {
    const { bonusRule } = this.props;
    this.props.onChange({
      ...bonusRule,
      variableBonus: parseInt(event.target.value, 10),
    });
  };

  render() {
    const { classes, t, bonusRule } = this.props;
    const { threshold, variableBonus, fixedBonus } = bonusRule;
    return (
      <Grid
        container
        direction="column"
        spacing={16}
        className={classes.paddedLeftBlock}
      >
        <Grid item>
          <NumericInput
            InputProps={{
              inputProps: { min: 0 },
              startAdornment: (
                <InputAdornment position="start">⩾</InputAdornment>
              ),
            }}
            helperText={t('form.coachPerformance.bookingThresholdHelper')}
            label={t('form.coachPerformance.bookingThresholdLabel')}
            value={threshold}
            onChange={this.handleChangeThreshold}
          />
        </Grid>
        <Grid item>
          <PriceInput
            helperText={t(
              'form.coachPerformance.pricePerAdditionalBookingHelper',
            )}
            label={t('form.coachPerformance.pricePerAdditionalBookingLabel')}
            value={variableBonus}
            onChange={this.handleChangeVariableBonus}
          />
        </Grid>
        <Grid item>
          <PriceInput
            helperText={t(
              'form.coachPerformance.fixedPriceForAdditionalBookingHelper',
            )}
            label={t(
              'form.coachPerformance.fixedPriceForAdditionalBookingLabel',
            )}
            value={fixedBonus}
            onChange={this.handleChangeFixedBonus}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(BonusRuleForm));
