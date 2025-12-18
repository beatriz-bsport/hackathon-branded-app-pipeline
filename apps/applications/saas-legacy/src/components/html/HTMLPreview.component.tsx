import DOMPurify from 'dompurify';
import React, { useMemo } from 'react';
import { compose } from 'recompose';
import {
  CircularProgress,
  createStyles,
  Paper,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import clsx from 'clsx';
import { replaceGenericTagsInTemplate } from '#src/libs/email-editor/utils';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';

export type OwnProps = {
  title?: string;
  html?: string;
  loading?: boolean;
  scrolling?: boolean;
  inDialog?: boolean;
  resolvedGenericTags?: ResolvedGenericTags;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const HTMLPreview = (props: Props) => {
  const { title, loading, html, classes, t } = props;
  const sanitizedHTML = DOMPurify.sanitize(html ?? '');

  const contentPreview = useMemo(
    () =>
      replaceGenericTagsInTemplate(props.resolvedGenericTags, sanitizedHTML),
    [props.resolvedGenericTags, sanitizedHTML],
  );

  return (
    <div className={classes.container}>
      {!!title && (
        <Typography className={classes.emptyTitle} variant="h5">
          {title}
        </Typography>
      )}
      {!sanitizedHTML && !loading && (
        <div className={classes.previewEmpty}>
          <InfoIcon color="disabled" fontSize="large" />
          <Typography
            className={classes.emptyMessageText}
            color="textSecondary"
          >
            {t('emails.emptyStateDescription')}
          </Typography>
        </div>
      )}
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      {!!sanitizedHTML && !loading && (
        <Paper
          className={clsx(classes.iframeContainer, {
            [classes.iframeFullHeight]: !props.inDialog,
            [classes.iframeDialogHeight]: props.inDialog,
          })}
        >
          <iframe
            className={classes.iframe}
            frameBorder="0"
            scrolling={props.scrolling ? 'yes' : 'no'}
            srcDoc={contentPreview}
            title="generic-email-preview-iframe"
          />
        </Paper>
      )}
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
    },
    loadingContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    previewEmpty: {
      borderRadius: theme.spacing(3),
      border: '1px solid grey',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(6),
    },
    emptyMessageText: {
      marginTop: theme.spacing(2),
    },
    emptyTitle: {
      marginBottom: theme.spacing(2),
    },
    iframe: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    iframeContainer: {
      padding: theme.spacing(0.5),
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    iframeFullHeight: {
      paddingBottom: '100%',
    },
    iframeDialogHeight: {
      paddingBottom: '75%',
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['franchise']),
  withStyles(styles),
)(HTMLPreview);
