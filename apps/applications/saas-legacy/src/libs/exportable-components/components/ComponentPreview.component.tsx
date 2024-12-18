import React, { useLayoutEffect, useState } from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { CompanyTheme } from '#src/libs/theme/types';
import { CssComponentsVariantIdentifiersValues } from '#src/libs/exportable-components/types';
import VariationConfigurationWrapper from './VariationConfigurationWrapper.component';

type Props = {
  component: (
    props: any,
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  componentId: CssComponentsVariantIdentifiersValues;
  theme: CompanyTheme;
  defaultState: any;
};

// Tricking typing
const EmptyDiv: React.FC<any> = () => {
  return <div />;
};

const ComponentPreview: React.FC<
  Props & {
    pageHeight: number;
  }
> = ({ component, pageHeight, defaultState, theme, componentId }) => {
  const classes = useStyles();
  const [state, setState] = useState(defaultState);
  const Component = component ?? EmptyDiv;

  useLayoutEffect(() => {
    setState(defaultState);
  }, [componentId, defaultState]);

  const handleSetState = React.useCallback(
    (key: string) => (value: any) => {
      setState({
        ...state,
        [key]: value,
      });
    },
    [state],
  );

  return (
    <div
      className={classes.previewWrapper}
      style={{
        maxHeight: pageHeight,
      }}
    >
      <VariationConfigurationWrapper componentId={componentId}>
        <Component setState={handleSetState} state={state} theme={theme} />
      </VariationConfigurationWrapper>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  previewWrapper: {
    position: 'relative',
    minHeight: '1000px',
    padding: '16px',
    overflowY: 'auto',
    flexDirection: 'column',
    flex: 1,
  },
}));

export default compose<any, Props>(
  React.memo,
  marketplaceCssHoc(),
)(ComponentPreview);
