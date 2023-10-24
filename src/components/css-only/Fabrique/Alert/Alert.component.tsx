import React, { useMemo } from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import Button from '#Fabrique/ButtonV2';
import IconButton from '#Fabrique/IconButton';
import { useAlertDefaultLeftIcon } from './hooks';

import {
  TypographyTextAlign,
  TypographyVariant,
} from '#Fabrique/Typography/constants';
import { AlertColorEnum, AlertVariantEnum } from './constants';

import type { AlertColor, AlertVariant } from './types';

import './styles.css';

type Props = {
  /** The alert main text content */
  children: React.ReactNode;
  /** Optional CSS class names passed to root container */
  className?: string;
  /** Optional CSS class names passed to children containers */
  classes?: {
    leftIcon?: string;
    title?: string;
    content?: string;
    actions?: string;
    mainAction?: string;
    closeAction?: string;
  };
  /** */
  color?: AlertColor;
  /** Variant of the alert @default 'text' */
  variant?: AlertVariant;
  /** Optional custom left icon. If none provided a default one is displayed according to color */
  leftIcon?: React.ReactNode;
  /** Alert title - displayed above content */
  title?: string;
  /** Text displayed in the action button */
  actionText?: string;
  /** If set along with `actionText` a button will be displayed */
  onActionClick?: () => void;
  /** If set the close action will be displayed */
  onClose?: () => void;
};

const AlertBackgroundClassNameMap = {
  [`${AlertVariantEnum.STRONG}-${AlertColorEnum.LIGHT}`]:
    'bs-fabrique-alert__root--strong-light',
  [`${AlertVariantEnum.STRONG}-${AlertColorEnum.GREY}`]:
    'bs-fabrique-alert__root--strong-grey',
  [`${AlertVariantEnum.STRONG}-${AlertColorEnum.INFO}`]:
    'bs-fabrique-alert__root--strong-info',
  [`${AlertVariantEnum.STRONG}-${AlertColorEnum.SUCCESS}`]:
    'bs-fabrique-alert__root--strong-success',
  [`${AlertVariantEnum.STRONG}-${AlertColorEnum.WARNING}`]:
    'bs-fabrique-alert__root--strong-warning',
  [`${AlertVariantEnum.STRONG}-${AlertColorEnum.ERROR}`]:
    'bs-fabrique-alert__root--strong-error',
  [`${AlertVariantEnum.WEAK}-${AlertColorEnum.LIGHT}`]:
    'bs-fabrique-alert__root--weak-light',
  [`${AlertVariantEnum.WEAK}-${AlertColorEnum.GREY}`]:
    'bs-fabrique-alert__root--weak-grey',
  [`${AlertVariantEnum.WEAK}-${AlertColorEnum.INFO}`]:
    'bs-fabrique-alert__root--weak-info',
  [`${AlertVariantEnum.WEAK}-${AlertColorEnum.SUCCESS}`]:
    'bs-fabrique-alert__root--weak-success',
  [`${AlertVariantEnum.WEAK}-${AlertColorEnum.WARNING}`]:
    'bs-fabrique-alert__root--weak-warning',
  [`${AlertVariantEnum.WEAK}-${AlertColorEnum.ERROR}`]:
    'bs-fabrique-alert__root--weak-error',
  [`${AlertVariantEnum.OUTLINED}-${AlertColorEnum.LIGHT}`]:
    'bs-fabrique-alert__root--outlined-light',
  [`${AlertVariantEnum.OUTLINED}-${AlertColorEnum.GREY}`]:
    'bs-fabrique-alert__root--outlined-grey',
  [`${AlertVariantEnum.OUTLINED}-${AlertColorEnum.INFO}`]:
    'bs-fabrique-alert__root--outlined-info',
  [`${AlertVariantEnum.OUTLINED}-${AlertColorEnum.SUCCESS}`]:
    'bs-fabrique-alert__root--outlined-success',
  [`${AlertVariantEnum.OUTLINED}-${AlertColorEnum.WARNING}`]:
    'bs-fabrique-alert__root--outlined-warning',
  [`${AlertVariantEnum.OUTLINED}-${AlertColorEnum.ERROR}`]:
    'bs-fabrique-alert__root--outlined-error',
  [`${AlertVariantEnum.TEXT}-${AlertColorEnum.LIGHT}`]:
    'bs-fabrique-alert__root--text-light',
  [`${AlertVariantEnum.TEXT}-${AlertColorEnum.GREY}`]:
    'bs-fabrique-alert__root--text-grey',
  [`${AlertVariantEnum.TEXT}-${AlertColorEnum.INFO}`]:
    'bs-fabrique-alert__root--text-info',
  [`${AlertVariantEnum.TEXT}-${AlertColorEnum.SUCCESS}`]:
    'bs-fabrique-alert__root--text-success',
  [`${AlertVariantEnum.TEXT}-${AlertColorEnum.WARNING}`]:
    'bs-fabrique-alert__root--text-warning',
  [`${AlertVariantEnum.TEXT}-${AlertColorEnum.ERROR}`]:
    'bs-fabrique-alert__root--text-error',
};

