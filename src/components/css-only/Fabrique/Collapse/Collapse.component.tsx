import React, { memo } from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  classes?: { content?: string };
  isExpanded: boolean;
  children: React.ReactElement | React.ReactNode | React.ReactNode[];
  collapsedHeight?: number;
};
export const Collapse: React.FC<Props> = ({
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
    <div ref={collapseRef} className="bs-collapse">
      <div
        ref={contentRef}
        className={classNames('bs-content', classes?.content)}
      >
        {children}
      </div>
    </div>
  );
};

export const CollapseForStorybook = marketplaceCssHoc()(Collapse);

export default memo(Collapse);
