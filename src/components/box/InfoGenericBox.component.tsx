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
        <ErrorOutline fontSize="small" className={classes.iconError} />
      ) : (
        <Error fontSize="small" className={classes.iconError} />
      );
    case 'info':
      return variant === 'outlined' ? (
        <InfoOutlined fontSize="small" className={classes.iconInfo} />
      ) : (
        <Info fontSize="small" className={classes.iconInfo} />
      );
    case 'warning':
      return variant === 'outlined' ? (
        <WarningOutlined fontSize="small" className={classes.iconWarning} />
      ) : (
        <Warning fontSize="small" className={classes.iconWarning} />
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
  withCollapse?: boolean;
};

export const InfoGenericBox = (props: OwnProps) => {
  const classes = useStyles();
  const [openCollapse, setOpenCollapse] = useState(false);
  const onCollapseClick = () => {
    setOpenCollapse(!openCollapse);
  };

  return (
    <ButtonBase onClick={onCollapseClick} disabled={!props.withCollapse}>
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
        })}
      >
        {IconFromType(props.type, props.variantIcon)}
        <Typography
          variant="body2"
          className={classNames(classes.content, {
            [classes.contentWithCollapse]: !openCollapse,
          })}
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
  type: 'info',
};

const useStyles = makeStyles((theme: Theme) => ({
  boxContainer: {
    alignItems: 'flex-start',
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  boxContainerError: {
    backgroundColor: red[BACKGROUND_COLOR],
    color: red[TEXT_COLOR],
  },
  boxContainerInfo: {
    backgroundColor: blue[BACKGROUND_COLOR],
    color: blue[TEXT_COLOR],
  },
  boxContainerWarning: {
    backgroundColor: amber[BACKGROUND_COLOR],
    color: amber[TEXT_COLOR],
  },
  content: {
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
    color: blue[TEXT_COLOR],
  },
  outlinedBoxContainerWarning: {
    borderColor: amber[TEXT_COLOR],
    borderStyle: 'solid',
    borderWidth: '1px',
    color: amber[TEXT_COLOR],
  },
}));

export default InfoGenericBox;
