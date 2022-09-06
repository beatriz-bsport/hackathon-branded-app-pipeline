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
import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

type OwnProps = {
  open: boolean;
  anchor?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  onClose?: () => void;
  title?: string;
  withoutPadding?: boolean;
  subtitle?: string;
  width?: string;
  className?: string;
  flexContent?: boolean;
  mobileMinWidth?: string;
  withoutHeaderContainer?: boolean;
  trackingObjectIdentifier?: SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM;
  trackingObjectId?: number;
};
type Props = OwnProps;

export const GenericResponsiveDrawer: React.FC<Props> = ({
  children,
  open,
  title,
  subtitle,
  width,
  className,
  anchor = 'right',
  withoutPadding = false,
  flexContent,
  mobileMinWidth,
  withoutHeaderContainer,
  onClose,
  trackingObjectIdentifier,
  trackingObjectId,
}) => {
  const classes = useStyles({ width, subtitle, mobileMinWidth });
  const { t } = useTranslation('common');

  const close = React.useCallback(() => {
    onClose && onClose();
    if (trackingObjectIdentifier) {
      const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
        trackingObjectIdentifier,
      );
      trackFormCancel(trackingObjectId);
    }
  }, [trackingObjectIdentifier, trackingObjectId, onClose]);

  return (
    <Drawer
      anchor={anchor}
      open={open}
      classes={{ paper: classNames(classes.paper, className) }}
      ModalProps={{
        hideBackdrop: false,
        disableEnforceFocus: true,
      }}
      onClose={close}
    >
      <div className={classes.relative}>
        {!withoutHeaderContainer && (
          <div className={classes.firstRow}>
            {onClose && (
              <div
                className={classNames(classes.topCancel, {
                  [classes.topCancelLeft]: anchor === 'left',
                  [classes.topCancelRight]: anchor === 'right',
                })}
              >
                <Tooltip title={t('cancel')}>
                  <IconButton onClick={close}>
                    <HighlightOffIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
            {title && (
              <div
                className={
                  (classes.titleContainer,
                  classNames(classes.title, {
                    [classes.titleLeft]: anchor === 'right' && onClose,
                  }))
                }
              >
                <Typography variant="h4">{title}</Typography>
                {subtitle && (
                  <Typography variant="body1">{subtitle}</Typography>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={classNames(classes.content, {
            [classes.padding]: !withoutPadding,
            [classes.flex]: flexContent,
            [classes.contentResized]: !!mobileMinWidth,
          })}
        >
          {children}
        </div>
      </div>
    </Drawer>
  );
};
const useStyles = makeStyles<
  Theme,
  { width: string; subtitle: boolean; mobileMinWidth: string }
>((theme) => ({
  paper: (props) => ({
    width: props.width || '40%',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      width: props.width || '60%',
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
  firstRow: (props) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyItems: 'flex-start',
    marginTop: props.subtitle ? null : theme.spacing(3),
  }),
  topCancelLeft: {
    right: theme.spacing(2),
  },
  topCancelRight: {
    left: theme.spacing(2),
  },
  titleLeft: (props) => ({
    marginLeft: theme.spacing(2),
    marginTop: props.subtitle ? theme.spacing(3) : null,
  }),
  content: {
    flex: 1,
    minWidth: '500px',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentResized: (props) => ({
    [theme.breakpoints.down('sm')]: {
      minWidth: props.mobileMinWidth ?? '350px',
    },
  }),
  padding: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));
export default GenericResponsiveDrawer;
