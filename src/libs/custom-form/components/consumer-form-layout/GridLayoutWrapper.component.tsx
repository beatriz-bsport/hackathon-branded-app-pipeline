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
  // We need to check both that the layout exists and if there are at least 4 breakpoints defined (otherwise
  // things are not going to work properly)
  if (!props.layouts || Object.keys(props.layouts)?.length !== 4) {
    return <>{props.children}</>;
  }
  return (
    <div className={props.isEditing ? 'isEditing' : null}>
      <ResponsiveGridLayout
        isDraggable={props.isEditing || false}
        isResizable={props.isEditing || false}
        className="layout"
        breakpoints={{
          lg: theme.breakpoints.values.lg,
          md: theme.breakpoints.values.md,
          sm: theme.breakpoints.values.sm,
          xs: 375,
        }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
        layouts={props.layouts}
        onLayoutChange={(l: Array<Layout>, allLayouts: ResponsiveLayouts) => {
          props.onLayoutChange && props.onLayoutChange(l, allLayouts);
        }}
        rowHeight={50}
        resizeHandles={['s', 'n', 'se']}
        customProviderWidth={props.customProviderWidth}
      >
        {props.children}
      </ResponsiveGridLayout>
    </div>
  );
};

export default GridLayoutWrapper;
