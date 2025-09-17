import React, { useState, useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { getAuth } from '../../http';
import { appendSigmaLocale } from '../../utils/sigma';
import Config from '../../config';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

const useStyles = makeStyles((_theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  iframeContainer: {
    width: '100%',
    height: '100%',
    border: 'none',
    overflow: 'hidden',
    flex: 1,
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: _theme.spacing(2),
  },
}));

const API_V1_URI = Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1;

interface TrialAnalysisResponse {
  presigned_url?: string;
  embed_url?: string;
}

interface Props extends WithTranslation {}

const TrialAnalysis: React.FC<Props> = (props) => {
  return (
    <ObjectLevelPermissionProvider requiredPermission="report.Club.subscription.allowed_actions.read">
      {(hasPermission: boolean) => {
        if (!hasPermission) {
          return <Redirect to="/dashboard" />;
        }
        return <TrialAnalysisContent {...props} />;
      }}
    </ObjectLevelPermissionProvider>
  );
};

const TrialAnalysisContent: React.FC<Props> = ({ t: _t }) => {
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrialAnalysisUrl = async () => {
      try {
        let response;
        let data: TrialAnalysisResponse;
        response = await getAuth<TrialAnalysisResponse>(
          `${API_V1_URI}/embedded_analytics/presigned_url/?dashboard_type=trial_analysis`,
        );
        data = response.data as TrialAnalysisResponse;
        if (data.presigned_url) {
          setIframeUrl(appendSigmaLocale(data.presigned_url));
        } else {
          setError('Unable to load dashboard. Please refresh the page.');
        }
      } catch (err) {
        console.error('Error fetching trial analysis dashboard:', err);
        setError('Failed to load dashboard. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrialAnalysisUrl();
  }, []);

  const title = 'Trial Analysis';

  return (
    <Box className={classes.root}>
      <Box className={classes.iframeContainer}>
        {loading ? (
          <Box className={classes.loading}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className={classes.errorContainer}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <iframe
            allowFullScreen
            className={classes.iframe}
            loading="lazy"
            src={iframeUrl}
            title={title}
          />
        )}
      </Box>
    </Box>
  );
};

export default withTranslation(['trial-analysis'])(TrialAnalysis);
