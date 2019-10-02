// @flow

import React from 'react';

import { compose, withState } from 'recompose';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import {
  deleteCoach,
  fetchAssociatedCoachesList,
} from '../../libs/associated-coach/actions';
import type { Coach } from '../../api/types';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import withTitle from '../../hocs/with-title.hoc';

import CoachListItem from '../../libs/associated-coach/components/CoachListItem.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';

import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';

type Props = {
  loading: boolean,
  associatedCoaches: Array<Coach>,

  fetchAssociatedCoachesList: () => void,

  deleteCoachId: ?number,
  deleteCoach: (id: ?number) => void,
  setDeleteCoachId: (id: ?number) => void,

  goToCoachDetail: (coachId: number) => void,
  onCreate: () => void,

  t: TFunction,
  classes: Object,
};

export class CoachList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociatedCoachesList({ disabled: false });
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <Paper>
          <List component="nav" dense disablePadding>
            {this.props.associatedCoaches.map((coach) => (
              <CoachListItem
                divider
                coach={coach}
                onCoachSelected={() => this.props.goToCoachDetail(coach.id)}
                deleteCoach={() => this.props.setDeleteCoachId(coach.id)}
              />
            ))}
          </List>
          <CoachDeleteModal
            coachToDeleteId={this.props.deleteCoachId}
            onClose={() => this.props.setDeleteCoachId(null)}
            checkCanDeleteCoach={canDeleteCoachAPI}
            deleteCoach={this.props.deleteCoach}
          />
        </Paper>
        <BottomActionsButton
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('coach.addCoach')}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 16,
  },
});

export default compose(
  connect(
    (state) => ({
      loading: state.coach.loading,
      associatedCoaches: getActiveCoaches(state),
    }),
    {
      fetchAssociatedCoachesList,
      deleteCoach,
      goToCreateCoach: () => push('/coach/add'),
      goToCoachDetail: (coachId) => push(`/coach/${coachId}`),
      onCreate: () => push('/coach/add'),
    },
  ),
  withNamespaces(),
  withStyles(styles),
  withState('deleteCoachId', 'setDeleteCoachId', null),
  withTitle(({ t }: { t: TFunction }) => t('titles:coach.coachList')),
)(CoachList);
