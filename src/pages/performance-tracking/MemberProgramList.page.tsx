import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
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

import { Add, Info } from '@material-ui/icons';
import withState from 'recompose/withState';

import { Grid } from '@material-ui/core';
import { WithHandlerType } from '../../utils/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import ProgramSelectorDialog from '#libs/performance-tracking/components/program/ProgramSelectorDialog.component';
import ProgramList from '#libs/performance-tracking/components/program/ProgramList.component';
import MemberProgramDetail from '#libs/performance-tracking/components/member-program/MemberProgramDetail.component';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import ProgramMenuItem from '#libs/performance-tracking/components/program/ProgramMenuItem.component';
import { showDeleteDialog } from '#components/genericDialog/CustomDialogs';
import GenericDialog from '#components/genericDialog/GenericDialog';
import {
  getMemberProgramByMemberList,
  composeMemberProgramWithProgram,
  composeMemberProgramWithMetric,
  getMemberProgram,
  getProgramList,
  composeProgramWithMetrics,
} from '#libs/performance-tracking/selector';
import {
  fetchProgram as fetchProgramAction,
  createMemberProgram as createMemberProgramAction,
  fetchMemberProgram as fetchMemberProgramAction,
  fetchMetric as fetchMetricAction,
  disableMemberProgram as disableMemberProgramAction,
  updateMemberMetricValue as updateMemberMetricValueAction,
} from '#libs/performance-tracking/actions';
import BackofficeLinearProgressComponent from '#components/navigation/BackofficeLinearProgress.component';

type OwnProps = {
  memberProgramList: Array<PerformanceTrackingMemberProgram>;
  programList: Array<PerformanceTrackingProgram>;
};
type RouterProps = {
  memberId: number;
  memberProgramDetailedId: number;
};
type StateProps = {
  isDialogChooseProgramOpen: boolean;
  setIsDialogChooseProgramOpen: (bool: boolean) => void;
};

