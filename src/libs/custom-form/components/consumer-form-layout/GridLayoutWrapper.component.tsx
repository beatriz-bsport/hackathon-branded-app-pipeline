import React from 'react';
import { useTheme } from '@material-ui/core';

import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import './react-grid-layout.css';
import type { Layout, ResponsiveLayouts } from '../../types';
import customWithProvider from './customwidthProvider';
import { MuiThemeToCssVarsHOC } from '#hocs/marketplace-css.hoc';

const ResponsiveGridLayout = customWithProvider(Responsive);
const ROW_HEIGHT_FOR_CSS_ONLY_FIELD = 85;
const ROW_HEIGHT_FOR_MUI_FIELD = 50;

type Props = {
  children: React.ReactNode;
  isEditing?: boolean;
  layouts?: { [key: string]: Array<Layout> };
  onLayoutChange?: (l: Array<Layout>, allLayouts: ResponsiveLayouts) => void;
  customProviderWidth?: number;
  isCssVariantActivated?: boolean;
};

type GridLayoutWrapperProps = Props & { shouldWrapLayerInCssHoc?: boolean };

const ResponsiveGridLayoutWrapper: React.FC<Props> = ({
  children,
  isEditing,
  layouts,
  onLayoutChange,
  customProviderWidth,
  isCssVariantActivated,
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
        compactType="horizontal"
        customProviderWidth={customProviderWidth}
        isDraggable={isEditing || false}
        isResizable={isEditing || false}
        layouts={layouts}
        onLayoutChange={handleOnLayoutChange}
        resizeHandles={['s', 'n', 'se']}
        rowHeight={
          isCssVariantActivated
            ? ROW_HEIGHT_FOR_CSS_ONLY_FIELD
            : ROW_HEIGHT_FOR_MUI_FIELD
        }
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
