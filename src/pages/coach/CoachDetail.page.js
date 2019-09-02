//  @flow

import React from 'react';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';
import { compose, withState, withProps } from 'recompose';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import withDrawer from '../../hocs/with-drawer.hoc';

import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import type { PaymentRule } from '../../libs/payment-rules';

import {
  startUpdate,
  setCoachPaymentRule,
  deleteCoach,
} from '../../libs/associated-coach/actions';
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import type { CoachDetailed } from '../../api/types';

type Props = {
  t: TFunction,
  classes: Object,
  coach: CoachDetailed,
  paymentRules: PaymentRule[],
  setCoachPaymentRule: (any) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
  loading: boolean,

  setDeleteModalOpen: (boolean) => void,
  deleteOpen: boolean,
  deleteCoach: (
    id: number,
    options: ?{ onSucces: ?() => void, onError: ?() => void },
  ) => void,
  goToList: () => void,
};

export const Coach = (props: Props) => {
  const { t, classes, loading } = props;
  if (loading) {
    return <LinearProgress />;
  }
  const { paymentRules, coach } = props;
  return (
    <div style={{ height: '100%' }}>
      <CoachDetail
        coach={coach}
        paymentRules={paymentRules}
        setCoachPaymentRule={props.setCoachPaymentRule}
        goToCoachPerformance={props.goToCoachPerformance}
        startUpdateCoach={props.startUpdateCoach}
      />
      <Button
        onClick={props.goToList}
        size="large"
        color="secondary"
        variant="outlined"
        className={classes.backButton}
      >
        {t('navigation.goBack')}
      </Button>
      <BottomActionButtons
        onEdit={() => props.startUpdateCoach(coach)}
        onDelete={() => props.setDeleteModalOpen(true)}
      />
      <CoachDeleteModal
        coachToDeleteId={props.deleteOpen ? props.coach.id : null}
        onClose={() => props.setDeleteModalOpen(false)}
        checkCanDeleteCoach={canDeleteCoachAPI}
        deleteCoach={() => {
          props.deleteCoach(coach.id, { onSuccess: props.goToList });
        }}
      />
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
  withState('deleteOpen', 'setDeleteModalOpen', false),
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
      deleteCoach,
      startUpdateCoach: startUpdate,
      setCoachPaymentRule,
      goToCreateCoach: () => routerPush('/coach/add'),
      goToCoachPerformance: (coach) =>
        routerPush(`/coach/${coach.associated_coach_id}/performance`),
      goToList: () => routerPush('/coach'),
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
