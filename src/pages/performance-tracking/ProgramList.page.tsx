import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { push as pushRouter } from 'connected-react-router';
import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Info } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

import { OptionCallback } from '../../state/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import GenericFormDialog from '#components/genericDialog/GenericFormDialog';
import ProgramForm from '#libs/performance-tracking/components/program/ProgramForm.component';
import ProgramListComponent from '#libs/performance-tracking/components/program/ProgramList.component';
import ProgramDetail from '#libs/performance-tracking/components/program/ProgramDetail.component';
import {
  createOrUpdateProgram as createOrUpdateProgramAction,
  fetchProgram as fetchProgramAction,
  fetchMetric as fetchMetricAction,
  enableOrDisableProgram as enableOrDisableProgramAction,
  fetchMemberProgram as fetchMemberProgramAction,
} from '#libs/performance-tracking/actions';
import {
  getDisabledProgramList,
  getMemberProgramListIdsIn,
  composeMemberProgramWithMember,
  composeMemberProgramWithMetric,
  getProgramList,
  composeProgramWithMetrics,
  getProgram,
} from '#libs/performance-tracking/selector';
import { WithHandlerType } from '../../utils/types';
import { fetchMemberBulk } from '#libs/member/actions';
import { GenericPaginationResults } from '#libs/types';
import withTitle from '#hocs/with-title.hoc';
import BottomActionButtons from '#components/button/BottomActionsButton.component';
import { Member } from '#libs/member/types';
import ProgramListSkeleton from '#libs/performance-tracking/components/program/ProgramListSkeleton.component';

type OwnProps = {
  programList: Array<PerformanceTrackingProgram>;
  programListDisabled: Array<PerformanceTrackingProgram>;
  memberProgramPaginated: {
    items: Array<PerformanceTrackingMemberProgram>;
    allIds: number[];
    page: number;
    next_page: number;
    count: number;
    loading: boolean;
    error: Error;
  };
};

type RouterProps = {
  selectedProgramId: number;
};

type State = {};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = RouterProps &
  OwnProps &
  StateHandlerType &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

const PAGE_SIZE = 5;
export class ProgramList extends Component<Props, State> {
  componentDidMount() {
    this.props.fetchProgram({ is_disabled: false });
    this.props.fetchProgram({ is_disabled: true });
    if (this.props.selectedProgramId !== undefined) {
      this.props.fetchMetric({ program: this.props.selectedProgramId });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedProgramId !== this.props.selectedProgramId) {
      this.props.fetchMemberProgramPaginated(1, PAGE_SIZE);
      this.props.fetchMetric({ program: this.props.selectedProgramId });
    }
  }

  clickItem = (id: number) => {
    this.props.pushToRouter(id);
  };

  onEditProgram = (program: PerformanceTrackingProgram) => {
    this.props.setIsProgramFormOpen(true);
    this.props.fetchMetric(
      { program: program?.id },
      {
        onSuccess: () => this.props.setProgramToEdit(program?.id),
      },
    );
  };

