// @flow
import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CoachInput from '../../../components/input/CoachInput.component';

import WarningForceRecursion from './WarningForceRecursion.component';

type Props = {
  coach: Coach,
  coaches: Array<Coach>,
  coach_override: ?Coach,
  offer: Offer,
  onDeleteCoachSubstitute: () => void,
  onFormFieldChange: (id: string) => (Object) => void,
  t: TFunction,
  hasChangedCoach: boolean,
};

export class CoachSubForm extends Component<Props> {
  renderModifyCoach = () => (
    <CoachInput
      label={this.props.t('form.offer.coachLabel')}
      required
      value={this.props.coach}
      onChange={(event) =>
        this.props.onFormFieldChange('coach')(event.target.value)
      }
      choices={this.props.coaches}
    />
  );

  renderModifySubstituteCoach = () => (
    <CoachInput
      label={this.props.t('form.offer.substituteCoachLabel')}
      onChange={(event) =>
        this.props.onFormFieldChange('coach_override')(event.target.value)
      }
      choices={this.props.coaches.filter(
        (c) => c.id !== (this.props.coach || this.props.offer.coach),
      )}
      value={this.props.coach_override}
      onDelete={this.props.onDeleteCoachSubstitute}
    />
  );

  showCoachChangeWarning = () => {
    if (this.props.hasChangedCoach) {
      return (
        <WarningForceRecursion
          text={this.props.t('form.offer.coachChangeWarning')}
        />
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <Grid container direction="row" spacing={16}>
          <Grid item>{this.renderModifyCoach()}</Grid>
          <Grid item>{this.renderModifySubstituteCoach()}</Grid>
        </Grid>
        {this.showCoachChangeWarning()}
      </div>
    );
  }
}

export default withNamespaces()(CoachSubForm);
