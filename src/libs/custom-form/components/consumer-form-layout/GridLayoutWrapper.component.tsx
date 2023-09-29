import React from 'react';
import { useTheme } from '@material-ui/core';

import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import './react-grid-layout.css';
import type { Layout, ResponsiveLayouts } from '../../types';
import customWithProvider from './customwidthProvider';

const ResponsiveGridLayout = customWithProvider(Responsive);
type OwnProps = {
  children: React.ReactNode;
  isEditing?: boolean;
  layouts?: { [key: string]: Array<Layout> };
  onLayoutChange?: (l: Array<Layout>, allLayouts: ResponsiveLayouts) => void;
  customProviderWidth?: number;
};
type Props = OwnProps;
export const GridLayoutWrapper = (props: Props) => {
  const theme = useTheme();

  // https://github.com/react-grid-layout/react-grid-layout#react-hooks-performance
  const ResponsiveGridLayoutMemoized = React.useMemo(
    () => ResponsiveGridLayout,
    [],
  );
  // We need to check both that the layout exists and if there are at least 4 breakpoints defined (otherwise
  // things are not going to work properly)
  if (!props.layouts || Object.keys(props.layouts)?.length !== 4) {
    return <>{props.children}</>;
  }

  return (
    <div className={props.isEditing ? 'isEditing' : null}>
      <ResponsiveGridLayoutMemoized
        breakpoints={{
          lg: theme.breakpoints.values.lg,
          md: theme.breakpoints.values.md,
          sm: theme.breakpoints.values.sm,
          xs: 375,
        }}
        className="layout"
        cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
        compactType="horizontal"
        customProviderWidth={props.customProviderWidth}
        isDraggable={props.isEditing || false}
        isResizable={props.isEditing || false}
        layouts={props.layouts}
        onLayoutChange={(l: Array<Layout>, allLayouts: ResponsiveLayouts) => {
          props.onLayoutChange && props.onLayoutChange(l, allLayouts);
        }}
        resizeHandles={['s', 'n', 'se']}
        rowHeight={50}
      >
        {props.children}
      </ResponsiveGridLayoutMemoized>
    </div>
  );
};

export default GridLayoutWrapper;
