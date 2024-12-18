import React from 'react';

import Paper from '@material-ui/core/Paper';
import SettingsIcon from '@material-ui/icons/Settings';
import clx from 'classnames';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type Props = {
  error?: Error | null;
  codeStringPreview: string;
  customizationPreview: boolean;
};

export const WidgetPreview = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['widget']);
  return (
    <div
      className={clx(classes.iframeContainer, {
        [classes.iframeContainerCustomization]: props.customizationPreview,
      })}
    >
      <Paper className={classes.iframePaper} elevation={1}>
        {props.error ? (
          <div className={classes.previewErrorContainer}>
            <SettingsIcon fontSize="large" />
            <Typography variant="h5">
              {t('widget.widgetPreviewError')}
            </Typography>
          </div>
        ) : (
          <iframe
            className={classes.iframe}
            srcDoc={props.codeStringPreview}
            title="preview"
          />
        )}
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  previewErrorContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iframeContainer: {
    display: 'flex',
    height: '70vh',
    minWidth: '395px',
    minHeight: '800px',
    flex: 1,
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      marginTop: 0,
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
    },
  },
  iframeContainerCustomization: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  iframe: {
    display: 'flex',
    flex: 1,
    height: '100%',
    borderStyle: 'none',
  },
  iframePaper: {
    display: 'flex',
    flex: 1,
  },
}));

export default WidgetPreview;
