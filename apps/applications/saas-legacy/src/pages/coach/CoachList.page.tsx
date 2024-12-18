import React from 'react';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';

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
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import withTitle from '../../hocs/with-title.hoc';

import {
  deleteCoach,
  restoreCoach,
  fetchAssociatedCoachesList,
} from '#src/libs/associated-coach/actions';
import {
  getActiveCoaches,
  getCoachesSelectedInRole,
  getInactiveCoaches,
  getInactiveCoachesSelectedInRole,
} from '#src/libs/associated-coach/selectors';

import CoachListItem, {
  CoachListSkeleton,
} from '#src/libs/associated-coach/components/CoachListItem.component';

import CoachDeleteModal from '#src/libs/associated-coach/components/CoachDeleteModal.component';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '#src/components/button/BottomActionsButton.component';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import VirtualizedCoachList from '#src/libs/associated-coach/components/VirtualizedCoachList.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { RootState } from '../../reducers';

import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

type OwnProps = {};

type Props = OwnProps &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithObjectSearch;

type State = {
  showDisabled: boolean;
  deleteCoachId: number | null;
};

type CoachOption = {
  label: string;
  onCoachSelected?: (coachId: number) => void;
  deleteCoach?: (coachId: number) => void | null;
  coach: Coach;
  value: number;
};

const Option: React.FC<OptionPropsWithData<CoachOption>> = (props) => (
  <CoachListItem divider {...props.data} />
);

export class CoachList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDisabled: false,
      deleteCoachId: null,
    };
  }

  get searchAdditionalParams() {
    return {
      disabled: false,
      ...(this.props.coachesSelectedInRole.length && {
        id__in: this.props.coachesSelectedInRole.map((coach) => coach.id),
      }),
    };
  }

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
  }

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  setDeleteCoachId = (deleteCoachId: number | null) =>
    this.setState({ deleteCoachId });

  coachOptionsFormatter =
    (hasDeletePermission: boolean) =>
    (coaches: Coach[]): CoachOption[] =>
      coaches.map((coach) => {
        return {
          label: coach.name,
          coach,
          deleteCoach: hasDeletePermission ? this.setDeleteCoachId : null,
          onCoachSelected: !coach.disabled ? this.props.goToCoachDetail : null,
          value: coach.id,
        };
      });

  handleCoachDelete = (id: number) =>
    this.props.deleteCoach(id, {
      onSuccess: () => {
        this.props.refreshOptions(
          'associated_coach',
          this.searchAdditionalParams,
        );
      },
    });

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
            <ObjectLevelPermissionProvider requiredPermission="management.coach.allowed_actions.delete">
              {(hasDeletePermission: boolean) => (
                <ObjectSearchComponent
                  additionalParams={this.searchAdditionalParams}
                  components={{
                    Option,
                  }}
                  optionsFormatter={this.coachOptionsFormatter(
                    hasDeletePermission,
                  )}
                  placeholder={t('coach:search')}
                  searchedObjectType="associated_coach"
                  variant="underlined"
                />
              )}
            </ObjectLevelPermissionProvider>
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
            deleteCoach={this.handleCoachDelete}
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
  withObjectSearch,
  withStyles(styles),
  withTitle(({ t }) => t('titles:coach.coachList')),
)(CoachList);
