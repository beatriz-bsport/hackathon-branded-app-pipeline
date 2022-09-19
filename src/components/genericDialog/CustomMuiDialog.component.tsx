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
} from '@material-ui/core';
import GenericResponsiveDialog from './GenericResponsiveDialog';

type ButtonCustom = {
  label?: string;
  onClick: () => void;
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'default' | 'inherit';
  commonLabel?: 'cancel' | 'confirm' | 'next' | 'previous' | 'close' | 'finish';
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const COMMON_LABELS = [
  'cancel',
  'confirm',
  'next',
  'previous',
  'close',
  'finish',
];

const getButtonLabel = (label: string, commonLabel: string, t: TFunction) => {
  if (!!commonLabel && COMMON_LABELS.includes(commonLabel)) {
    return t(commonLabel);
  }
  return label;
};

type OwnProps = {
  children?: any;
  open: boolean;
  title: string;
  content?: string;
  contentAlign?: 'center' | 'justify' | 'left' | 'right';
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
      | string;
    disabled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  }>;
};
type Props = OwnProps;

export const CustomMuiDialog = (props: Props) => {
  const {
    open,
    title,
    content,
    contentAlign,
    buttons,
    maxWidth,
    fullScreenBreakpoint,
    onClose,
  } = props;
  const { t } = useTranslation('common');
  return (
    <GenericResponsiveDialog
      maxWidth={maxWidth}
      open={open}
      fullScreenBreakpoint={fullScreenBreakpoint}
      onClose={onClose}
    >
      <div style={{ width: '100%' }}>
        {!!title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          {!!content && (
            <Typography variant="body1" align={contentAlign ?? 'left'}>
              {content}
            </Typography>
          )}
          {!!props.children && props.children}
        </DialogContent>
        {!!buttons && (
          <DialogActions>
            {buttons.map((bt: ButtonCustom) => (
              <Button
                onClick={bt.onClick}
                variant={bt.variant || 'text'}
                color={bt.color || 'default'}
                disabled={bt.disabled}
                startIcon={!!bt.startIcon && !!bt.label && bt.startIcon}
                endIcon={!!bt.endIcon && !!bt.label && bt.endIcon}
              >
                {!bt.label && !!bt.startIcon && bt.startIcon}
                {(!!bt.label || !!bt.commonLabel) &&
                  getButtonLabel(bt.label, bt.commonLabel, t)}
                {!bt.label && !!bt.endIcon && bt.endIcon}
              </Button>
            ))}
          </DialogActions>
        )}
      </div>
    </GenericResponsiveDialog>
  );
};

CustomMuiDialog.defaultProps = {
  maxWidth: 'sm',
};

export default CustomMuiDialog;
