import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Tooltip from '#components/Tooltip.component';

type OwnProps = {
  open: boolean;
  anchor?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  width?: string;
  className?: string;
};
type Props = OwnProps;
export const GenericFormDialog: React.FC<Props> = ({
  children,
  open,
  title,
  subtitle,
  width,
  className,
  anchor = 'right',
  onClose,
}) => {
  const classes = useStyles({ width });
  const { t } = useTranslation('common');

  return (
    <Drawer
      anchor={anchor}
      open={open}
      classes={{ paper: classNames(classes.paper, className) }}
      ModalProps={{
        hideBackdrop: false,
        disableEnforceFocus: true,
      }}
      onClose={onClose}
    >
      <div className={classes.relative}>
        {onClose && (
          <div
            className={classNames(classes.topCancel, {
              [classes.topCancelLeft]: anchor === 'left',
              [classes.topCancelRight]: anchor === 'right',
            })}
          >
            <Tooltip title={t('cancel')}>
              <IconButton onClick={() => onClose()}>
                <HighlightOffIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {title && (
          <div className={classes.titleContainer}>
            <Typography
              className={classNames(classes.title, {
                [classes.titleLeft]: anchor === 'right' && onClose,
              })}
              variant="h4"
            >
              {title}
            </Typography>
            {subtitle && <Typography variant="h5">{subtitle}</Typography>}
          </div>
        )}
        <div className={classes.content}>{children}</div>
      </div>
    </Drawer>
  );
};
const useStyles = makeStyles<Theme, { width: string }>((theme) => ({
  paper: (props) => ({
    display: 'flex',
    width: props.width || '40%',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      width: '60%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    backgroundColor: 'transparent',
  }),
  relative: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    backgroundColor: 'white',
  },
  topCancel: {
    position: 'absolute',
    top: theme.spacing(2),
  },
  topCancelLeft: {
    right: theme.spacing(2),
  },
  topCancelRight: {
    left: theme.spacing(2),
  },
  titleContainer: {
    marginTop: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  titleLeft: {
    marginLeft: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  content: {
    flex: 1,
  },
}));
export default GenericFormDialog;
