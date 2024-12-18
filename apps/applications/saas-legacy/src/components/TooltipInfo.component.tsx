import {
  IconButton,
  Tooltip,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import React from 'react';

const TooltipInfo: React.FC<{ helpText: string }> = ({ helpText }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Tooltip
      classes={{ tooltip: classes.tooltip }}
      placement="bottom-end"
      title={
        <div>
          <Typography variant="body1">{helpText}</Typography>
        </div>
      }
    >
      <IconButton className={classes.iconButton}>
        <InfoOutlined htmlColor={theme.palette.info.main} />
      </IconButton>
    </Tooltip>
  );
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    borderColor: theme.palette.info.main,
    color: theme.palette.text.primary,
    backgroundColor: 'white',
    border: '3px solid',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    width: 400,
    boxShadow: '0px 0px 12px rgba(121.84, 121.84, 121.84, 0.35)',
  },
  iconButton: {
    padding: theme.spacing(0.5),
  },
}));

export default React.memo(TooltipInfo);
