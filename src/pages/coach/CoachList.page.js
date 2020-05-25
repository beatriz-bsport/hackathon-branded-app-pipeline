// @flow

import React from 'react';

import { compose, withState } from 'recompose';
import Collapse from '@material-ui/core/Collapse';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
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
import FuzeSearch from '../../components/FuzeSearch.component';

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

export class CoachList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchAssociatedCoachesList({ disabled: false });
  }

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    const { t } = this.props;

    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.associatedCoaches.length > 0 ? (
          <div className={this.props.classes.search}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              items={this.props.associatedCoaches}
              placeholder={t('coach:search')}
              searchFields={['name', 'email']}
              searchResult={this.state.searchResult}
            />
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? this.props.classes.searchPaperDisplayed
                  : this.props.classes.searchPaperHiden
              }
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <List component="nav" dense disablePadding>
                  {this.state.searchResult.map((coach) => (
                    <CoachListItem
                      divider
                      coach={coach}
                      onCoachSelected={() =>
                        this.props.goToCoachDetail(coach.id)
                      }
                      deleteCoach={() => this.props.setDeleteCoachId(coach.id)}
                    />
                  ))}
                </List>
              </Collapse>
            </Paper>
          </div>
        ) : null}
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
          onCreateLabel={this.props.t('coach:addCoach')}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
  search: { marginBottom: theme.spacing(2) },
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
  withTranslation(),
  withStyles(styles),
  withState('deleteCoachId', 'setDeleteCoachId', null),
  withTitle(({ t }: { t: TFunction }) => t('titles:coach.coachList')),
)(CoachList);
