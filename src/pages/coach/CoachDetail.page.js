//  @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';
import { compose, withProps } from 'recompose';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  startUpdate,
  setCoachPaymentRule,
} from '../../libs/associated-coach/actions';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import type { CoachDetailed } from '../../api/types';
import type { PaymentRule } from '../../libs/payment-rules';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  t: TFunction,
  classes: Object,
  coach: CoachDetailed,
  paymentRules: PaymentRule[],
  goBack: () => void,
  setCoachPaymentRule: (any) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
  loading: boolean,
};

export const Coach = (props: Props) => {
  const { t, classes, loading } = props;
  if (loading) {
    return <LinearProgress />;
  }
  const { paymentRules, coach } = props;
  return (
    <div style={{ height: '100%' }}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <CoachDetail
            coach={coach}
            paymentRules={paymentRules}
            setCoachPaymentRule={props.setCoachPaymentRule}
            goToCoachPerformance={props.goToCoachPerformance}
            startUpdateCoach={props.startUpdateCoach}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={props.goBack}
            size="large"
            color="secondary"
            variant="outlined"
            className={classes.backButton}
          >
            {t('navigation.goBack')}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    (state) => ({
      loading: state.coach.loading,
      selfCoach: state.coach.selfCoach,
      associatedCoaches: state.coach.companyAssociated,
      isCoach: state.auth.is_coach,
      isManager: state.auth.is_manager,
      paymentRules: paymentRulesSelector(state),
    }),
    {
      startUpdateCoach: startUpdate,
      setCoachPaymentRule,
      goToCreateCoach: () => routerPush('/coach/add'),
      goToCoachPerformance: (coach) =>
        routerPush(`/coach/${coach.associated_coach_id}/performance`),
      goBack: () => routerPush('/coach'),
    },
  ),
  withNamespaces(),
  withProps(({ associatedCoaches, match }) => ({
    coach: associatedCoaches.find(
      (coach) => coach.id === parseInt(match.params.coachId, 10),
    ),
  })),
  withDrawer(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
)(Coach);
