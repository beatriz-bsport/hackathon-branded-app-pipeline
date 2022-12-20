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
} from '@material-ui/core';
import GenericResponsiveDialog from './GenericResponsiveDialog';
import RedButton from '#components/button/RedButton.component';

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
  children?: any;
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
  return (
    <GenericResponsiveDialog
      maxWidth={maxWidth}
      open={open}
      fullScreenBreakpoint={fullScreenBreakpoint}
      onClose={onClose}
    >
      <div style={{ width: '100%' }}>
        {!!title && (
          <DialogTitle>
            <Typography variant="h6">{title}</Typography>
          </DialogTitle>
        )}
        <DialogContent>
          {!!content && (
            <Typography
              variant="body1"
              align={contentAlign ?? 'left'}
              color={contentColor ?? 'textPrimary'}
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
                  onClick={bt.onClick}
                  variant={bt.variant || 'text'}
                  disabled={bt.disabled}
                  startIcon={!!bt.startIcon && !!bt.label && bt.startIcon}
                  endIcon={!!bt.endIcon && !!bt.label && bt.endIcon}
                  className={bt.className}
                  delayBeforeActivation={bt.delayBeforeActivation}
                >
                  {!bt.label && !!bt.startIcon && bt.startIcon}
                  {(!!bt.label || !!bt.commonLabel) &&
                    getButtonLabel(bt.label, bt.commonLabel, t)}
                  {!bt.label && !!bt.endIcon && bt.endIcon}
                </RedButton>
              ) : (
                <Button
                  onClick={bt.onClick}
                  variant={bt.variant || 'text'}
                  color={bt.color || 'default'}
                  disabled={bt.disabled}
                  startIcon={!!bt.startIcon && !!bt.label && bt.startIcon}
                  endIcon={!!bt.endIcon && !!bt.label && bt.endIcon}
                  className={bt.className}
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

export default CustomMuiDialog;
