import React from 'react';
import classNames from 'classnames';
import type { BigIconVariantType } from './types';
import { BigIconEnum } from './constants';
import {
  AlertTriangle,
  CheckCircleBroken,
  Clock,
  InfoCircle,
  XCircle,
} from '#components/untitledui';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

type Props = { variant: BigIconVariantType; id?: string };

const variantClassMapping = {
  [BigIconEnum.SUCCESS]: {
    Icon: CheckCircleBroken,
    className: 'bs-fabrique-big-icon--success',
  },
  [BigIconEnum.INFO]: {
    Icon: InfoCircle,
    className: 'bs-fabrique-big-icon--info',
  },
  [BigIconEnum.WARNING]: {
    Icon: AlertTriangle,
    className: 'bs-fabrique-big-icon--warning',
  },
  [BigIconEnum.ERROR]: {
    Icon: XCircle,
    className: 'bs-fabrique-big-icon--error',
  },
  [BigIconEnum.GREY]: {
    Icon: Clock,
    className: 'bs-fabrique-big-icon--grey',
  },
};

const BigIcon: React.FC<Props> = ({ variant, id }) => {
  const { Icon, className } = variantClassMapping[variant];
  return (
    <span
      className={classNames('bs-fabrique-big-icon__root', className)}
      id={id}
    >
      <Icon className="bs-fabrique-big-icon--size" stroke="currentColor" />
    </span>
  );
};

export const BigIconStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof BigIcon>>()(BigIcon);

export default React.memo(BigIcon);
