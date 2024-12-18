import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';
import { amber, red, blue } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import {
  Error,
  ErrorOutline,
  Info,
  InfoOutlined,
  ReportProblem as Warning,
  ReportProblemOutlined as WarningOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@material-ui/icons';
import { ButtonBase } from '@material-ui/core';

const BACKGROUND_COLOR = 50;
const TEXT_COLOR = 900;

const IconFromType = (
  type: 'error' | 'info' | 'warning',
  variant: 'contained' | 'outlined',
) => {
  const classes = useStyles();
  switch (type) {
    case 'error':
      return variant === 'outlined' ? (
        <ErrorOutline className={classes.iconError} fontSize="small" />
      ) : (
        <Error className={classes.iconError} fontSize="small" />
      );
    case 'info':
      return variant === 'outlined' ? (
        <InfoOutlined className={classes.iconInfo} fontSize="small" />
      ) : (
        <Info className={classes.iconInfo} fontSize="small" />
      );
    case 'warning':
      return variant === 'outlined' ? (
        <WarningOutlined className={classes.iconWarning} fontSize="small" />
      ) : (
        <Warning className={classes.iconWarning} fontSize="small" />
      );
    default:
      return <></>;
  }
};

export type OwnProps = {
  content: string;
  type?: 'error' | 'info' | 'warning';
  variant?: 'contained' | 'outlined';
  variantIcon?: 'contained' | 'outlined';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  withCollapse?: boolean;
  className?: string;
};

export const InfoGenericBox = (props: OwnProps) => {
  const classes = useStyles();
  const [openCollapse, setOpenCollapse] = useState(true);
  const onCollapseClick = () => {
    setOpenCollapse(!openCollapse);
  };

  return (
    <ButtonBase
      disableRipple
      disableTouchRipple
      className={props.className}
      disabled={!props.withCollapse}
      onClick={onCollapseClick}
    >
      <div
        className={classNames(classes.boxContainer, {
          [classes.boxContainerError]:
            props.type === 'error' && props.variant === 'contained',
          [classes.boxContainerInfo]:
            props.type === 'info' && props.variant === 'contained',
          [classes.boxContainerWarning]:
            props.type === 'warning' && props.variant === 'contained',
          [classes.outlinedBoxContainerError]:
            props.type === 'error' && props.variant === 'outlined',
          [classes.outlinedBoxContainerInfo]:
            props.type === 'info' && props.variant === 'outlined',
          [classes.outlinedBoxContainerWarning]:
            props.type === 'warning' && props.variant === 'outlined',
          [classes.alignCenter]: props.alignItems === 'center',
          [classes.alignStart]: props.alignItems === 'flex-start',
          [classes.alignEnd]: props.alignItems === 'flex-end',
        })}
      >
        {IconFromType(props.type, props.variantIcon)}
        <Typography
          className={classNames(classes.content, {
            [classes.contentWithCollapse]: !openCollapse,
          })}
          variant="body2"
        >
          {props.content}
        </Typography>
        {props.withCollapse &&
          (openCollapse ? (
            <KeyboardArrowUp fontSize="small" />
          ) : (
            <KeyboardArrowDown fontSize="small" />
          ))}
      </div>
    </ButtonBase>
  );
};

InfoGenericBox.defaultProps = {
  variant: 'contained',
  variantIcon: 'outlined',
  alignItems: 'center',
  type: 'info',
};

const useStyles = makeStyles((theme: Theme) => ({
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignItems: 'center',
  },
  boxContainer: {
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  boxContainerError: {
    backgroundColor: red[BACKGROUND_COLOR],
    color: red[TEXT_COLOR],
  },
  boxContainerInfo: {
    backgroundColor: blue[BACKGROUND_COLOR],
    color: theme.palette.info.main,
  },
  boxContainerWarning: {
    backgroundColor: amber[BACKGROUND_COLOR],
    color: amber[TEXT_COLOR],
  },
  content: {
    display: 'flex',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textAlign: 'left',
    flex: 1,
  },
  contentWithCollapse: {
    display: '-webkit-box',
    boxOrient: 'vertical',
    lineClamp: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    overflowWrap: 'break-word',
  },
  iconError: {
    color: theme.palette.error.main,
  },
  iconInfo: {
    color: theme.palette.info.main,
  },
  iconWarning: {
    color: theme.palette.warning.main,
  },
  outlinedBoxContainerError: {
    borderColor: red[TEXT_COLOR],
    borderStyle: 'solid',
    borderWidth: '1px',
    color: red[TEXT_COLOR],
  },
  outlinedBoxContainerInfo: {
    borderColor: blue[TEXT_COLOR],
    borderStyle: 'solid',
    borderWidth: '1px',
    color: theme.palette.info.main,
  },
  outlinedBoxContainerWarning: {
    borderColor: amber[TEXT_COLOR],
    borderStyle: 'solid',
    borderWidth: '1px',
    color: amber[TEXT_COLOR],
  },
}));

export default InfoGenericBox;
