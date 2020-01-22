// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CoachSelector from '../../associated-coach/components/CoachSelectorWithCard.component';

import WarningForceRecursion from './WarningForceRecursion.component';

type Props = {
  coach: Coach,
  coaches: Array<Coach>,
  coach_override: ?Coach,
  t: TFunction,
  hasChangedCoach: boolean,
  classes: Object,
  coachs_override: Array,
  onChangeCoachOverride: (Coach) => void,
  onChangeCoach: (Coach) => void,
};

export class CoachSubForm extends Component<Props> {
  renderModifyCoach = () => (
    <div className={this.props.classes.selector}>
      <Typography className={this.props.classes.caption} variant="caption">
        {this.props.t('coach:baseCoach')}
      </Typography>
      <CoachSelector
        coaches={this.props.coaches}
        value={this.props.coach}
        onChange={this.props.onChangeCoach}
        placeholder={this.props.t('coach:coach')}
      />
    </div>
  );

  renderModifySubstituteCoach = () => (
    <div className={this.props.classes.selector}>
      <Typography className={this.props.classes.caption} variant="caption">
        {this.props.t('coach:overrider')}
      </Typography>
      <CoachSelector
        coaches={this.props.coachs_override}
        value={this.props.coach_override}
        onChange={this.props.onChangeCoachOverride}
        placeholder={this.props.t('coach:coach_override')}
      />
    </div>
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
      <div className={this.props.classes.selector}>
        {this.renderModifyCoach()}
        {this.props.coach ? null : (
          <div className={this.props.classes.warningContainer}>
            <WarningIcon size={20} />
            <Typography
              variant="caption"
              className={this.props.classes.caption}
            >
              {this.props.t('coach:pleaseFill')}
            </Typography>
          </div>
        )}
        {this.props.coach ? this.showCoachChangeWarning() : null}
        {this.renderModifySubstituteCoach()}
      </div>
    );
  }
}

const styles = (theme) => ({
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
  },
  caption: {
    paddingLeft: theme.spacing.unit,
  },
  selector: {
    width: '100%',
  },
});
export default compose(
  withStyles(styles),
  withNamespaces(),
)(CoachSubForm);