  render() {
    const {
      programList,
      programListDisabled,
      selectedProgramId,
      t,
      classes,
      isProgramFormOpen,
      setIsProgramFormOpen,
      memberProgramPage,
      selectedProgramToEdit,
      setProgramToEdit,
      memberProgramPaginated,
      createOrUpdateProgram,
      enableOrDisableProgram,
      programLoading,
      memberProgramLoading,
      metricLoading,
    } = this.props;
    if (programLoading) {
      return <ProgramListSkeleton />;
    }
    return (
      <div className={classes.container}>
        {programList?.length === 0 && programListDisabled?.length === 0 ? (
          <div className={classes.noProgram}>
            <div className={classes.end}>
              <div className={classes.infoAndText}>
                <Info />
                <Typography>{t('program.infoNoProgram')}</Typography>
              </div>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setIsProgramFormOpen(true);
                }}
              >
                {t('program.form.addProgram')}
              </Button>
            </div>
          </div>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <div className={classes.program}>
                <ProgramListComponent
                  programList={programList}
                  onDelete={(program) => {
                    enableOrDisableProgram({
                      id: program.id,
                      enabled: false,
                    });
                  }}
                  onEdit={this.onEditProgram}
                  onClickOnItem={(program) => this.clickItem(program.id)}
                  programSelectedId={selectedProgramId}
                />
                <ProgramListComponent
                  onRestore={(program) => {
                    enableOrDisableProgram({ id: program.id, enabled: true });
                  }}
                  programList={programListDisabled}
                  programSelectedId={selectedProgramId}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <ProgramDetail
                metricLoading={metricLoading}
                onEdit={(program) => {
                  setProgramToEdit(program?.id);
                  setIsProgramFormOpen(true);
                }}
                onDelete={(program) => {
                  enableOrDisableProgram({ id: program.id, enabled: false });
                }}
                program={programList.find(
                  (program) => program.id === selectedProgramId,
                )}
                memberProgramPaginated={{
                  items: memberProgramPaginated,
                  page: memberProgramPage?.page,
                  next_page: memberProgramPage?.next_page,
                  count: memberProgramPage?.count,
                  loading: memberProgramLoading,
                }}
                onPageRequested={(page, pageSize) =>
                  this.props.fetchMemberProgramPaginated(page, pageSize)
                }
              />
            </Grid>
          </Grid>
        )}
        <GenericFormDialog open={isProgramFormOpen}>
          <ProgramForm
            closeDialog={() => setIsProgramFormOpen(false)}
            resetInitial={() => setProgramToEdit(null)}
            submit={(
              program,
              options?: OptionCallback<PerformanceTrackingProgram>,
            ) => {
              createOrUpdateProgram(program, options);
            }}
            initial={{ ...selectedProgramToEdit }}
          />
        </GenericFormDialog>
        <BottomActionButtons
          onCreate={() => {
            setIsProgramFormOpen(true);
          }}
          onCreateLabel={t('program.form.addProgram')}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, props: StateHandlerType & RouterProps) => ({
    metricLoading: state.performanceTracking.metricList.loading,
    memberProgramLoading: state.performanceTracking.memberProgram.loading,
    programLoading: state.performanceTracking.program.loading,
    programList: composeProgramWithMetrics(getProgramList)(
      state,
    ) as Array<PerformanceTrackingProgram>,
    programListDisabled: getDisabledProgramList(state),
    memberProgramPaginated: composeMemberProgramWithMember(
      composeMemberProgramWithMetric(getMemberProgramListIdsIn),
    )(state, props.selectedMemberPrograms) as Array<
      PerformanceTrackingMemberProgram<
        number,
        PerformanceTrackingMetric,
        Member
      >
    >,
    selectedProgramToEdit: composeProgramWithMetrics(getProgram)(
      state,
      props.programToEdit,
    ) as PerformanceTrackingProgram,
  }),
  {
    createOrUpdateProgram: createOrUpdateProgramAction,
    enableOrDisableProgramAction,
    fetchProgram: fetchProgramAction,
    fetchMetric: fetchMetricAction,
    pushToRouter: (id?: number) => pushRouter(`/performance-tracking/${id}`),
    goToDefaultPage: () => pushRouter(`/performance-tracking/`),
    fetchMemberProgram: fetchMemberProgramAction,
    fetchMemberBulk,
  },
);

const mapWithHandlers = {
  enableOrDisableProgram:
    (
      props: ConnectedProps<typeof connector> & RouterProps & StateHandlerType,
    ) =>
    (
      params: { id: number; enabled: boolean },
      options?: OptionCallback<PerformanceTrackingProgram>,
    ) => {
      if (params.id === props.selectedProgramId) {
        props.goToDefaultPage();
      }
      props.enableOrDisableProgramAction(params, options);
    },
  fetchMemberProgramPaginated:
    (
      props: ConnectedProps<typeof connector> & RouterProps & StateHandlerType,
    ) =>
    (page: number, pageSize: number) => {
      return props.fetchMemberProgram(
        { program: props.selectedProgramId, page, page_size: pageSize },
        {
          onSuccess: (payload) => {
            props.fetchMemberBulk({
              id__in: payload.results.map((mp) => mp.member),
            });
            props.setSelectedMemberPrograms(payload.results.map((mp) => mp.id));
            props.setMemberProgramPage({ ...payload, page });
          },
        },
      );
    },
};
const styles = (theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      paddingBottom: theme.spacing(20),
    },
    noProgram: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(10),
      gap: theme.spacing(2),
    },
    infoAndText: {
      display: 'flex',
      gap: theme.spacing(2),
    },
    end: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: theme.spacing(2),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    fab: {
      position: 'fixed',
      top: '90%',
      left: '90%',
    },
    program: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(5),
    },
  });

const withStateHandlersInit: {
  isProgramFormOpen: boolean;
  programToEdit: number | null;
  memberProgramPage: GenericPaginationResults<
    PerformanceTrackingMemberProgram<number, number, number>
  > & {
    page: number;
  };
  selectedMemberPrograms: Array<number>;
} = {
  isProgramFormOpen: false,
  programToEdit: null,
  memberProgramPage: null,
  selectedMemberPrograms: [],
};

const withStateHandlersSetter = {
  setIsProgramFormOpen: () => (isProgramFormOpen: boolean) => {
    return { isProgramFormOpen };
  },
  setProgramToEdit: () => (programToEdit: number | null) => {
    return { programToEdit };
  },
  setMemberProgramPage:
    () =>
    (
      memberProgramPage: GenericPaginationResults<
        PerformanceTrackingMemberProgram<number, number, number>
      > & {
        page: number;
      },
    ) => {
      return { memberProgramPage };
    },
  setSelectedMemberPrograms: () => (selectedMemberPrograms: Array<number>) => {
    return { selectedMemberPrograms };
  },
};

export default compose<any, OwnProps>(
  withTranslation('performanceTracking'),
  withTitle(({ t }: WithTranslation) => t('performanceTracking:program.title')),
  routerParamsToProps({ programId: 'selectedProgramId:number' }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withStyles(styles),
  connector,
  withHandlers(mapWithHandlers),
)(ProgramList);
