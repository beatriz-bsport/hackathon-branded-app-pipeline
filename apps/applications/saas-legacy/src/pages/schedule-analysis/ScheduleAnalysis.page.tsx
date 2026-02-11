import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import { getAuth } from '../../http';
import Config from '../../config';
import { appendSigmaLocale } from '../../utils/sigma';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

const useStyles = makeStyles((_theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  iframeContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
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

interface ScheduleAnalysisResponse {
  presigned_url?: string;
  embed_url?: string;
}

const ScheduleAnalysis: React.FC = () => {
  const isScheduleAnalysisEnabled = useSafeFlag(FeatureFlags.SCHEDULE_ANALYSIS);

  // Redirect to dashboard if feature flag is disabled
  if (!isScheduleAnalysisEnabled) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <ObjectLevelPermissionProvider requiredPermission="report.Bookings.bookings.allowed_actions.read">
      {(hasPermission: boolean) => {
        if (!hasPermission) {
          return <Redirect to="/dashboard" />;
        }
        return <ScheduleAnalysisContent />;
      }}
    </ObjectLevelPermissionProvider>
  );
};

const ScheduleAnalysisContent: React.FC = () => {
  const { i18n } = useTranslation();
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleAnalysisUrl = async () => {
      try {
        let response;
        let data: ScheduleAnalysisResponse;
        response = await getAuth<ScheduleAnalysisResponse>(
          `${API_V1_URI}/embedded_analytics/presigned_url/?dashboard_type=schedule_analysis`,
        );
        data = response.data as ScheduleAnalysisResponse;
        if (data.presigned_url) {
          setIframeUrl(appendSigmaLocale(data.presigned_url, i18n.language));
        } else {
          setError('Unable to load dashboard. Please refresh the page.');
        }
      } catch (err) {
        console.error('Error fetching schedule analysis dashboard:', err);
        setError('Failed to load dashboard. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleAnalysisUrl();
  }, [i18n.language]);

  const title = 'Schedule Analysis';

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

export default ScheduleAnalysis;
