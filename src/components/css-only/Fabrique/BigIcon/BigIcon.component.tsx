import React from 'react';
import classNames from 'classnames';
import type { SVGComponentProps } from '#components/untitledui/template';
import {
  AlertTriangle,
  CheckCircleBroken,
  Clock,
  InfoCircle,
  XCircle,
} from '#components/untitledui';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { BigIconEnum } from './constants';
import type { BigIconVariantType } from './types';

import './styles.css';

type Props = {
  variant: BigIconVariantType;
  id?: string;
  IconComponent?: React.FC<SVGComponentProps>;
};

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

const BigIcon: React.FC<Props> = ({ variant, id, IconComponent }) => {
  const { Icon, className } = variantClassMapping[variant];

  const IconDisplay = IconComponent ?? Icon;
  return (
    <span
      className={classNames('bs-fabrique-big-icon__root', className)}
      id={id}
    >
      <IconDisplay
        className="bs-fabrique-big-icon--size"
        stroke="currentColor"
      />
    </span>
  );
};

export const BigIconStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof BigIcon>>()(BigIcon);

export default React.memo(BigIcon);
