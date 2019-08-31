// @flow

import React from 'react';

import { compose, withState } from 'recompose';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

import i18next from 'i18next';
import {
  startUpdate,
  setCoachPaymentRule,
  deleteCoach,
} from '../../libs/associated-coach/actions';
import type { Coach } from '../../api/types';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import { associatedCoachSelector } from '../../libs/associated-coach/selectors';
import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

import ConnectedCoachCard from '../../libs/associated-coach/components/CoachCard.component';
import CoachListItem from '../../libs/associated-coach/components/CoachListItem.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';

import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';

type Props = {
  loading: boolean,
  paymentRules: Array<PaymentRule>,
  setCoachPaymentRule: (*) => void,
  associatedCoaches: Array<Coach>,

  deleteCoachId: ?number,
  deleteCoach: (id: ?number) => void,
  setDeleteCoachId: (id: ?number) => void,

  goToCoachPerformance: (coach: Coach) => void,
  goToCoachEditForm: (coach: Coach) => void,
  goToCoachDetail: (coachId: number) => void,

  isCardView: boolean,
};

export const CoachList = (props: Props) => {
  if (props.loading) {
    return <CircularProgress />;
  }
  const {
    associatedCoaches,
    paymentRules,
    goToCoachEditForm,
    goToCoachPerformance,
    goToCoachDetail,
  } = props;

  if (props.isCardView) {
    return (
      <Grid container direction="row" spacing={16}>
        {associatedCoaches.map((coach) => (
          <Grid item xs={12} md={6} key={coach.id}>
            <ConnectedCoachCard
              coach={coach}
              onClickUpdate={() => goToCoachEditForm(coach)}
              paymentRules={paymentRules}
              setCoachPaymentRule={props.setCoachPaymentRule}
              goToCoachPerformance={() => goToCoachPerformance(coach)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
  return (
    <Paper>
      <List component="nav" dense disablePadding>
        {props.associatedCoaches.map((coach) => (
          <CoachListItem
            divider
            coach={coach}
            onCoachSelected={() => goToCoachDetail(coach.id)}
            deleteCoach={() => props.setDeleteCoachId(coach.id)}
          />
        ))}
      </List>
      <CoachDeleteModal
        coachToDeleteId={props.deleteCoachId}
        onClose={() => props.setDeleteCoachId(null)}
        checkCanDeleteCoach={canDeleteCoachAPI}
        deleteCoach={props.deleteCoach}
      />
    </Paper>
  );
};

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

export default compose(
  connect(
    (state) => ({
      loading: state.coach.loading,
      associatedCoaches: associatedCoachSelector.getActive(state),
      paymentRules: paymentRulesSelector(state),
    }),
    {
      deleteCoach,
      goToCoachPerformance: (coach) =>
        push(`/coach/${coach.associated_coach_id}/performance`),
      goToCoachEditForm: startUpdate,
      setCoachPaymentRule,
      goToCreateCoach: () => push('/coach/add'),
      goToCoachDetail: (coachId) => push(`/coach/${coachId}`),
    },
  ),
  withNamespaces(),
  withStyles(styles),
  withState('deleteCoachId', 'setDeleteCoachId', null),
  withBottomButtons({
    addButton: { path: '/coach/add', text: i18next.t('coach.addCoach') },
    switchButton: true,
  }),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.coachList')),
)(CoachList);
