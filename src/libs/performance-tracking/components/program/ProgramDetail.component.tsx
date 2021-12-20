import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Divider, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import {
  PerformanceTrackingMemberProgram,
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import ProgramCard from './ProgramCard.component';
import MetricList from '../metrics/MetricList.component';
import ProgramDetailMember from './ProgramDetailMember.component';
import { MEMBER_PROGRAM_PER_PAGE } from '#libs/performance-tracking/utils';
import { Member } from '#libs/member/types';

type OwnProps = {
  program: PerformanceTrackingProgram;
  onDelete: (program: PerformanceTrackingProgram) => void;
  onEdit: (program: PerformanceTrackingProgram) => void;
  memberProgramPaginated: {
    items: Array<
      PerformanceTrackingMemberProgram<
        number,
        PerformanceTrackingMetric,
        Member
      >
    >;
    allIds?: number[];
    page: number;
    next_page: number;
    count: number;
    loading: boolean;
  };
  onPageRequested: (page: number, pageSize: number) => void;
  metricLoading: boolean;
};

type Props = OwnProps & WithTranslation;
export const ProgramDetail = (props: Props) => {
  const {
    t,
    program,
    onDelete,
    onEdit,
    memberProgramPaginated,
    metricLoading,
    onPageRequested,
  } = props;
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div>
        <div className={classes.title}>
          <Typography variant="h5">{t('program.detail')}</Typography>
        </div>

        <Divider />
      </div>
      {!program ? (
        <div className={classes.noProgram}>
          <Info /> <Typography>{t('program.infoSelectProgram')}</Typography>
        </div>
      ) : (
        <>
          <ProgramCard program={program} onDelete={onDelete} onEdit={onEdit} />
          <div>
            <div className={classes.title}>
              <Typography variant="h5">{t('metric.title')}</Typography>
            </div>

            <Divider />
          </div>
          <div>
            <MetricList
              metricList={program.metric_list}
              loading={metricLoading}
            />
          </div>
          <div>
            <div className={classes.title}>
              <Typography variant="h5">{t('program.member.title')}</Typography>
            </div>

            <Divider />
          </div>
          <div>
            <ProgramDetailMember
              {...memberProgramPaginated}
              itemPerPage={MEMBER_PROGRAM_PER_PAGE}
              onPageRequested={onPageRequested}
              program={program}
            />
          </div>
        </>
      )}
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  search: {
    width: '30%',
    alignItems: 'flex-end',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  noProgram: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    gap: theme.spacing(2),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramDetail,
);
