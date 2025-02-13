import React from 'react';
import { WithStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Popper from '@material-ui/core/Popper';
import ReportProblem from '@material-ui/icons/ReportProblemOutlined';

type RecipientInformationsWarningProps = {
  t: (key: string) => string;
  warningMessage: string;
  displayWarningFull: boolean;
  anchorEl: any;
  setAnchorEl: (anchorEl: any) => void;
  setDisplayWarningFull: (displayWarningFull: boolean) => void;
} & WithStyles;

const RecipientInformationsWarning: React.FC<
  RecipientInformationsWarningProps
> = ({
  classes,
  displayWarningFull,
  setDisplayWarningFull,
  anchorEl,
  setAnchorEl,
  t,
  warningMessage,
}: RecipientInformationsWarningProps) => {
  const hoverIn = (event: React.PointerEvent) => {
    setDisplayWarningFull(true);
    setAnchorEl(event.currentTarget);
  };
  const hoverOut = () => {
    setDisplayWarningFull(false);
    setAnchorEl(null);
  };
  if (warningMessage === '') {
    return null;
  }
  return (
    <>
      <div
        className={classes.headerWarningContainer}
        onPointerEnter={hoverIn}
        onPointerLeave={hoverOut}
      >
        <ReportProblem className={classes.warningIcon} />
        <Typography className={classes.headerWarningText} variant="body2">
          {t('dialogRecipients.warnings.header')}
        </Typography>
      </div>
      <Hidden xsDown>
        <Popper
          disablePortal
          anchorEl={anchorEl}
          className={classes.popperContainer}
          id="warning"
          open={displayWarningFull}
          placement="bottom"
        >
          <Typography className={classes.popperWarningText} variant="caption">
            {warningMessage}
          </Typography>
        </Popper>
      </Hidden>
    </>
  );
};

export default React.memo(RecipientInformationsWarning);
