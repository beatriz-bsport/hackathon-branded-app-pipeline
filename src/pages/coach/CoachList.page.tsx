import React from 'react';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import classNames from 'classnames';

import Fuse, { FuseOptions } from 'fuse.js';

import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { createStyles } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import type { Theme } from '@material-ui/core/styles';
import withTitle from '../../hocs/with-title.hoc';

import {
  deleteCoach,
  restoreCoach,
  fetchAssociatedCoachesList,
} from '../../libs/associated-coach/actions';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
  getInactiveCoaches,
  getInactiveCoachesSelectedInRole,
} from '../../libs/associated-coach/selectors';

import CoachListItem, {
  CoachListSkeleton,
} from '../../libs/associated-coach/components/CoachListItem.component';

import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import ObjectLevelPermissionWrapper from '../../libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import ObjectLevelPermissionProvider from '../../libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import VirtualizedCoachList from '#libs/associated-coach/components/VirtualizedCoachList.component';

import type { RootState } from '../../reducers';
import type { Coach } from '#libs/associated-coach/types';

type OwnProps = {};

type Props = OwnProps &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles>;

type State = {
  searchText: string;
  searchResult: Coach[];
  showDisabled: boolean;
  deleteCoachId: number | null;
};

export class CoachList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      searchResult: [],
      showDisabled: false,
      deleteCoachId: null,
    };
  }

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
  }

  changeSearch =
    (fuse: Fuse<Coach, FuseOptions<Coach>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        searchText: event.target.value,
        searchResult: fuse.search(event.target.value) as Coach[],
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  setDeleteCoachId = (deleteCoachId: number | null) =>
    this.setState({ deleteCoachId });

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
          button={t('coach:addCoach')}
          onCreate={this.props.onCreate}
          onCreateLabel={t('coach:addCoach')}
          text={t('coach:noCoachs')}
        />
      );
    }

    let coachesList = this.props.associatedCoaches;
    if (this.props.coachesSelectedInRole?.length > 0) {
      coachesList = coachesList.filter((coach: Coach) =>
        this.props.coachesSelectedInRole.includes(coach),
      );
    }

    let inactiveCoachesList = this.props.inactiveCoaches;
    if (
      this.props.inactiveCoachesSelectedInRole?.length > 0 ||
      (this.props.coachesSelectedInRole?.length > 0 &&
        this.props.inactiveCoachesSelectedInRole?.length === 0)
    ) {
      inactiveCoachesList = inactiveCoachesList.filter((coach: Coach) =>
        this.props.inactiveCoachesSelectedInRole.includes(coach),
      );
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.loading && coachesList.length === 0 && (
          <Paper>
            <CoachListSkeleton numberItems={8} />
          </Paper>
        )}
        {coachesList.length > 0 && (
          <div className={this.props.classes.search}>
            <FuzeSearch
              changeSearch={this.changeSearch}
              clearSearch={this.clearSearch}
              items={coachesList}
              placeholder={t('coach:search')}
              searchFields={['name', 'email']}
              searchText={this.state.searchText}
            />
            <Paper
              className={classNames({
                [this.props.classes.searchPaperDisplayed]:
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== '',
              })}
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <List dense disablePadding component="nav">
                  <ObjectLevelPermissionProvider requiredPermission="management.coach.allowed_actions.delete">
                    {(hasDeletePermission) =>
                      this.state.searchResult.map((coach) => (
                        <CoachListItem
                          key={coach.id}
                          divider
                          coach={coach}
                          deleteCoach={
                            hasDeletePermission ? this.setDeleteCoachId : null
                          }
                          onCoachSelected={
                            !coach.disabled ? this.props.goToCoachDetail : null
                          }
                        />
                      ))
                    }
                  </ObjectLevelPermissionProvider>
                </List>
              </Collapse>
            </Paper>
          </div>
        )}
        <Paper>
          <List dense disablePadding component="nav">
            <ObjectLevelPermissionProvider
              requiredPermission={[
                'management.coach.allowed_actions.edit',
                'management.coach.allowed_actions.delete',
              ]}
            >
              {/* @ts-expect-error */}
              {([hasEditPermission, hasDeletePermission]) => (
                <VirtualizedCoachList
                  coachList={coachesList}
                  deleteCoach={
                    hasDeletePermission ? this.setDeleteCoachId : null
                  }
                  onCoachSelected={this.props.goToCoachDetail}
                  onEditCoach={
                    hasEditPermission ? this.props.goToCoachEdit : null
                  }
                />
              )}
            </ObjectLevelPermissionProvider>
          </List>
          <CoachDeleteModal
            coachToDeleteId={this.state.deleteCoachId}
            deleteCoach={this.props.deleteCoach}
            onClose={() => this.setDeleteCoachId(null)}
          />
        </Paper>

        {(inactiveCoachesList || []).length ? (
          <div>
            <ButtonBase
              className={this.props.classes.buttonTitle}
              disabled={!(inactiveCoachesList || []).length}
              onClick={this.onShowDisabled}
            >
              <Typography
                color={
                  (inactiveCoachesList || []).length
                    ? 'initial'
                    : 'textSecondary'
                }
                variant="h5"
              >
                {`${t('coach:inactiveCoaches')} (${
                  (inactiveCoachesList || []).length
                })`}
              </Typography>

              {this.state.showDisabled ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ButtonBase>
            <Divider />
            <Collapse
              unmountOnExit
              className={this.props.classes.collapse}
              in={this.state.showDisabled}
            >
              <Paper>
                <List dense disablePadding component="nav">
                  <ObjectLevelPermissionProvider
                    requiredPermission={[
                      'management.coach.allowed_actions.edit',
                      'management.coach.allowed_actions.delete',
                    ]}
                  >
                    {([hasEditPermission, hasDeletePermission]) => (
                      <VirtualizedCoachList
                        coachList={inactiveCoachesList}
                        deleteCoach={
                          hasDeletePermission ? this.setDeleteCoachId : null
                        }
                        onCoachSelected={this.props.goToCoachDetail}
                        restoreCoach={
                          hasEditPermission && hasDeletePermission
                            ? this.props.restoreCoach
                            : null
                        }
                      />
                    )}
                  </ObjectLevelPermissionProvider>
                </List>
              </Paper>
            </Collapse>
          </div>
        ) : null}

        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="management.coach.allowed_actions.create"
        >
          <BottomActionsButton
            onCreate={this.props.onCreate}
            onCreateLabel={t('coach:addCoach')}
          />
        </ObjectLevelPermissionWrapper>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(16),
    },
    searchPaperDisplayed: {
      border: '2px solid',
      borderTop: '0px',
    },
    searchPaperHidden: {
      border: '1px solid',
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
    collapse: {
      paddingTop: theme.spacing(2),
    },
  });

const connector = connect(
  (state: RootState) => ({
    loading: state.coach.loading,
    associatedCoaches: getActiveCoaches(state),
    inactiveCoaches: getInactiveCoaches(state),
    coachesSelectedInRole: getCoachesSelectedInRole(state),
    inactiveCoachesSelectedInRole: getInactiveCoachesSelectedInRole(state),
  }),
  {
    fetchAssociatedCoachesList,
    deleteCoach,
    restoreCoach,
    goToCreateCoach: () => push('/coach/add'),
    goToCoachDetail: (coachId: number) => push(`/coach/${coachId}`),
    onCreate: () => push('/coach/add'),
    goToCoachEdit: (coachId: number) => push(`/coach/edit/${coachId}`),
  },
);

export default compose<OwnProps, Props>(
  connector,
  withTranslation(['coach']),
  withStyles(styles),
  withTitle(({ t }) => t('titles:coach.coachList')),
)(CoachList);
