import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/styles';
import Update from '@material-ui/icons/Update';

type Props = {
  color?: string;
};

export const UpdateIcon: React.FC<Props> = (props) => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  return (
    <div className={classes.container}>
      <div className={classes.updateIcon}>
        <Update
          width="96px"
          height="77px"
          className={classes.muiIcon}
          style={{
            color: props.color || theme.palette.warning.main,
          }}
        />
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="55"
            cy="55"
            r="55"
            fill={props.color ? props.color : theme.palette.warning.main}
            fillOpacity="0.2"
          />
        </svg>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>(() => ({
  muiIcon: {
    position: 'absolute',
    top: '6%',
    left: '6%',
    width: '96px',
    height: '96px',
  },
  container: { display: 'flex' },
  updateIcon: { position: 'relative' },
}));
export default UpdateIcon;