/* TODO: replace with import from icons library */
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M4.4107 4.4107C4.73614 4.08527 5.26378 4.08527 5.58921 4.4107L9.99996 8.82145L14.4107 4.4107C14.7361 4.08527 15.2638 4.08527 15.5892 4.4107C15.9147 4.73614 15.9147 5.26378 15.5892 5.58921L11.1785 9.99996L15.5892 14.4107C15.9147 14.7361 15.9147 15.2638 15.5892 15.5892C15.2638 15.9147 14.7361 15.9147 14.4107 15.5892L9.99996 11.1785L5.58921 15.5892C5.26378 15.9147 4.73614 15.9147 4.4107 15.5892C4.08527 15.2638 4.08527 14.7361 4.4107 14.4107L8.82145 9.99996L4.4107 5.58921C4.08527 5.26378 4.08527 4.73614 4.4107 4.4107Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const Alert: React.FC<Props> = ({
  children,
  className,
  classes,
  color = AlertColorEnum.LIGHT,
  variant = AlertVariantEnum.TEXT,
  leftIcon,
  title,
  actionText,
  onActionClick,
  onClose,
}) => {
  const defaultLeftIcon = useAlertDefaultLeftIcon(color);

  const backgroundClassName =
    AlertBackgroundClassNameMap[`${variant}-${color}`];

  const actionButtonColor = useMemo(() => {
    if (color === 'light') {
      return 'grey';
    }
    if (variant === 'strong') {
      return 'white';
    }
    if (color === 'success') {
      return 'grey';
    }
    return color;
  }, [color, variant]);

  return (
    <div
      className={classNames(
        'bs-fabrique-alert__root',
        backgroundClassName,
        className,
      )}
    >
      <div
        className={classNames(
          'bs-fabrique-alert__left-icon',
          {
            'bs-fabrique-alert__left-icon--hidden': !(
              leftIcon || defaultLeftIcon
            ),
          },
          classes?.leftIcon,
        )}
      >
        {leftIcon || defaultLeftIcon}
      </div>
      <div className="bs-fabrique-alert__text">
        <Typography
          align={TypographyTextAlign.LEFT}
          className={classNames(
            'bs-fabrique-alert__text__title',
            {
              'bs-fabrique-alert__text__title--hidden': !title,
            },
            classes?.title,
          )}
          variant={TypographyVariant.BODY_MD}
        >
          {title}
        </Typography>
        <Typography
          align={TypographyTextAlign.LEFT}
          className={classNames(
            'bs-fabrique-alert__text__content',
            classes?.content,
          )}
          variant={TypographyVariant.BODY_SM}
        >
          {children}
        </Typography>
      </div>

      <div
        className={classNames(
          'bs-fabrique-alert__actions',
          {
            'bs-fabrique-alert__actions--hidden': !title,
          },
          classes?.actions,
        )}
      >
        <Button
          className={classNames(
            'bs-fabrique-alert__actions__main',
            {
              'bs-fabrique-alert__actions__main--hidden':
                !actionText || !onActionClick,
            },
            classes?.mainAction,
          )}
          color={actionButtonColor}
          onClick={onActionClick}
          size="md"
          type="button"
          variant="text"
        >
          {actionText}
        </Button>
        <IconButton
          className={classNames(
            'bs-fabrique-alert__actions__close',
            {
              'bs-fabrique-alert__actions--hidden': !title,
            },
            classes?.closeAction,
          )}
          color={actionButtonColor}
          onClick={onClose}
          size="md"
          type="button"
          variant="text"
        >
          <CloseIcon className="bs-fabrique-alert__actions__close-icon" />
        </IconButton>
      </div>
    </div>
  );
};

export const AlertStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Alert>>()(Alert);

export default React.memo(Alert);
