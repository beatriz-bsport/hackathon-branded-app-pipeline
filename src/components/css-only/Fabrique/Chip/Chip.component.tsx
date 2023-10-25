import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import { TypographyVariant } from '#Fabrique/Typography/constants';
import IconButton from '#Fabrique/IconButton';
import { ChipColorEnum, ChipSizeEnum, ChipVariantEnum } from './constants';
import type { ChipColor, ChipSize, ChipVariant } from '.';

import './styles.css';

type Props = {
  variant?: ChipVariant;
  size?: ChipSize;
  color?: ChipColor;
  className?: string;
  classes?: {
    icon?: string;
    content?: string;
    action?: string;
  };
  leftIcon?: React.ReactNode;
  isDisabled?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
};

const ChipBackgroundClassNameMap = {
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.MAIN}`]:
    'bs-fabrique-chip--strong-main',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.GREY}`]:
    'bs-fabrique-chip--strong-grey',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.INFO}`]:
    'bs-fabrique-chip--strong-info',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.SUCCESS}`]:
    'bs-fabrique-chip--strong-success',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.WARNING}`]:
    'bs-fabrique-chip--strong-warning',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.ERROR}`]:
    'bs-fabrique-chip--strong-error',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.MAIN}`]:
    'bs-fabrique-chip--weak-main',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.GREY}`]:
    'bs-fabrique-chip--weak-grey',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.INFO}`]:
    'bs-fabrique-chip--weak-info',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.SUCCESS}`]:
    'bs-fabrique-chip--weak-success',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.WARNING}`]:
    'bs-fabrique-chip--weak-warning',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.ERROR}`]:
    'bs-fabrique-chip--weak-error',
};

const ChipActionClassNameMap = {
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.MAIN}`]:
    'bs-fabrique-chip__action-strong-main',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.GREY}`]:
    'bs-fabrique-chip__action-strong-grey',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.INFO}`]:
    'bs-fabrique-chip__action-strong-info',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.SUCCESS}`]:
    'bs-fabrique-chip__action-strong-success',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.WARNING}`]:
    'bs-fabrique-chip__action-strong-warning',
  [`${ChipVariantEnum.STRONG}-${ChipColorEnum.ERROR}`]:
    'bs-fabrique-chip__action-strong-error',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.MAIN}`]:
    'bs-fabrique-chip__action-weak-main',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.GREY}`]:
    'bs-fabrique-chip__action-weak-grey',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.INFO}`]:
    'bs-fabrique-chip__action-weak-info',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.SUCCESS}`]:
    'bs-fabrique-chip__action-weak-success',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.WARNING}`]:
    'bs-fabrique-chip__action-weak-warning',
  [`${ChipVariantEnum.WEAK}-${ChipColorEnum.ERROR}`]:
    'bs-fabrique-chip__action-weak-error',
};

const ChipSizeClassNameMap = {
  sm: 'bs-fabrique-chip--sm',
  lg: 'bs-fabrique-chip--lg',
};

const ChipIconSizeClassNameMap = {
  sm: 'bs-fabrique-chip__icon--sm',
  lg: 'bs-fabrique-chip__icon--lg',
};

const ChipSizeTypographyVariant = {
  sm: TypographyVariant.BODY_XS,
  lg: TypographyVariant.BODY_SM,
};

/** TODO: REMOVE THIS TEMP ICON AND REPLACE FROM LIB */
const CloseIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="10"
    viewBox="0 0 10 10"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M0.528514 0.528575C0.788864 0.268226 1.21097 0.268226 1.47132 0.528575L4.99992 4.05717L8.52851 0.528575C8.78886 0.268226 9.21097 0.268226 9.47132 0.528575C9.73167 0.788925 9.73167 1.21103 9.47132 1.47138L5.94273 4.99998L9.47132 8.52858C9.73167 8.78893 9.73167 9.21103 9.47132 9.47138C9.21097 9.73173 8.78886 9.73173 8.52851 9.47138L4.99992 5.94279L1.47132 9.47138C1.21097 9.73173 0.788864 9.73173 0.528514 9.47138C0.268165 9.21103 0.268165 8.78893 0.528514 8.52858L4.05711 4.99998L0.528514 1.47138C0.268165 1.21103 0.268165 0.788925 0.528514 0.528575Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const Chip: React.FC<Props> = ({
  variant = ChipVariantEnum.STRONG,
  size = ChipSizeEnum.LG,
  color = ChipColorEnum.MAIN,
  className,
  classes,
  leftIcon,
  isDisabled,
  children,
  onClose,
}) => {
  const backgroundClassName = ChipBackgroundClassNameMap[`${variant}-${color}`];
  const actionClassName = ChipActionClassNameMap[`${variant}-${color}`];
  const sizeClassName = ChipSizeClassNameMap[size];
  const iconSizeClassName = ChipIconSizeClassNameMap[size];
  const typographyVariant = ChipSizeTypographyVariant[size];

  return (
    <div
      className={classNames(
        'bs-fabrique-chip__root',
        backgroundClassName,
        sizeClassName,
        {
          'bs-fabrique-chip__root--disabled': isDisabled,
        },
        className,
      )}
    >
      <div
        className={classNames(
          'bs-fabrique-chip__icon',
          iconSizeClassName,
          {
            'bs-fabrique-chip__icon--disabled': isDisabled,
            'bs-fabrique-chip__icon--hidden': !leftIcon,
          },
          classes?.icon,
        )}
      >
        {leftIcon}
      </div>

      <Typography
        className={classNames(
          'bs-fabrique-chip__content',
          {
            'bs-fabrique-chip__content--disabled': isDisabled,
          },
          classes?.content,
        )}
        variant={typographyVariant}
      >
        {children}
      </Typography>

      <div
        className={classNames('bs-fabrique-chip__action-container', {
          'bs-fabrique-chip__action-container--hidden': !onClose,
        })}
      >
        <IconButton
          className={classNames(
            'bs-fabrique-chip__action',
            {
              'bs-fabrique-chip__action--disabled': isDisabled,
            },
            actionClassName,
            classes?.action,
          )}
          color="white"
          isDisabled={isDisabled}
          onClick={!isDisabled && onClose}
          size="sm"
          variant="text"
        >
          <CloseIcon className="bs-fabrique-chip__action-icon" />
        </IconButton>
      </div>
    </div>
  );
};

export const ChipStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Chip>>()(Chip);

export default React.memo(Chip);
