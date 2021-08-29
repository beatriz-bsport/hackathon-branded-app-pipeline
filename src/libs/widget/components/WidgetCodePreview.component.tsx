import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type Props = {
  codeString: string;
  error: Error | null;
  copyToClipboard: (str: string) => void;
};

export const WidgetCodePreview = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['widget']);
  return (
    <div>
      <Typography className={classes.marginTop}>
        {t('widget:widget.codeInfo')}
      </Typography>

      <Paper elevation={1} className={classes.codeContainer}>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.code}
        >
          {props.error
            ? t('widget:widget.widgetPreviewError')
            : props.codeString}
        </Typography>

        {!props.error && (
          <ButtonBase
            onClick={() => props.copyToClipboard(props.codeString)}
            className={classes.copyClipboardContainer}
          >
            <FileCopyIcon />
          </ButtonBase>
        )}
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
  codeContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    position: 'relative',
  },
  code: {
    whiteSpace: 'pre-wrap',
    paddingRight: theme.spacing(4),
  },
  copyClipboardContainer: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

export default WidgetCodePreview;
