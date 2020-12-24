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
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import {
  deleteCoach,
  restoreCoach,
  fetchAssociatedCoachesList,
} from '../../libs/associated-coach/actions.ts';
import type { Coach } from '../../api/types';
import {
  getActiveCoaches,
  getInactiveCoaches,
} from '../../libs/associated-coach/selectors.ts';
import withTitle from '../../hocs/with-title.hoc';
import FuzeSearch from '../../components/FuzeSearch.component';

import CoachListItem from '../../libs/associated-coach/components/CoachListItem.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api.ts';

type Props = {
  loading: boolean,
  associatedCoaches: Array<Coach>,
  inactiveCoaches: Array<Coach>,

  fetchAssociatedCoachesList: () => void,

  deleteCoachId: ?number,
  deleteCoach: (id: ?number) => void,
  restoreCoach: (id: ?number) => void,
  setDeleteCoachId: (id: ?number) => void,

  goToCoachDetail: (coachId: number) => void,
  goToCoachEdit: (coachId: number) => void,
  onCreate: () => void,

  t: TFunction,
  classes: Object,
};

export class CoachList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
  };

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
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

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  goToCoachDetailPage(coach: Coach) {
    if (!coach.disabled) this.props.goToCoachDetail(coach.id);
  }

  render() {
    const { t } = this.props;
    if (
      (this.props.associatedCoaches || []).length +
        (this.props.inactiveCoaches || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <IsEmptyList
          text={this.props.t('coach:noCoachs')}
          button={this.props.t('coach:addCoach')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('coach:addCoach')}
        />
      );
    }
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
                      onCoachSelected={
                        !coach.disabled
                          ? () => this.goToCoachDetailPage(coach)
                          : null
                      }
                      deleteCoach={() => this.props.setDeleteCoachId(coach.id)}
                    />
                  ))}
                </List>
              </Collapse>
            </Paper>
          </div>
        ) : (
          <div className={this.props.classes.noCoachMessage}>
            <div className={this.props.classes.containerMsg}>
              <InfoOutlinedIcon fontSize="large" />
              <Typography variant="caption" component="p">
                {this.props.t('coach:noCoach')}
              </Typography>
            </div>
            <div className={this.props.classes.buttonContainer}>
              <Button
                onClick={this.props.onCreate}
                variant="outlined"
                color="primary"
                className="button"
              >
                {this.props.t('coach:addCoach')}
              </Button>
            </div>
          </div>
        )}
        <Paper>
          <List component="nav" dense disablePadding>
            {this.props.associatedCoaches.map((coach) => (
              <CoachListItem
                divider
                coach={coach}
                onCoachSelected={() => this.goToCoachDetailPage(coach)}
                deleteCoach={() => this.props.setDeleteCoachId(coach.id)}
                onEditCoach={() => this.props.goToCoachEdit(coach.id)}
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

        {(this.props.inactiveCoaches || []).length ? (
          <div>
            <ButtonBase
              className={this.props.classes.buttonTitle}
              onClick={this.onShowDisabled}
              disabled={!(this.props.inactiveCoaches || []).length}
            >
              <Typography
                variant="h5"
                component="h2"
                color={
                  (this.props.inactiveCoaches || []).length
                    ? 'default'
                    : 'textSecondary'
                }
                className={this.props.classes.titleContainer}
              >
                {`${t('coach:inactiveCoaches')} (${
                  (this.props.inactiveCoaches || []).length
                })`}
              </Typography>

              {this.state.showDisabled ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ButtonBase>
            <Divider />
            <Collapse in={this.state.showDisabled}>
              <Paper>
                <List component="nav" dense disablePadding>
                  {this.props.inactiveCoaches.map((coach) => (
                    <CoachListItem
                      divider
                      coach={coach}
                      onCoachSelected={() => this.goToCoachDetailPage(coach)}
                      deleteCoach={() => this.props.setDeleteCoachId(coach.id)}
                      restoreCoach={() => this.props.restoreCoach(coach.id)}
                    />
                  ))}
                </List>
              </Paper>
            </Collapse>
          </div>
        ) : null}

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
    border: '2px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
  noCoachMessage: {
    width: '90%',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: theme.spacing(5),
    textAlign: 'right',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    border: 'solid 2px #cecece',
    borderRadius: theme.spacing(1),
  },
  containerMsg: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  search: { marginBottom: theme.spacing(2) },
});

export default compose(
  connect(
    (state) => ({
      loading: state.coach.loading,
      associatedCoaches: getActiveCoaches(state),
      inactiveCoaches: getInactiveCoaches(state),
    }),
    {
      fetchAssociatedCoachesList,
      deleteCoach,
      restoreCoach,
      goToCreateCoach: () => push('/coach/add'),
      goToCoachDetail: (coachId) => push(`/coach/${coachId}`),
      onCreate: () => push('/coach/add'),
      goToCoachEdit: (coachId) => push(`/coach/edit/${coachId}`),
    },
  ),
  withTranslation(),
  withStyles(styles),
  withState('deleteCoachId', 'setDeleteCoachId', null),
  withTitle(({ t }: { t: TFunction }) => t('titles:coach.coachList')),
)(CoachList);
