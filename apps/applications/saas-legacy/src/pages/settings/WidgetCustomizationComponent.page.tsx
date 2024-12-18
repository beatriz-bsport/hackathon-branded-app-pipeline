import React, { useCallback, useEffect, useState } from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';

import CssEditorForm from '#src/libs/exportable-components/components/CssEditorForm.component';
import { cleanCSSFile } from '#src/libs/widget/utils';
import CssEditorPreview from '#src/libs/exportable-components/components/CssEditorPreview.component';
import { getCssComponentByLabel } from '#src/libs/exportable-components/utils';
import CssEditorSelector from '#src/libs/exportable-components/components/CssEditorSelector.component';
import {
  CssComponentsVariantIdentifiersValues,
  MarketplacePage,
} from '#src/libs/exportable-components/types';
import {
  resetCssWidgetConfiguration as resetCssWidgetConfigurationAction,
  retrieveManagerCssConfiguration as retrieveManagerCssConfigurationAction,
  saveCssConfiguration as saveCssConfigurationAction,
} from '#src/libs/exportable-components/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { getCustomCssConfiguration } from '#src/libs/exportable-components/selectors';
import ApplyCustomTheme from '#src/libs/exportable-components/ApplyCustomTheme.component';
import { RootState } from '../../reducers';

type Props = ConnectedProps<typeof connector> & {
  componentId: CssComponentsVariantIdentifiersValues;
  page: MarketplacePage;
};

export const WidgetCustomizationComponent: React.FC<Props> = ({
  componentId,
  page,
  theme,
  cssConfig,
  retrieveManagerCssConfiguration,
  resetCssWidgetConfiguration,
  saveCssConfiguration,
  push,
}) => {
  const classes = useStyles();

  const [code, setCode] = useState(getCssComponentByLabel(componentId)?.css);

  useEffect(() => {
    retrieveManagerCssConfiguration({
      onSuccess: (_cssConfig) => {
        if (_cssConfig?.components_css?.[componentId]) {
          setCode(_cssConfig?.components_css?.[componentId]);
        }
      },
    });
  }, [retrieveManagerCssConfiguration, setCode, componentId]);

  useEffect(() => {
    setCode(cleanCSSFile(getCssComponentByLabel(componentId)?.css));
  }, [componentId]);

  const handleNav = useCallback(
    (_page: MarketplacePage, _componentId: string) => {
      push(`/settings/widget/customize-css/${_page}/${_componentId}`);
    },
    [push],
  );

  const handleSubmit = useCallback(() => {
    saveCssConfiguration(cssConfig.id, {
      ...cssConfig.components_css,
      [componentId]: code,
    });
  }, [
    code,
    componentId,
    cssConfig.components_css,
    cssConfig.id,
    saveCssConfiguration,
  ]);

  const handleRestConfig = useCallback(() => {
    resetCssWidgetConfiguration({
      onSuccess: () => {
        setCode(cleanCSSFile(getCssComponentByLabel(componentId)?.css));
      },
    });
  }, [componentId, resetCssWidgetConfiguration]);

  return (
    <div className={classes.container}>
      <CssEditorSelector
        componentId={componentId}
        onSelect={handleNav}
        page={page}
        resetAll={handleRestConfig}
      />

      <div className={classes.wrapper}>
        <ApplyCustomTheme styles={theme.widget_theme} />

        <CssEditorForm
          code={code}
          componentId={componentId}
          onCodeChange={setCode}
          onSave={handleSubmit}
          savedCss={cssConfig?.components_css?.[componentId] ?? ''}
        />
        <CssEditorPreview
          code={code}
          componentId={componentId}
          customConfiguration={cssConfig}
          theme={theme}
        />
      </div>
      {/* Here applying our currently editing style to component */}
      <style>{code}</style>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  cssConfig: getCustomCssConfiguration(state),
});

const mapDispatchToProps = {
  push: pushRouter,
  retrieveManagerCssConfiguration: retrieveManagerCssConfigurationAction,
  resetCssWidgetConfiguration: resetCssWidgetConfigurationAction,
  saveCssConfiguration: saveCssConfigurationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any, {}>(
  routerParamsToProps({
    componentId: 'componentId:string',
    page: 'page:string',
  }),
  connector,
)(WidgetCustomizationComponent);
