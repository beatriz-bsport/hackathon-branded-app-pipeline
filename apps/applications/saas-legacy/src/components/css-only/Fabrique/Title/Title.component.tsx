import React from 'react';
import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import Collapse from '#Fabrique/Collapse';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import { ChevronDown } from '#src/components/untitledui';
import { TitleSize } from './constants';
import type { TitleMapType, TitleVariantType } from './types';

import './styles.css';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  id?: number;
  variant: TitleVariantType;
  isCollapsable?: boolean;
  title: string;
  subtitle?: string;
  childrenCollapsable?: React.ReactNode;
  className?: string;
  classes?: {
    title?: string;
    subTitle?: string;
  };
};

const TitleVariantClassNameMap: {
  [variant in TitleVariantType]: TitleMapType;
} = {
  [TitleSize.LG]: {
    arrowClassName: 'bs-fabrique-title__arrow--md',
    titleClassName: 'title-lg',
    subtitleClassName: 'body-lg',
  },
  [TitleSize.MD]: {
    arrowClassName: 'bs-fabrique-title__arrow--md',
    titleClassName: 'title-md',
    subtitleClassName: 'body-md',
  },
  [TitleSize.SM]: {
    arrowClassName: 'bs-fabrique-title__arrow--sm',
    titleClassName: 'title-sm',
    subtitleClassName: 'body-md',
  },
  [TitleSize.XS]: {
    arrowClassName: 'bs-fabrique-title__arrow--sm',
    titleClassName: 'body-lg',
    subtitleClassName: 'body-sm',
  },
};

const Title: React.FC<Props> = ({
  variant,
  isCollapsable,
  title,
  subtitle,
  childrenCollapsable,
  className,
  classes,
}) => {
  const { arrowClassName, titleClassName, subtitleClassName } =
    TitleVariantClassNameMap[variant];

  const [isExpanded, setIsExpanded] = React.useState(false);

  const onClickExpand = React.useCallback(
    () => setIsExpanded((prevState) => !prevState),
    [],
  );
  if (isCollapsable) {
    const collapseClasses = {
      content: 'bs-fabrique-title__collapse-content',
      container: 'bs-fabrique-title__collapse-container',
    };
    return (
      <div className="bs-fabrique-title__root">
        <ButtonBase
          className="bs-fabrique-title__button-base"
          onClick={onClickExpand}
        >
          <div className="bs-fabrique-title__title-wrapper">
            <Typography
              className={clsx('bs-fabrique-title__title')}
              variant={titleClassName}
            >
              {title}
            </Typography>
            <Typography
              className={clsx('bs-fabrique-title__subtitle')}
              variant={subtitleClassName}
            >
              {subtitle}
            </Typography>
          </div>
          <ChevronDown
            className={clsx(arrowClassName, {
              'bs-fabrique-title__arrow--rotate': isExpanded,
            })}
          />
        </ButtonBase>
        <Collapse
          classes={collapseClasses}
          collapsedHeight={0}
          isExpanded={isExpanded}
        >
          {childrenCollapsable}
        </Collapse>
      </div>
    );
  }

  return (
    <div className={clsx('bs-fabrique-title__root', className)}>
      <Typography
        className={clsx('bs-fabrique-title__title', classes?.title)}
        variant={titleClassName}
      >
        {title}
      </Typography>
      <Typography
        className={clsx('bs-fabrique-title__subtitle', classes?.subTitle)}
        variant={subtitleClassName}
      >
        {subtitle}
      </Typography>
    </div>
  );
};

export const TitleStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Title>>()(Title);

export default React.memo(Title);
