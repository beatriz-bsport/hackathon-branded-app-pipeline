import React, { useMemo } from 'react';
import chroma from 'chroma-js';

import makeStyles from '@material-ui/core/styles/makeStyles';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { InformationIconOriginEnum } from '#src/components/InformationIcon/constants';
import PopOver from '#src/components/Popover';

import type { PopoverOrigin } from '@material-ui/core/';

type Props = {
  /** The `anchorOrigin` prop passed to the original MUI popover component */
  anchorOrigin?: `${InformationIconOriginEnum}`;
  /** The `transformOrigin` prop passed to the original MUI popover component */
  transformOrigin?: `${InformationIconOriginEnum}`;
  /** The text to display in the popover */
  text: string;
};

/** A generic component made to display an informational text inside of a popover containing an info icon */
const InformationIcon: React.FC<Props> = ({
  anchorOrigin,
  transformOrigin,
  text,
}) => {
  const classes = useStyles();

  const popOverAnchorOrigin = useMemo(
    () =>
      ({
        horizontal: anchorOrigin?.split('-')[1] ?? 'left',
        vertical: anchorOrigin?.split('-')[0] ?? 'bottom',
      } as PopoverOrigin),
    [anchorOrigin],
  );

  const popOverTransformOrigin = useMemo(
    () =>
      ({
        horizontal: transformOrigin?.split('-')[1] ?? 'left',
        vertical: transformOrigin?.split('-')[0] ?? 'top',
      } as PopoverOrigin),
    [transformOrigin],
  );

  return (
    <PopOver
      anchorOrigin={popOverAnchorOrigin}
      className={classes.typographyContainer}
      customClasses={{
        container: classes.inlineFlex,
        hoveredText: classes.inlineFlex,
        MUIPaperContainer: classes.MUIPaperContainer,
      }}
      title={text}
      transformOrigin={popOverTransformOrigin}
    >
      <InfoOutlinedIcon className={classes.icon} />
    </PopOver>
  );
};

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.info.dark,
    transition: 'background-color 80ms ease-in',
    '&:hover': {
      backgroundColor: chroma(theme.palette.info.main).alpha(0.5).hex(),
    },
    padding: 2,
    borderRadius: 999,
  },
  inlineFlex: {
    display: 'inline-flex',
  },
  MUIPaperContainer: {
    boxShadow: `0px 0px 0px 2px ${
      theme.palette.info.dark
    }, 0px 0px 12px 0px ${chroma(theme.palette.grey[500]).alpha(0.35).hex()}`,
    borderRadius: theme.spacing(1),
    maxWidth: 300,
    marginTop: theme.spacing(1),
  },
  typographyContainer: {
    padding: theme.spacing(1),
  },
}));

export default React.memo(InformationIcon);
