import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';

import VisibilityIcon from '@material-ui/icons/Visibility';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { CompanyTheme } from '#libs/theme/types';
import { getCssComponentByLabel } from '../utils';
import ApplyCustomCssStyles from '#libs/widget/components/ApplyCustomCssStyles.component';
import { MarketplaceCSSConfiguration } from '../types';
import ComponentPreview from './ComponentPreview.component';
import { CSS_COMPONENTS_BY_ID } from '../constants';

const CssEditorPreview: React.FC<{
  code: string;
  theme: CompanyTheme;
  customConfiguration: MarketplaceCSSConfiguration;
  componentId: string;
}> = ({ code, theme, componentId, customConfiguration }) => {
  const classes = useStyles();
  const { t } = useTranslation('widget');

  const config = useMemo(
    () => getCssComponentByLabel(componentId),
    [componentId],
  );

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          <VisibilityIcon className={classes.icon} />
          {t('widget.customCss.preview', {
            name: t(`widget.components.${componentId}`),
          })}
        </Typography>
        <div className={classes.chips}>
          {config.pages.map((page) => (
            <div className={classes.chip} key={page}>
              {t(`widget.page.${page}`)}
            </div>
          ))}
        </div>
        <ComponentPreview
          componentId={componentId}
          component={CSS_COMPONENTS_BY_ID[componentId]}
          defaultState={config.defaultState}
          theme={theme}
        />
        <ApplyCustomCssStyles
          customConfiguration={omit(customConfiguration, componentId)}
        />
        <style>{code}</style>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: theme.palette.grey[600],
  },
  paper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    height: '100%',
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

export default CssEditorPreview;
