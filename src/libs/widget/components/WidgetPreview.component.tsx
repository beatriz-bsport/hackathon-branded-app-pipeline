import React from 'react';

import Paper from '@material-ui/core/Paper';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type Props = {
  error: Error | null;
  codeStringPreview: string;
};

export const WidgetPreview = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['widget']);
  return (
    <div className={classes.iframeContainer}>
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
            title="preview"
            className={classes.iframe}
            srcDoc={props.codeStringPreview}
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
    flex: 1,
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      marginTop: 0,
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
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
