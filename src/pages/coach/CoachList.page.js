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

import i18next from 'i18next';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import {
  deleteCoach,
  fetchAssociated,
} from '../../libs/associated-coach/actions';
import type { Coach } from '../../api/types';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withTitle from '../../hocs/with-title.hoc';

import CoachListItem from '../../libs/associated-coach/components/CoachListItem.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';

import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';

type Props = {
  loading: boolean,
  associatedCoaches: Array<Coach>,

  fetchAssociated: () => void,

  deleteCoachId: ?number,
  deleteCoach: (id: ?number) => void,
  setDeleteCoachId: (id: ?number) => void,

  goToCoachDetail: (coachId: number) => void,
};

export class CoachList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociated();
  }

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

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
      associatedCoaches: getActiveCoaches(state),
    }),
    {
      fetchAssociated,
      deleteCoach,
      goToCreateCoach: () => push('/coach/add'),
      goToCoachDetail: (coachId) => push(`/coach/${coachId}`),
    },
  ),
  withNamespaces(),
  withStyles(styles),
  withState('deleteCoachId', 'setDeleteCoachId', null),
  withBottomButtons({
    addButton: { path: '/coach/add', text: i18next.t('coach.addCoach') },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:coach.coachList')),
)(CoachList);