type Props = OwnProps &
  RouterProps &
  StateProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class MemberProgramList extends Component<Props> {
  componentDidMount() {
    this.props.fetchProgram({ is_disabled: false });
    this.props.fetchMemberProgram(
      { member: this.props.memberId },
      {
        onSuccess: () => {
          this.props.fetchMetric();
        },
      },
    );
  }

  render() {
    const {
      memberProgramList,
      classes,
      t,
      isDialogChooseProgramOpen,
      setIsDialogChooseProgramOpen,
      programList,
      memberProgramDetailed,
      memberProgramDetailedId,

      createMemberProgram,
      memberId,
      updateMemberMetricValue,
      pushToRouter,
      memberProgramLoading,
    } = this.props;

    const alreadyRegisterdProgramIds = memberProgramList?.map(
      (mp) => mp?.program?.id,
    );
    const memberAvailablePrograms =
      programList?.filter((p) => !alreadyRegisterdProgramIds?.includes(p.id)) ||
      [];
    if (memberProgramLoading) {
      return <BackofficeLinearProgressComponent />;
    }
    return (
      <div className={classes.container}>
        {!memberProgramList || memberProgramList.length === 0 ? (
          <div className={classes.noProgram}>
            <div className={classes.end}>
              <div className={classes.infoAndText}>
                <Info />
                <Typography>{t('program.infoNoProgram')}</Typography>
              </div>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsDialogChooseProgramOpen(true)}
              >
                {t('program.form.addProgram')}
              </Button>
            </div>
          </div>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <div className={classes.programList}>
                <ProgramList
                  noTitle
                  programList={memberProgramList?.map(
                    (memberProgram) => memberProgram.program,
                  )}
                  programSelectedId={memberProgramDetailed?.program?.id}
                  onAddProgram={() => setIsDialogChooseProgramOpen(true)}
                  onDelete={(program) => {
                    const memberProgramToDelete = [...memberProgramList].find(
                      (memberProgram) =>
                        memberProgram.program.id === program.id,
                    ).id;
                    this.props.disableMemberProgram(memberProgramToDelete);
                    if (memberProgramToDelete === memberProgramDetailed.id) {
                      pushToRouter();
                    }
                  }}
                  onClickOnItem={(program) => {
                    pushToRouter(
                      memberProgramList.find(
                        (memberProgram) =>
                          memberProgram.program.id === program.id,
                      ).id,
                    );
                  }}
                  isSearchDisplayed
                  isLinkedToMemberProgram
                />
              </div>
              <div className={classes.programSelector}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsDialogChooseProgramOpen(true)}
                >
                  <div className={classes.row}>
                    <Add />
                    {t('program.form.addProgram')}
                  </div>
                </Button>
                <MaterialUISelector
                  isMenuListPaddingDisabled
                  itemRenderer={(itemProps) => {
                    return (
                      <ProgramMenuItem
                        isInSelector
                        isDisabled={itemProps.isDisabled}
                        isSelected={itemProps.isSelected}
                        program={
                          [...memberProgramList].find(
                            (memberProgram) =>
                              memberProgram.program.id === itemProps.data.value,
                          ).program
                        }
                        onDelete={async (program) => {
                          const shouldDelete = await showDeleteDialog(
                            t('memberProgram.deleteHeader'),
                            t('memberProgram.deleteContent'),
                          );
                          if (shouldDelete) {
                            const memberProgramToDelete = [
                              ...memberProgramList,
                            ].find(
                              (memberProgram) =>
                                memberProgram.program.id === program.id,
                            ).id;
                            this.props.disableMemberProgram(
                              memberProgramToDelete,
                            );
                            if (
                              memberProgramToDelete === memberProgramDetailed.id
                            ) {
                              pushToRouter();
                            }
                          }
                        }}
                      />
                    );
                  }}
                  options={[...memberProgramList]?.map((memberProgram) => ({
                    value: memberProgram.program?.id,
                    label: memberProgram.program?.name,
                  }))}
                  isMulti={false}
                  onChange={(values) => {
                    pushToRouter(
                      [...memberProgramList].find(
                        (memberProgram) =>
                          memberProgram.program.id === values.value,
                      ).id,
                    );
                  }}
                />
                <GenericDialog />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <MemberProgramDetail
                memberProgram={memberProgramDetailed}
                changeMemberMetricValue={(value, metric) => {
                  updateMemberMetricValue({
                    memberProgram: memberProgramDetailedId,
                    metric,
                    value,
                  });
                }}
              />
            </Grid>
          </Grid>
        )}
        <ProgramSelectorDialog
          programList={[...memberAvailablePrograms]}
          isDialogChooseProgramOpen={isDialogChooseProgramOpen}
          setIsDialogChooseProgramOpen={setIsDialogChooseProgramOpen}
          createMemberProgram={(id) =>
            createMemberProgram({ program: id, member: memberId })
          }
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, props: RouterProps) => ({
    memberProgramDetailed: composeMemberProgramWithMetric(
      composeMemberProgramWithProgram(getMemberProgram),
    )(state, props.memberProgramDetailedId) as PerformanceTrackingMemberProgram,
    programList: composeProgramWithMetrics(getProgramList)(state),
    memberProgramList: composeMemberProgramWithProgram(
      getMemberProgramByMemberList,
    )(state, props.memberId) as Array<PerformanceTrackingMemberProgram>,
    memberProgramLoading: state.performanceTracking.memberProgram.loading,
  }),
  {
    fetchProgram: fetchProgramAction,
    createMemberProgram: createMemberProgramAction,
    fetchMemberProgram: fetchMemberProgramAction,
    fetchMetric: fetchMetricAction,
    disableMemberProgram: disableMemberProgramAction,
    updateMemberMetricValue: updateMemberMetricValueAction,
    pushRouter,
  },
);
const mapWithHandlers = {
  pushToRouter:
    (props: ConnectedProps<typeof connector> & RouterProps & StateProps) =>
    (id?: number) => {
      if (id !== undefined) {
        props.pushRouter(
          `/member/${props.memberId}/performance-tracking/${id}`,
        );
      } else {
        props.pushRouter(`/member/${props.memberId}/performance-tracking/`);
      }
    },
};

const styles = (theme: Theme) =>
  createStyles({
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    programList: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    programSelector: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      flexDirection: 'column',
      gap: theme.spacing(2),
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
    menuItemStart: {
      width: '50%',
    },
    menuItemEnd: {
      width: '50%',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      maxWidth: theme.spacing(32),
    },
    container: {
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        paddingBottom: theme.spacing(4),
      },
    },
  });

export default compose(
  routerParamsToProps({
    id: 'memberId:number',
    memberProgramId: 'memberProgramDetailedId:number',
  }),
  withStyles(styles),
  withTranslation('performanceTracking'),
  connector,
  withState('isDialogChooseProgramOpen', 'setIsDialogChooseProgramOpen', false),
  withHandlers(mapWithHandlers),
)(MemberProgramList);
