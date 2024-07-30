import React, { useRef, useState, useCallback } from 'react';

import { makeStyles, Popper, Typography } from '@material-ui/core';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

const HoverableWarning: React.FC<{
  id: string;
  text: string;
  disablePortal?: boolean;
  containerPortal?: React.ReactInstance;
  displayPopperWarning?: boolean;
}> = ({
  id,
  text,
  disablePortal = false,
  containerPortal = null,
  displayPopperWarning = true,
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReportProblemOutlinedIcon className={classes.warningIcon} />
      <Popper
        anchorEl={containerRef?.current}
        container={containerPortal}
        disablePortal={disablePortal}
        id={id}
        open={displayPopperWarning ? isOpen : false}
        placement="bottom-start"
      >
        <div className={classes.warningPaper}>
          <ReportProblemOutlinedIcon className={classes.warningIcon} />
          <Typography>{text}</Typography>
        </div>
      </Popper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  warningSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  warningPaper: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
    padding: theme.spacing(1),
    marginTop: -37,
    marginLeft: -theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    width: 200,
  },
  warningIcon: {
    fill: theme.palette.warning.main,
  },
}));

export default HoverableWarning;
