import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { OfflineBolt } from '@material-ui/icons';
import { IconButton, Popover, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../../../components/Tooltip.component';
import {
  MetricRecord,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import MuiIcon from '#components/MuiIcon.component';

type OwnProps = {
  metricRecord: MetricRecord;
  program: PerformanceTrackingProgram;
};
type Props = OwnProps;
export const MemberProgramIconWithDetail = (props: Props) => {
  const { t } = useTranslation('performanceTracking');
  const { metricRecord, program } = props;
  const classes = useStyles({ color: program?.color });
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={t('metric.statistic')}>
        <IconButton onClick={handlePopoverOpen}>
          <OfflineBolt />
        </IconButton>
      </Tooltip>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
      >
        <div className={classes.popoverContainer}>
          <div className={classes.iconAndText}>
            <div className={classes.icon}>
              <MuiIcon icon={program?.icon} />
            </div>
            <Typography className={classes.name}>{program?.name}</Typography>
          </div>
          <div className={classes.row}>
            {metricRecord?.general?.metrics?.map((metricRecordItem) => (
              <Tooltip title={metricRecordItem?.metric?.name}>
                <div className={classes.circle}>{metricRecordItem?.value}</div>
              </Tooltip>
            ))}
          </div>
        </div>
      </Popover>
    </>
  );
};
const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  name: { fontWeight: 500 },
  icon: (props) => ({
    width: theme.spacing(3),
    display: 'flex',

    alignItems: 'center',
    color: props.color,
    marginRight: theme.spacing(2),
  }),
  container: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAndText: {
    display: 'flex',
  },
  popoverContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(2),
    maxWidth: '488px',
    flexWrap: 'wrap',
  },
  circle: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: '100%',
    padding: theme.spacing(1),
  },
}));
export default MemberProgramIconWithDetail;
