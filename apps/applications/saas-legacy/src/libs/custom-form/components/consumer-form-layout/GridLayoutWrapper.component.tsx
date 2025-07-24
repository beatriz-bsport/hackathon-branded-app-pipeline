import React from 'react';
import { useTheme } from '@material-ui/core';

import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import './react-grid-layout.css';
import { MuiThemeToCssVarsHOC } from '#src/hocs/marketplace-css.hoc';
import type { Layout, ResponsiveLayouts } from '../../types';
import customWithProvider from './customwidthProvider';

const ResponsiveGridLayout = customWithProvider(Responsive);
const ROW_HEIGHT_FOR_CSS_ONLY_FIELD = 85;

type Props = {
  children: React.ReactNode;
  isEditing?: boolean;
  layouts?: { [key: string]: Array<Layout> };
  onLayoutChange?: (l: Array<Layout>, allLayouts: ResponsiveLayouts) => void;
  customProviderWidth?: number;
  measureBeforeMount?: boolean;
  rowHeight?: number;
};

type GridLayoutWrapperProps = Props & { shouldWrapLayerInCssHoc?: boolean };

const ResponsiveGridLayoutWrapper: React.FC<Props> = ({
  children,
  isEditing,
  layouts,
  onLayoutChange,
  customProviderWidth,
  measureBeforeMount,
  rowHeight,
}) => {
  const theme = useTheme();

  // https://github.com/react-grid-layout/react-grid-layout#react-hooks-performance
  const ResponsiveGridLayoutMemoized = React.useMemo(
    () => ResponsiveGridLayout,
    [],
  );

  const handleOnLayoutChange = React.useCallback(
    (_layouts: Array<Layout>, allLayouts: ResponsiveLayouts) => {
      onLayoutChange && onLayoutChange(_layouts, allLayouts);
    },
    [onLayoutChange],
  );

  const layoutRowHeight = React.useMemo(() => {
    return rowHeight ?? ROW_HEIGHT_FOR_CSS_ONLY_FIELD;
  }, [rowHeight]);
  // We need to check both that the layout exists and if there are at least 4 breakpoints defined (otherwise
  // things are not going to work properly)
  if (!layouts || Object.keys(layouts)?.length !== 4) {
    return <>{children}</>;
  }

  return (
    <div className={isEditing && 'isEditing'}>
      <ResponsiveGridLayoutMemoized
        breakpoints={{
          lg: theme.breakpoints.values.lg,
          md: theme.breakpoints.values.md,
          sm: theme.breakpoints.values.sm,
          xs: 375,
        }}
        className="layout"
        cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
        customProviderWidth={customProviderWidth}
        isDraggable={isEditing || false}
        isResizable={isEditing || false}
        layouts={layouts}
        measureBeforeMount={measureBeforeMount}
        onLayoutChange={handleOnLayoutChange}
        resizeHandles={['s', 'n', 'se']}
        rowHeight={layoutRowHeight}
      >
        {children}
      </ResponsiveGridLayoutMemoized>
    </div>
  );
};

const GridLayoutWrapper: React.FC<GridLayoutWrapperProps> = (props) => {
  if (props.shouldWrapLayerInCssHoc) {
    return (
      <MuiThemeToCssVarsHOC>
        <ResponsiveGridLayoutWrapper {...props} />
      </MuiThemeToCssVarsHOC>
    );
  }
  return <ResponsiveGridLayoutWrapper {...props} />;
};

export default GridLayoutWrapper;
