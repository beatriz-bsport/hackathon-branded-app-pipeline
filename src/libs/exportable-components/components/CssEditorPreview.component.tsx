import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';

import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { CompanyTheme } from '#libs/theme/types';
import ApplyCustomCssStyles from '#libs/widget/components/ApplyCustomCssStyles.component';
import { CSS_COMPONENTS_BY_ID } from '#libs/exportable-components/custom_css_variants';
import { getCssComponentByLabel } from '../utils';
import {
  CssComponentsVariantIdentifiersValues,
  MarketplaceCSSConfiguration,
} from '../types';
import ComponentPreview from './ComponentPreview.component';

const CssEditorPreview: React.FC<{
  code: string;
  theme: CompanyTheme;
  customConfiguration: MarketplaceCSSConfiguration;
  componentId: CssComponentsVariantIdentifiersValues;
}> = ({ code, theme, componentId, customConfiguration }) => {
  const classes = useStyles();
  const { t } = useTranslation('widget');

  const config = useMemo(
    () => getCssComponentByLabel(componentId),
    [componentId],
  );

  return (
    <>
      <div className={classes.paper}>
        <Typography className={classes.title} variant="h6">
          <VisibilityIcon className={classes.icon} />
          {t('widget.customCss.preview', {
            name: t(`widget.components.${componentId}`),
          })}
        </Typography>
        <div className={classes.chips}>
          {config.pages.map((page) => (
            <div key={page} className={classes.chip}>
              {t(`widget.page.${page}`)}
            </div>
          ))}
        </div>
        <ComponentPreview
          component={CSS_COMPONENTS_BY_ID[componentId]}
          componentId={componentId}
          defaultState={config.defaultState}
          theme={theme}
        />
        <ApplyCustomCssStyles
          customConfiguration={omit(customConfiguration, componentId)}
        />
        <style>{code}</style>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: theme.palette.grey[600],
  },
  paper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    height: '100%',
    position: 'sticky',
    top: '0',
    maxWidth: '50%',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  chip: {
    backgroundColor: '#EAF4FC',
    color: theme.palette.info.dark,
    borderRadius: 4,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(1),
    color: theme.palette.info.dark,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default React.memo(CssEditorPreview);
