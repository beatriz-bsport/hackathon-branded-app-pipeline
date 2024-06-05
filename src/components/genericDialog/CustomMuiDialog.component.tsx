import React from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider,
  makeStyles,
} from '@material-ui/core';
import RedButton from '#src/components/button/RedButton.component';
import GenericResponsiveDialog from './GenericResponsiveDialog';

type ButtonCustom = {
  label?: string;
  onClick: () => void;
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'default' | 'inherit';
  commonLabel?:
    | 'cancel'
    | 'confirm'
    | 'next'
    | 'previous'
    | 'close'
    | 'finish'
    | 'saveRecord'
    | 'delete'
    | 'download';
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  delayBeforeActivation?: number;
};

const COMMON_LABELS = [
  'cancel',
  'confirm',
  'next',
  'previous',
  'close',
  'finish',
  'saveRecord',
  'download',
  'delete',
];

const getButtonLabel = (label: string, commonLabel: string, t: TFunction) => {
  if (!!commonLabel && COMMON_LABELS.includes(commonLabel)) {
    return t(commonLabel);
  }
  return label;
};

type OwnProps = {
  children?: React.ReactElement;
  open: boolean;
  title?: string;
  content?: string;
  contentAlign?: 'center' | 'justify' | 'left' | 'right';
  contentColor?: 'textPrimary' | 'textSecondary';
  withButtonsDivider?: boolean;
  maxWidth?: Breakpoint;
  fullScreenBreakpoint?: Breakpoint;
  onClose?: () => void;
  buttons: Array<{
    label?: string;
    onClick: () => void;
    variant?: 'text' | 'contained' | 'outlined' | string;
    color?: 'primary' | 'secondary' | 'default' | 'inherit' | string;
    commonLabel?:
      | 'cancel'
      | 'confirm'
      | 'next'
      | 'previous'
      | 'close'
      | 'finish'
      | 'saveRecord'
      | 'delete'
      | 'download'
      | string;
    disabled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    className?: string;
    delayBeforeActivation?: number;
  }>;
};
type Props = OwnProps;

export const CustomMuiDialog = (props: Props) => {
  const {
    open,
    title,
    content,
    contentAlign,
    contentColor,
    buttons,
    maxWidth,
    fullScreenBreakpoint,
    withButtonsDivider,
    onClose,
  } = props;
  const { t } = useTranslation('common');
  const classes = useStyles();
  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint={fullScreenBreakpoint}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
    >
      <div className={classes.dialog}>
        {!!title && (
          <DialogTitle>
            <Typography variant="h6">{title}</Typography>
          </DialogTitle>
        )}
        <DialogContent>
          {!!content && (
            <Typography
              align={contentAlign ?? 'left'}
              color={contentColor ?? 'textPrimary'}
              variant="body1"
            >
              {content}
            </Typography>
          )}
          {!!props.children && props.children}
        </DialogContent>
        {!!buttons && withButtonsDivider && <Divider variant="fullWidth" />}
        {!!buttons && (
          <DialogActions>
            {buttons.map((bt: ButtonCustom) =>
              bt.delayBeforeActivation ? (
                <RedButton
                  className={bt.className}
                  delayBeforeActivation={bt.delayBeforeActivation}
                  disabled={bt.disabled}
                  endIcon={!!bt.endIcon && !!bt.label && bt.endIcon}
                  onClick={bt.onClick}
                  startIcon={!!bt.startIcon && !!bt.label && bt.startIcon}
                  variant={bt.variant || 'text'}
                >
                  {!bt.label && !!bt.startIcon && bt.startIcon}
                  {(!!bt.label || !!bt.commonLabel) &&
                    getButtonLabel(bt.label, bt.commonLabel, t)}
                  {!bt.label && !!bt.endIcon && bt.endIcon}
                </RedButton>
              ) : (
                <Button
                  className={bt.className}
                  color={bt.color || 'default'}
                  disabled={bt.disabled}
                  endIcon={!!bt.endIcon && !!bt.label && bt.endIcon}
                  onClick={bt.onClick}
                  startIcon={!!bt.startIcon && !!bt.label && bt.startIcon}
                  variant={bt.variant || 'text'}
                >
                  {!bt.label && !!bt.startIcon && bt.startIcon}
                  {(!!bt.label || !!bt.commonLabel) &&
                    getButtonLabel(bt.label, bt.commonLabel, t)}
                  {!bt.label && !!bt.endIcon && bt.endIcon}
                </Button>
              ),
            )}
          </DialogActions>
        )}
      </div>
    </GenericResponsiveDialog>
  );
};

CustomMuiDialog.defaultProps = {
  maxWidth: 'sm',
};

const useStyles = makeStyles(() => ({
  dialog: {
    width: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default CustomMuiDialog;
