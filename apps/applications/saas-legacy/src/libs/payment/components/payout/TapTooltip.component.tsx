/**
 * Drop-in Tooltip replacement: on desktop shows a hover Tooltip,
 * on mobile wraps the child in a tappable span that opens a Popover.
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

type Props = {
  children: React.ReactElement;
  isMobile: boolean;
  placement?: React.ComponentProps<typeof Tooltip>['placement'];
  title: string;
};

const TapTooltip: React.FC<Props> = ({
  children,
  isMobile,
  placement = 'top',
  title,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);

  if (!title) return children;

  if (!isMobile) {
    return (
      <Tooltip placement={placement} title={title}>
        {children}
      </Tooltip>
    );
  }

  return (
    <>
      <span
        className={classes.tapTarget}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setAnchorEl(e.currentTarget);
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </span>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Typography className={classes.popoverText} variant="body2">
          {title}
        </Typography>
      </Popover>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tapTarget: {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  },
  popoverText: {
    maxWidth: 260,
    padding: theme.spacing(1, 1.5),
  },
}));

export default TapTooltip;
