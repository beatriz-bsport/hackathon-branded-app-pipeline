import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Divider, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { PerformanceTrackingMemberProgram } from '#libs/performance-tracking/types';
import SliderForm from './SliderForm.component';
import MuiIcon from '#components/MuiIcon.component';

type OwnProps = {
  memberProgram: PerformanceTrackingMemberProgram;
  withIcon?: boolean;
  changeMemberMetricValue: (value: number, metric: number) => void;
};
type Props = OwnProps & WithTranslation;
export const MemberProgramDetail = (props: Props) => {
  const { t, memberProgram, withIcon, changeMemberMetricValue } = props;
  const classes = useStyles({ color: memberProgram?.program?.color });

  return (
    <>
      {!memberProgram || !memberProgram.program ? (
        <div className={classes.noProgram}>
          <Info />
          <Typography>{t('program.infoSelectProgram')}</Typography>
        </div>
      ) : (
        <div className={classes.container}>
          <div>
            <div className={classes.title}>
              {withIcon && (
                <div className={classes.icon}>
                  <MuiIcon icon={memberProgram?.program?.icon} />
                </div>
              )}
              <Typography variant="h5">
                {memberProgram.program?.name}
              </Typography>
            </div>

            <Divider />
          </div>
          <Typography>{memberProgram.program?.description}</Typography>
          <div className={classes.metricContainer}>
            {memberProgram?.metric_record?.general?.metrics?.map(
              (member_metric) => (
                <SliderForm
                  value={member_metric?.value}
                  metric={member_metric?.metric}
                  changeMemberMetricValue={changeMemberMetricValue}
                />
              ),
            )}
          </div>
        </div>
      )}
    </>
  );
};
const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  icon: (props) => ({
    width: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: props.color,
    marginRight: theme.spacing(2),
  }),
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  metricContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  noProgram: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(10),
    gap: theme.spacing(2),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  MemberProgramDetail,
);
