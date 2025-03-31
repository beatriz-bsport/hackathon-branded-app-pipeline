import React, { memo } from 'react';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  classes?: { content?: string; container?: string };
  isExpanded: boolean;
  children: React.ReactElement | React.ReactNode | React.ReactNode[];
  collapsedHeight?: number;
};
export const ShowMore: React.FC<Props> = ({
  classes,
  isExpanded,
  children,
  collapsedHeight,
}) => {
  const collapseRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // To prevent the transition from occurring as soon as the component mounts,
    // we incorporate it with a 250ms delay for proper execution.
    const transitionClassTimeout = setTimeout(() => {
      collapseRef.current?.classList?.add('bs-collapse-transition');
    }, 250);
    if (contentRef.current && collapseRef.current) {
      if (isExpanded) {
        collapseRef.current.style.setProperty(
          'height',
          `${contentRef.current.scrollHeight}px`,
          'important',
        );
      } else {
        collapseRef?.current?.style.setProperty(
          'height',
          `${collapsedHeight}px`,
          'important',
        );
      }
    }
    return () => {
      clearTimeout(transitionClassTimeout);
    };
  }, [children, isExpanded, collapsedHeight]);

  return (
    <div ref={collapseRef} className={clsx('bs-collapse', classes?.container)}>
      <div ref={contentRef} className={clsx('bs-content', classes?.content)}>
        {children}
      </div>
    </div>
  );
};

export const ShowMoreForStorybook = marketplaceCssHoc()(ShowMore);

export default memo(ShowMore);
