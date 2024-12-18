import React, { useMemo } from 'react';
import {
  CircularProgress,
  createStyles,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
import { replaceGenericTagsInTemplate } from '#src/libs/email-editor/utils';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';

export type OwnProps = {
  html: string;
  loading?: boolean;
  resolvedGenericTags?: ResolvedGenericTags;
};

type Props = OwnProps;

const EmailPreview: React.FC<Props> = (props: Props) => {
  const { loading, html } = props;

  const classes = useStyles();

  const sanitizedHTML = html.replace(
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    '',
  );

  const contentPreview = useMemo(
    () =>
      replaceGenericTagsInTemplate(props.resolvedGenericTags, sanitizedHTML),
    [props.resolvedGenericTags, sanitizedHTML],
  );

  return (
    <div className={classes.container}>
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <Paper className={classes.iframeContainer}>
          <iframe
            className={classes.iframe}
            srcDoc={contentPreview}
            title="generic-email-preview-iframe"
          />
        </Paper>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
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
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    iframe: {
      width: '100%',
      height: '40vh',
      border: 'none',
    },
    iframeContainer: {
      height: '100%',
      overflow: 'hidden',
    },
  }),
);

export default React.memo(EmailPreview);
