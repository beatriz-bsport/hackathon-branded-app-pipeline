import React, { useLayoutEffect, useState } from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { CompanyTheme } from '#libs/theme/types';
import VariationConfigurationWrapper from './VariationConfigurationWrapper.component';

import { CSSComponentsById } from '#libs/exportable-components/types';

type Props = {
  component: (
    props: any,
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  componentId: CSSComponentsById;
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
      style={{
        position: 'relative',
        height: '1000px',
        maxHeight: pageHeight,
      }}
      className={classes.previewWrapper}
    >
      <VariationConfigurationWrapper componentId={componentId}>
        <Component theme={theme} state={state} setState={handleSetState} />
      </VariationConfigurationWrapper>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  previewWrapper: {
    overflowY: 'auto',
    flexDirection: 'column',
    flex: 1,
  },
}));

export default compose<any, Props>(
  React.memo,
  marketplaceCssHoc(),
)(ComponentPreview);
