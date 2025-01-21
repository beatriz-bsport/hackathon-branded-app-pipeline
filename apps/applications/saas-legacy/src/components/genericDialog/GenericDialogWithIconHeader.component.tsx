import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import GenericResponsiveDialog from './GenericResponsiveDialog';

type OwnProps = {
  children: any;
  footerAlign?: 'left' | 'center' | 'right';
  fullScreenBreakpoint?: Breakpoint;
  headerAlign?: 'left' | 'center' | 'right';
  headerIcon?: any;
  headerTitle?: string;
  maxWidth?: Breakpoint;
  onClose?: () => void;
  onCancelClick?: () => void;
  onCancelText?: string;
  onCancelVariant?: 'text' | 'outlined' | 'contained';
  onConfirmClick?: () => void;
  onConfirmText?: string;
  onConfirmVariant?: 'text' | 'outlined' | 'contained';
  open: boolean;
  withoutBottomActions?: boolean;
};

export type Props = OwnProps;

export const GenericDialogWithIconHeader: React.FC<Props> = (props) => {
  const {
    // DIALOG
    open,
    maxWidth,
    fullScreenBreakpoint,
    onClose,
    // HEADER
    headerAlign,
    headerIcon,
    headerTitle,
    // CONTENT
    children,
    // FOOTER
    footerAlign,
    onCancelClick,
    onCancelText,
    onCancelVariant,
    onConfirmClick,
    onConfirmText,
    onConfirmVariant,
    withoutBottomActions,
  } = props;
  const classes = useStyles();
  const buttonVariants = ['text', 'outlined', 'contained'];
  const cancelVariant = buttonVariants.includes(onCancelVariant)
    ? onCancelVariant
    : 'text';
  const confirmVariant = buttonVariants.includes(onConfirmVariant)
    ? onConfirmVariant
    : 'text';

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint={fullScreenBreakpoint}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
    >
      <div className={classes.container}>
        <div
          className={clsx(classes.header, {
            [classes.alignLeft]: headerAlign === 'left',
            [classes.alignCenter]: headerAlign === 'center',
            [classes.alignRight]: headerAlign === 'right',
          })}
        >
          {!!headerIcon && (
            <div className={classes.headerIcon}>{headerIcon}</div>
          )}
          {headerTitle && (
            <Typography className={classes.headerTitle} variant="h6">
              {headerTitle}
            </Typography>
          )}
        </div>
        {children}
        {!withoutBottomActions && (
          <div
            className={clsx(classes.footer, {
              [classes.alignLeft]: footerAlign === 'left',
              [classes.alignCenter]: footerAlign === 'center',
              [classes.alignRight]: footerAlign === 'right',
            })}
          >
            <div>
              {onCancelClick && onCancelText && (
                <Button
                  className={classes.button}
                  color="default"
                  onClick={onCancelClick}
                  variant={cancelVariant}
                >
                  {onCancelText}
                </Button>
              )}
              {onConfirmClick && onConfirmText && (
                <Button
                  className={classes.button}
                  color="secondary"
                  onClick={onConfirmClick}
                  variant={confirmVariant}
                >
                  {onConfirmText}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  button: {
    elevation: 5,
    borderRadius: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  headerIcon: {
    marginBottom: theme.spacing(2),
  },
  headerTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

GenericDialogWithIconHeader.defaultProps = {
  maxWidth: 'sm',
  footerAlign: 'center',
  headerAlign: 'center',
  onCancelVariant: 'text',
  onConfirmVariant: 'text',
};

export default GenericDialogWithIconHeader;
