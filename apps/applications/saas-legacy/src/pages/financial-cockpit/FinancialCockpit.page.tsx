import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import { getAuth } from '#src/http';
import Config from '#src/config';
import { appendSigmaLocale } from '#src/utils/sigma';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { useSetupHandleSigmaEvents } from '#src/libs/insights/sigma/hooks/use-setup-handle-sigma-events';

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

interface FinancialCockpitResponse {
  presigned_url?: string;
  embed_url?: string;
}

const FinancialCockpit: React.FC = () => {
  const isFinancialCockpitEnabled = useSafeFlag(FeatureFlags.FINANCIAL_COCKPIT);

  if (!isFinancialCockpitEnabled) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <ObjectLevelPermissionProvider requiredPermission="report.Payments.invoices.allowed_actions.read">
      {(hasPermission: boolean) => {
        if (!hasPermission) {
          return <Redirect to="/dashboard" />;
        }
        return <FinancialCockpitContent />;
      }}
    </ObjectLevelPermissionProvider>
  );
};

const FinancialCockpitContent: React.FC = () => {
  const { i18n } = useTranslation();
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialCockpitUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAuth<FinancialCockpitResponse>(
          `${API_V1_URI}/embedded_analytics/presigned_url/?dashboard_type=financial_cockpit`,
        );
        const data = response.data as FinancialCockpitResponse;

        if (data.presigned_url) {
          setIframeUrl(appendSigmaLocale(data.presigned_url, i18n.language));
        } else {
          setError('Unable to load dashboard. Please refresh the page.');
        }
      } catch (err) {
        console.error('Error fetching financial cockpit dashboard:', err);
        setError('Failed to load dashboard. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialCockpitUrl();
  }, [i18n.language]);

  const title = 'Financial Cockpit';

  const iframeRef = useSetupHandleSigmaEvents();

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
            ref={iframeRef}
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

export default FinancialCockpit;
