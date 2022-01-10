import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { push as pushRouter } from 'connected-react-router';
import Typography from '@material-ui/core/Typography';

import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Info } from '@material-ui/icons';

import { Grid } from '@material-ui/core';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import ProgramList from '#libs/performance-tracking/components/program/ProgramList.component';
import MemberProgramDetail from '#libs/performance-tracking/components/member-program/MemberProgramDetail.component';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import ProgramMenuItem from '#libs/performance-tracking/components/program/ProgramMenuItem.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import GenericDialog from '#components/genericDialog/GenericDialog';
import {
  getMemberProgramByMemberList,
  composeMemberProgramWithProgram,
  composeMemberProgramWithMetric,
  getMemberProgram,
} from '#libs/performance-tracking/selector';
import {
  fetchProgram as fetchProgramAction,
  fetchMemberProgram as fetchMemberProgramAction,
  fetchMetric as fetchMetricAction,
  updateMemberMetricValue as updateMemberMetricValueAction,
  retrieveMemberProgram as retrieveMemberProgramAction,
} from '#libs/performance-tracking/actions';
import { Membership } from '#libs/membership/types';
import BackofficeLinearProgressComponent from '#components/navigation/BackofficeLinearProgress.component';
import withTitle from '#hocs/with-title.hoc';

type OwnProps = {
  memberProgramList: Array<PerformanceTrackingMemberProgram>;
  programList: Array<PerformanceTrackingProgram>;
  membership: Membership;
  companyId: number;
};

type RouterProps = {
  memberProgramDetailedId: number;
};

type StateProps = {
  isDialogChooseProgramOpen: boolean;
  setIsDialogChooseProgramOpen: (bool: boolean) => void;
};

type Props = RouterProps &
  OwnProps &
  StateProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class MemberProgramList extends Component<Props> {
  componentDidMount() {
    if (this.props.companyId) {
      this.props.fetchProgram({
        is_disabled: false,
        company: this.props.companyId,
      });
      this.props.fetchMemberProgram(
        { member: this.props.membership.id, company: this.props.companyId },
        {
          onSuccess: () => {
            this.props.fetchMetric({ company: this.props.companyId });
          },
        },
      );
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId) {
      if (this.props.companyId) {
        this.props.fetchProgram({
          is_disabled: false,
          company: this.props.companyId,
        });
        this.props.fetchMemberProgram(
          { member: this.props.membership.id, company: this.props.companyId },
          {
            onSuccess: () => {
              this.props.fetchMetric({ company: this.props.companyId });
            },
          },
        );
      }
    }
  }

  render() {
    const {
      memberProgramList,
      classes,
      t,
      updateMemberMetricValue,
      pushToRouter,
      retrieveMemberProgram,
      memberProgramDetailedId,
      memberProgramDetailed,
      companyId,
      memberProgramLoading,
    } = this.props;
    if (memberProgramLoading) {
      return <BackofficeLinearProgressComponent />;
    }
    return (
      <div className={classes.container}>
        {!memberProgramList || memberProgramList?.length === 0 ? (
          <div className={classes.noProgram}>
            <div className={classes.infoAndText}>
              <Info />
              <Typography>
                {t('memberProgram.infoNoConsumerProgram')}
              </Typography>
            </div>
          </div>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <div className={classes.programList}>
                <ProgramList
                  isLinkedToConsumer
                  programList={memberProgramList?.map(
                    (memberProgram) => memberProgram.program,
                  )}
                  programSelectedId={memberProgramDetailed?.program?.id}
                  onClickOnItem={(program) => {
                    const memberProgramSelected = memberProgramList.find(
                      (memberProgram) =>
                        memberProgram.program.id === program.id,
                    );
                    pushToRouter(memberProgramSelected.id);
                    retrieveMemberProgram({
                      memberProgramId: memberProgramSelected?.id,
                      companyId,
                    });
                  }}
                />
              </div>
              <div className={classes.programSelector}>
                <MaterialUISelector
                  value={{
                    value: memberProgramDetailed?.id,
                    label:
                      memberProgramDetailed.program?.name ||
                      t('program.selectProgram'),
                  }}
                  isMenuListPaddingDisabled
                  itemRenderer={(itemProps) => {
                    return (
                      <ProgramMenuItem
                        isInSelector
                        isDisabled={itemProps.isDisabled}
                        isSelected={itemProps.isSelected}
                        program={
                          memberProgramList.find(
                            (memberProgram) =>
                              memberProgram.program.id === itemProps.data.value,
                          ).program
                        }
                      />
                    );
                  }}
                  isMulti={false}
                  options={[...memberProgramList]?.map((memberProgram) => ({
                    value: memberProgram.program.id,
                    label: memberProgram.program.name,
                  }))}
                  onChange={(values) => {
                    const memberProgramSelected = memberProgramList.find(
                      (memberProgram) =>
                        memberProgram.program.id === values.value,
                    );
                    pushToRouter(memberProgramSelected.id);
                    retrieveMemberProgram({
                      memberProgramId: memberProgramSelected?.id,
                      companyId,
                    });
                  }}
                />
                <GenericDialog />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <MemberProgramDetail
                withIcon
                memberProgram={memberProgramDetailed}
                changeMemberMetricValue={(value, metric) => {
                  updateMemberMetricValue({
                    memberProgram: memberProgramDetailedId,
                    metric,
                    value,
                    company: companyId,
                  });
                }}
              />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}
const connector = connect(
  (state: RootState, props: RouterProps & OwnProps) => ({
    memberProgramDetailed: composeMemberProgramWithMetric(
      composeMemberProgramWithProgram(getMemberProgram),
    )(state, props.memberProgramDetailedId) as PerformanceTrackingMemberProgram,
    memberProgramList: composeMemberProgramWithProgram(
      getMemberProgramByMemberList,
    )(state, props.membership.id) as Array<PerformanceTrackingMemberProgram>,
    memberProgramLoading: state.performanceTracking.memberProgram.loading,
  }),
  {
    fetchProgram: fetchProgramAction,
    fetchMemberProgram: fetchMemberProgramAction,
    fetchMetric: fetchMetricAction,
    updateMemberMetricValue: updateMemberMetricValueAction,
    retrieveMemberProgram: retrieveMemberProgramAction,
    pushRouter,
  },
);

const mapWithHandlers = {
  pushToRouter:
    (
      props: ConnectedProps<typeof connector> &
        RouterProps &
        StateProps &
        OwnProps,
    ) =>
    (id?: number) => {
      if (id !== undefined) {
        props.pushRouter(`/c/${props.companyId}/program/${id}`);
      } else {
        props.pushRouter(`/c/${props.companyId}/program/`);
      }
    },
};

const styles = (theme: Theme) =>
  createStyles({
    programList: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    programSelector: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    noProgram: {
      paddingTop: theme.spacing(10),
    },
    infoAndText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
    container: {
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
    },
  });

export default compose(
  routerParamsToProps({
    memberProgramId: 'memberProgramDetailedId:number',
    companyId: 'companyId:number',
  }),
  withTranslation('performanceTracking'),
  withTitle(({ t }: WithTranslation) =>
    t('performanceTracking:metric.statistic'),
  ),
  withStyles(styles),
  connector,
  withHandlers(mapWithHandlers),
)(MemberProgramList);
