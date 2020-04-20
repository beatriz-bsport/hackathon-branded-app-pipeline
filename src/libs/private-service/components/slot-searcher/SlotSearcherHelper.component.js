// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StepLabel from '@material-ui/core/StepLabel';
import List from '@material-ui/core/List';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import TypographyMultiline from '../../../../components/TypographyMultiline.component';

import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import PrivateSlotListItem from '../slot/PrivateSlotListItem.component';
import type { PrivateService, PrivateSlot } from '../../types';

type Props = {
  classes: Object,
  t: TFunction,
  privateService: ?PrivateService,
  privateSlot: ?PrivateSlot,
  coaches: Array<Coach>,
  date: ?Object,
};

const STEPS = [
  'bookerModule.step.privateService',
  'bookerModule.step.privateSlot',
  'bookerModule.step.date',
];

export class SlotSearcherHelper extends React.PureComponent<Props> {
  getActiveStep = () => {
    if (this.props.privateService) {
      if (this.props.privateSlot) {
        if (this.props.date) {
          return 3;
        }
        return 2;
      }
      return 1;
    }
    return 0;
  };

  renderPrivateService = () => {
    if (this.props.privateService) {
      return (
        <div className={this.props.classes.section}>
          <Typography
            variant="h5"
            component="h4"
            className={this.props.classes.sectionTitle}
          >
            {this.props.privateService.name}
          </Typography>
          <TypographyMultiline color="textSecondary">
            {this.props.privateService.description}
          </TypographyMultiline>
        </div>
      );
    }
    return null;
  };

  renderEstablishment = () => {
    if (this.props.privateService) {
      return (
        <div className={this.props.classes.section}>
          <Typography
            variant="h6"
            component="h4"
            className={this.props.classes.sectionTitle}
          >
            {this.props.t('bookerModule.sections.establishment')}
          </Typography>
          <Typography color="textSecondary">
            {this.props.privateService.establishments.length ? (
              <Paper>
                <EstablishmentListItem
                  establishment={this.props.privateService.establishments[0]}
                />
              </Paper>
            ) : (
              <Typography>{this.props.t('bookerModule.isAtHome')}</Typography>
            )}
          </Typography>
        </div>
      );
    }
    return null;
  };

  renderPrivateSlot = () => {
    if (this.props.privateSlot) {
      return (
        <div className={this.props.classes.section}>
          <Typography
            variant="h6"
            component="h4"
            className={this.props.classes.sectionTitle}
          >
            {this.props.t('bookerModule.sections.privateSlot')}
          </Typography>
          <Paper>
            <PrivateSlotListItem slot={this.props.privateSlot} />
          </Paper>
        </div>
      );
    }
    return null;
  };

  renderCoach = () => {
    if (this.props.coaches.length > 0) {
      return (
        <div className={this.props.classes.section}>
          <Typography
            variant="h6"
            component="h4"
            className={this.props.classes.sectionTitle}
          >
            {this.props.t('bookerModule.sections.coach')}
          </Typography>
          <Paper>
            <List>
              {this.props.coaches
                .filter((c) => !!c)
                .map((coach) => (
                  <CoachListItemBasic key={coach} coach={coach} />
                ))}
            </List>
          </Paper>
        </div>
      );
    }
    return null;
  };

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <Stepper
            classes={{ root: classes.root }}
            activeStep={this.getActiveStep()}
            alternativeLabel
          >
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{t(label)}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className={classes.content}>
            {this.renderPrivateService()}
            {this.renderCoach()}
            {this.renderEstablishment()}
            {this.renderPrivateSlot()}
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  root: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  section: {
    marginBottom: theme.spacing.unit * 2,
  },
  sectionTitle: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(SlotSearcherHelper);
