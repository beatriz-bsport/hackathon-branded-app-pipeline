import React, { memo } from 'react';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  isExpanded: boolean;
  children: React.ReactElement | React.ReactNode | React.ReactNode[];
  collapsedHeight?: number;
};
export const Collapse: React.FC<Props> = ({
  isExpanded,
  children,
  collapsedHeight,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      setContentHeight(ref.current.scrollHeight);
    }
  }, [children]);

  return (
    <div
      className="bs-collapse"
      style={{
        height: isExpanded ? contentHeight : collapsedHeight ?? 0,
      }}
    >
      <div ref={ref} className="bs-content">
        {children}
      </div>
    </div>
  );
};

export const CollapseForStorybook = marketplaceCssHoc()(Collapse);

export default memo(Collapse);
