import React from 'react';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import { TypographyVariant } from '#Fabrique/Typography/constants';
import IconButton from '#Fabrique/IconButton';
import { XClose } from '#src/components/untitledui';
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
  onClose?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
      className={clsx(
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
        className={clsx(
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
        className={clsx(
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
        className={clsx('bs-fabrique-chip__action-container', {
          'bs-fabrique-chip__action-container--hidden': !onClose,
        })}
      >
        <IconButton
          className={clsx(
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
          <XClose
            className="bs-fabrique-chip__action__icon"
            stroke="currentColor"
          />
        </IconButton>
      </div>
    </div>
  );
};

export const ChipStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Chip>>()(Chip);

export default React.memo(Chip);
