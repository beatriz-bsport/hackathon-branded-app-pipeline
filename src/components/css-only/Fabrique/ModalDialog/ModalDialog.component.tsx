import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import Button from '#Fabrique/ButtonV2';
import IconButton from '#Fabrique/IconButton';
import { XClose } from '#components/untitledui';

import type { ModalDialogColor, ModalDialogSize } from './types';

import { ModalDialogColorEnum, ModalDialogSizeEnum } from './constants';
import { useModalDialogDefaultLeftIcon } from './hooks';

import './styles.css';

type Props = {
  /** The text to display inside the cancel button. Fallback to 'Cancel' if not provided */
  cancelLabel?: string;
  /** Modal dialog main content */
  children?: React.ReactNode;
  /** Optional CSS class name to pass to root element */
  className?: string;
  /** Modal dialog color theme @default 'primary' */
  color?: ModalDialogColor;
  /** Optional CSS class name to pass to child element(s) */
  classes?: {
    header?: string;
    icon?: string;
    headerText?: string;
    title?: string;
    subtitle?: string;
    close?: string;
    content?: string;
    actions?: string;
    cancel?: string;
    confirm?: string;
  };
  /** The text to display inside the confirm button. Fallback to 'Confirm' if not provided */
  confirmLabel?: string;
  /** If set to `true` the root element width is set to `100%` */
  isFullWidth?: boolean;
  /** If `true` the confirm button is disabled */
  isSubmitLoading?: boolean;
  /** Custom SVG element to display. If none provided, a default one is displayed according to color */
  leftIcon?: React.ReactNode;
  /** Modal dialog size @default 'lg' */
  size?: ModalDialogSize;
  /** Optional subtitle text displayed in header */
  subtitle?: string;
  /** Optional element displayed as subtitle in header */
  subtitleElement?: React.ReactElement;
  /** Title text displayed in header */
  title: string;
  /** Action to perform on cancel button click */
  onCancel?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** Action to perform on close button click */
  onClose?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** If `true` the confirm button is disabled */
  isConfirmButtonDisabled?: boolean;
  /** If `true` cancel button is disabled */
  isCancelButtonDisabled?: boolean;
  /** If `true` close button is disabled */
  isCloseButtonDisabled?: boolean;
  /** Action to perform on confirm button click */
  onConfirm?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const ModalDialogColorClassNameMap = {
  [ModalDialogColorEnum.PRIMARY]: 'bs-fabrique-modal-dialog__root--primary',
  [ModalDialogColorEnum.INFO]: 'bs-fabrique-modal-dialog__root--info',
  [ModalDialogColorEnum.SUCCESS]: 'bs-fabrique-modal-dialog__root--success',
  [ModalDialogColorEnum.WARNING]: 'bs-fabrique-modal-dialog__root--warning',
  [ModalDialogColorEnum.ERROR]: 'bs-fabrique-modal-dialog__root--error',
};

const ModalDialogSizeClassNameMap = {
  [ModalDialogSizeEnum.XS]: 'bs-fabrique-modal-dialog__root--xs',
  [ModalDialogSizeEnum.MD]: 'bs-fabrique-modal-dialog__root--md',
  [ModalDialogSizeEnum.LG]: 'bs-fabrique-modal-dialog__root--lg',
  [ModalDialogSizeEnum.XL]: 'bs-fabrique-modal-dialog__root--xl',
};

export const ModalDialog: React.FC<Props> = ({
  cancelLabel,
  children,
  classes,
  className,
  color = ModalDialogColorEnum.PRIMARY,
  confirmLabel,
  isFullWidth,
  isSubmitLoading,
  leftIcon,
  size = ModalDialogSizeEnum.LG,
  subtitle,
  subtitleElement,
  title,
  onCancel,
  onClose,
  isConfirmButtonDisabled,
  isCancelButtonDisabled,
  isCloseButtonDisabled,
  onConfirm,
}) => {
  const { t } = useTranslation('common');
  const defaultLeftIcon = useModalDialogDefaultLeftIcon(color);
  const modalDialogColorClassName = ModalDialogColorClassNameMap[color];
  const modalDialogSizeClassName = ModalDialogSizeClassNameMap[size];

  const confirmButtonColor = useMemo(() => {
    if (color === ModalDialogColorEnum.SUCCESS) {
      return 'primary';
    }
    return color;
  }, [color]);

  const isLeftIconHidden =
    !(leftIcon || defaultLeftIcon) || size === ModalDialogSizeEnum.XS;

  const isThereOnlyOneFooterButton = !onConfirm || !oncancel;

  return (
    <div
      className={classNames(
        'bs-fabrique-modal-dialog__root',
        { 'bs-fabrique-modal-dialog__root--full-width': isFullWidth },
        modalDialogColorClassName,
        modalDialogSizeClassName,
        className,
      )}
    >
      <div
        className={classNames(
          'bs-fabrique-modal-dialog__header',
          classes?.header,
        )}
      >
        <div
          className={classNames(
            'bs-fabrique-modal-dialog__header__left-icon',
            {
              'bs-fabrique-modal-dialog__header__left-icon--hidden':
                isLeftIconHidden,
            },
            classes?.icon,
          )}
        >
          {leftIcon || defaultLeftIcon}
        </div>
        <div
          className={classNames(
            'bs-fabrique-modal-dialog__header__text',
            {
              'bs-fabrique-modal-dialog__header--hidden':
                !title && !subtitle && !subtitleElement,
            },
            classes?.headerText,
          )}
        >
          <Typography
            className={classNames(
              'bs-fabrique-modal-dialog__header__text__title',
              {
                'bs-fabrique-modal-dialog__header__text__title--hidden': !title,
              },
              classes?.title,
            )}
            variant="title-sm"
          >
            {title}
          </Typography>
          <Typography
            className={classNames(
              'bs-fabrique-modal-dialog__header__text__subtitle',
              {
                'bs-fabrique-modal-dialog__header__text__subtitle--hidden':
                  !subtitle,
              },
              classes?.subtitle,
            )}
            variant="body-md"
          >
            {subtitle}
          </Typography>
          {subtitleElement}
        </div>
        <IconButton
          className={classNames(
            'bs-fabrique-modal-dialog__header__close',
            {
              'bs-fabrique-modal-dialog__header__close--hidden': !onClose,
            },
            classes?.close,
          )}
          color="grey"
          isDisabled={isSubmitLoading || isCloseButtonDisabled}
          onClick={onClose}
          variant="text"
        >
          <XClose
            className="bs-fabrique-modal-dialog__header__close__icon"
            stroke="currentColor"
          />
        </IconButton>
      </div>

      <div
        className={classNames(
          'bs-fabrique-modal-dialog__content',
          {
            'bs-fabrique-modal-dialog__content--hidden': !children,
          },
          classes?.content,
        )}
      >
        {children}
      </div>

      <div className={classNames('bs-fabrique-modal-dialog__footer')}>
        <div
          className={classNames(
            'bs-fabrique-modal-dialog__footer__actions',
            {
              'bs-fabrique-modal-dialog__footer__actions--hidden': !onClose,
            },
            classes?.actions,
          )}
        >
          <Button
            className={classNames(
              {
                'bs-fabrique-modal-dialog__footer__actions__cancel':
                  !isThereOnlyOneFooterButton,
                'bs-fabrique-modal-dialog__footer__actions__cancel--hidden':
                  !onCancel,
                'bs-fabrique-modal-dialog__footer__actions__cancel--larger':
                  isThereOnlyOneFooterButton,
              },
              classes?.cancel,
            )}
            color="grey"
            isDisabled={isSubmitLoading || isCancelButtonDisabled}
            onClick={onCancel}
            size="md"
            variant="outlined"
          >
            {cancelLabel || t('common:cancel')}
          </Button>
          <Button
            className={classNames(
              {
                'bs-fabrique-modal-dialog__footer__actions__confirm':
                  !isThereOnlyOneFooterButton,
                'bs-fabrique-modal-dialog__footer__actions__confirm--hidden':
                  !onConfirm,
                'bs-fabrique-modal-dialog__footer__actions__confirm--larger':
                  isThereOnlyOneFooterButton,
              },
              classes?.confirm,
            )}
            color={confirmButtonColor}
            isDisabled={isSubmitLoading || isConfirmButtonDisabled}
            onClick={onConfirm}
            size="md"
            variant="contained"
          >
            {confirmLabel || t('common:confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ModalDialogStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ModalDialog>>()(ModalDialog);

export default React.memo(ModalDialog);
