import React, { useState, useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getAuth } from '../../http';
import Config from '../../config';

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
}));

const API_V1_URI = Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1;

interface SubscriptionEventsResponse {
  presigned_url?: string;
  embed_url?: string;
}

interface Props extends WithTranslation {
  biTool: 'omni' | 'sigma';
}

const SubscriptionEvents: React.FC<Props> = ({ t: _t, biTool }) => {
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubscriptionEventsUrl = async () => {
      try {
        let response;
        let data: SubscriptionEventsResponse;

        if (biTool === 'omni') {
          response = await getAuth<SubscriptionEventsResponse>(
            `${API_V1_URI}/embedded_analytics/presigned_url/?dashboard_type=subscription_events`,
          );
          data = response.data as SubscriptionEventsResponse;
          if (data.presigned_url) {
            setIframeUrl(data.presigned_url);
          }
        } else {
          response = await getAuth<SubscriptionEventsResponse>(
            `${API_V1_URI}/embedded_analytics/presigned_url?provider=sigma&dashboard_type=subscription_events`,
          );
          data = response.data as SubscriptionEventsResponse;
          if (data.embed_url) {
            setIframeUrl(data.embed_url);
          }
        }
      } catch (error) {
        console.error('Failed to fetch subscription events URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionEventsUrl();
  }, [biTool]);

  const title = `Subscription Events (${biTool.toUpperCase()})`;

  return (
    <Box className={classes.root}>
      <Box className={classes.iframeContainer}>
        {loading ? (
          <Box className={classes.loading}>
            <CircularProgress />
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

export default withTranslation(['subscription-events'])(SubscriptionEvents);
