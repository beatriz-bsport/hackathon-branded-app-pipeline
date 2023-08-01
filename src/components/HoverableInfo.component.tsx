import React, { useRef, useState, useCallback } from 'react';

import { makeStyles, Popper } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const HoverableInfo: React.FC<{
  text: string;
}> = ({ text }) => {
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
      className={classes.main}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InfoOutlinedIcon className={classes.infoIcon} />
      <Popper
        disablePortal
        // @ts-ignore
        anchorEl={containerRef}
        open={isOpen}
        placement="top-start"
      >
        <Alert className={classes.alert} severity="info">
          {text}
        </Alert>
      </Popper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    position: 'relative',
  },
  infoIcon: {
    fill: theme.palette.info.main,
    height: 22,
    width: 22,
  },
  alert: {
    marginTop: -13,
    marginLeft: 0 - theme.spacing(2),
    minWidth: 400,
  },
}));

export default React.memo(HoverableInfo);
