import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '#components/Tooltip.component';

type OwnProps = {
  open: boolean;
  anchor?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
};
type Props = OwnProps;
export const GenericFormDialog: React.FC<Props> = (props) => {
  const { children, open, title, subtitle } = props;
  const classes = useStyles();
  const { t } = useTranslation('common');
  return (
    <Drawer
      anchor={props.anchor || 'right'}
      open={open}
      classes={{ paper: classes.paper }}
      ModalProps={{
        hideBackdrop: false,
        disableEnforceFocus: true,
      }}
    >
      {props.onClose && (
        <div className={classes.topCancel}>
          <Tooltip title={t('cancel')}>
            <IconButton onClick={() => props.onClose()}>
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {title && (
        <div className={classes.titleContainer}>
          <Typography variant="h4">{title}</Typography>
          {subtitle && <Typography variant="h5">{subtitle}</Typography>}
        </div>
      )}
      {children}
    </Drawer>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: 'flex',
    width: '40%',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      width: '60%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  topCancel: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  titleContainer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
}));
export default GenericFormDialog;
