import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/styles';
import ReportProblemRounded from '@material-ui/icons/ReportProblemRounded';

type Props = {
  color?: string;
};

export const WarningIcon: React.FC<Props> = React.memo((props) => {
  const classes = useStyles(props.color);
  const theme: Theme = useTheme();

  return (
    <div className={classes.container}>
      <div className={classes.warningIcon}>
        <ReportProblemRounded
          className={classes.muiIcon}
          style={{
            color: props.color || theme.palette.warning.main,
          }}
        />
        <svg
          width={theme.spacing(14)}
          height={theme.spacing(14)}
          viewBox="0 0 112 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={theme.spacing(7)}
            cy={theme.spacing(7)}
            r={theme.spacing(7)}
            fill={props.color || theme.palette.warning.main}
            fillOpacity="0.2"
          />
        </svg>
      </div>
    </div>
  );
});
const useStyles = makeStyles<Theme>((theme) => ({
  muiIcon: {
    position: 'absolute',
    width: theme.spacing(9),
    height: theme.spacing(9),
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
  },
  container: {
    display: 'flex',
  },
  warningIcon: {
    position: 'relative',
  },
}));
export default WarningIcon;
