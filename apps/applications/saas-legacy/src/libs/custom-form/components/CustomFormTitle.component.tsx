import React from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core';
import chroma from 'chroma-js';
import { openIntercomHelp } from '../../../intercom';
import { useCssVariantActivated } from '../hooks/useCssVariantActivated';

type Props = {
  title: string;
  isCompany: boolean;
  simplifyUI?: boolean;
};

export const CustomFormTitle: React.FC<Props> = ({
  title,
  isCompany,
  simplifyUI,
}) => {
  const classes = useStyles();

  const isCssVariantActivated = useCssVariantActivated();

  if (isCssVariantActivated) return null;

  return (
    <div className={classes.signupTitle}>
      <div className={classes.titleWithBorder}>
        <Typography className={classes.title}>{title}</Typography>
        {!simplifyUI && (
          <div
            className={`${classes.rectangle} ${
              isCompany
                ? classes.rectangleCompanyBackground
                : classes.rectangleBackground
            }`}
          />
        )}
        {!simplifyUI && (
          <div className={classes.iconButton}>
            <IconButton onClick={() => openIntercomHelp('login')}>
              <HelpIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

const HELP_CENTER_ICON_SIZE_PX = 48;

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 36,
    fontWeight: 700,
  },
  signupTitle: {
    paddingBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titleWithBorder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    right: `-${HELP_CENTER_ICON_SIZE_PX}px`,
    top: theme.spacing(0.5),
    width: `${HELP_CENTER_ICON_SIZE_PX}px`,
  },
  rectangle: {
    height: 5,
    width: 146,
    marginBottom: theme.spacing(3),
  },
  rectangleBackground: {
    background: 'linear-gradient(90deg, #499C7C 4.66%, #2D767F 88.6%)',
  },
  rectangleCompanyBackground: {
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.5)} 88.6%)`,
  },
}));

export default React.memo(CustomFormTitle);
