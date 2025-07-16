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

interface TrialAnalysisResponse {
  presigned_url?: string;
  embed_url?: string;
}

interface Props extends WithTranslation {
  biTool: 'omni' | 'sigma';
  level: 'franchise' | 'company';
}

const TrialAnalysis: React.FC<Props> = ({ t: _t, biTool, level }) => {
  const classes = useStyles();
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrialAnalysisUrl = async () => {
      try {
        let response;
        let data: TrialAnalysisResponse;

        if (biTool === 'omni') {
          response = await getAuth<TrialAnalysisResponse>(
            `${API_V1_URI}/embedded_analytics/presigned_url/?dashboard_type=trial_analysis_${level}`,
          );
          data = response.data as TrialAnalysisResponse;
          if (data.presigned_url) {
            setIframeUrl(data.presigned_url);
          }
        } else {
          response = await getAuth<TrialAnalysisResponse>(
            `${API_V1_URI}/embedded_analytics/presigned_url/?provider=sigma&dashboard_type=trial_analysis_franchise&company_level=${level}`,
          );
          data = response.data as TrialAnalysisResponse;
          if (data.embed_url) {
            setIframeUrl(data.embed_url);
          }
        }
      } catch (error) {
        console.error('Error fetching trial analysis dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialAnalysisUrl();
  }, [biTool, level]);

  const title = `Trial Analysis - ${
    level.charAt(0).toUpperCase() + level.slice(1)
  } (${biTool.toUpperCase()})`;

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

export default withTranslation(['trial-analysis'])(TrialAnalysis);
