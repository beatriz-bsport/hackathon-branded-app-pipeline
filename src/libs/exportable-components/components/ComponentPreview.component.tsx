import React, { useLayoutEffect, useState } from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';

import withPageHeightHOC from '#hocs/with-page-height.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { CompanyTheme } from '#libs/theme/types';
import VariationConfigurationWrapper from './VariationConfigurationWrapper.component';

type Props = {
  component: (
    props: any,
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  componentId: string;
  theme: CompanyTheme;
  defaultState: any;
};
const ComponentPreview: React.FC<
  Props & {
    pageHeight: number;
  }
> = ({ component, pageHeight, defaultState, theme, componentId }) => {
  const classes = useStyles();
  const [state, setState] = useState(defaultState);
  const Component = component ?? 'div';

  useLayoutEffect(() => {
    setState(defaultState);
  }, [componentId, defaultState]);

  const handleSetState = (key: string) => (value: any) => {
    setState({
      ...state,
      [key]: value,
    });
  };
  return (
    <div
      style={{
        height: pageHeight,
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
  // withPageHeightHOC(),
  marketplaceCssHoc(),
)(ComponentPreview);
