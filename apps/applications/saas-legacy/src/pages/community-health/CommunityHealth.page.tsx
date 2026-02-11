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
import { useSelector } from 'react-redux';
import { hasPremiumInsightsAccess } from '#src/pages/insights/utils/premium-insights';
import type { RootState } from '#src/reducers';
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

interface CommunityHealthResponse {
  presigned_url?: string;
  embed_url?: string;
}

const CommunityHealth: React.FC = () => {
  const isCommunityHealthEnabled = useSafeFlag(FeatureFlags.COMMUNITY_HEALTH);
  const featureList = useSelector(
    (state: RootState) => state.company.feature.data,
  );

  const hasPremiumInsights = hasPremiumInsightsAccess(featureList);

  // Redirect to dashboard if feature flag is disabled
  if (!isCommunityHealthEnabled || !hasPremiumInsights) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <ObjectLevelPermissionProvider requiredPermission="report.Club.members_purchase.allowed_actions.read">
      {(hasPermission: boolean) => {
        if (!hasPermission) {
          return <Redirect to="/dashboard" />;
        }
        return <CommunityHealthContent />;
      }}
    </ObjectLevelPermissionProvider>
  );
};

const CommunityHealthContent: React.FC = () => {
  const { i18n } = useTranslation();
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityHealthUrl = async () => {
      try {
        const response = await getAuth<CommunityHealthResponse>(
          `${API_V1_URI}/embedded_analytics/presigned_url/?dashboard_type=community_health`,
        );
        const data = response.data as CommunityHealthResponse;

        if (data.presigned_url) {
          setIframeUrl(appendSigmaLocale(data.presigned_url, i18n.language));
        } else {
          setError('Unable to load dashboard. Please refresh the page.');
        }
      } catch (err) {
        console.error('Error fetching community health dashboard:', err);
        setError('Failed to load dashboard. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityHealthUrl();
  }, [i18n.language]);

  const title = 'Community Health';

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

export default CommunityHealth;
