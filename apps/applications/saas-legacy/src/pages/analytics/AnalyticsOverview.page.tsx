import React, { useState, useEffect } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getAuth } from '../../http';
import Config from '../../config';

const useStyles = makeStyles((theme) => ({
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

interface AnalyticsResponse {
  presigned_url: string;
}

interface Props extends WithTranslation {}

const AnalyticsOverview: React.FC<Props> = ({ t }) => {
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalyticsUrl = async () => {
      console.log('fetching analytics url');
      try {
        const response = await getAuth<AnalyticsResponse>(
          `${API_V1_URI}/embedded_analytics/presigned_url/`,
        );
        console.log('data', response.data);
        setIframeUrl(response.data.presigned_url);
      } catch (error) {
        console.error('Failed to fetch analytics URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsUrl();
  }, []);

  return (
    <Box className={classes.root}>
      <Box className={classes.iframeContainer}>
        {loading ? (
          <Box className={classes.loading}>
            <CircularProgress />
          </Box>
        ) : (
          <iframe
            className={classes.iframe}
            src={iframeUrl}
            title="Analytics Dashboard"
            allowFullScreen
            loading="lazy"
          />
        )}
      </Box>
    </Box>
  );
};

export default withTranslation(['analytics'])(AnalyticsOverview);
