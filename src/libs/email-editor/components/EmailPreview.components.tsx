import React from 'react';

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

export type OwnProps = {
  title: string;
  html?: string;
  loading: boolean;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const EmailPreview = (props: Props) => {
  const { title, loading, html, classes, t } = props;
  const sanitizedHTML = html?.replace(
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    '',
  );

  return (
    <>
      <Typography className={classes.emptyTitle} variant="h5">
        {title}
      </Typography>
      {!html && !loading && (
        <div className={classes.previewEmpty}>
          <InfoIcon fontSize="large" color="disabled" />
          <Typography
            className={classes.emptyMessageText}
            color="textSecondary"
          >
            {t('emails.emptyStateDescription')}
          </Typography>
        </div>
      )}
      {loading && <CircularProgress />}
      <Paper>
        <div
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{
            __html: sanitizedHTML,
          }}
        />
      </Paper>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
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
  });

export default compose<any, OwnProps>(
  withTranslation(['franchise']),
  withStyles(styles),
)(EmailPreview);
