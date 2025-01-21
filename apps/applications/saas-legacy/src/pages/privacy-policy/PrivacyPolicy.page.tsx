import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { compose } from 'recompose';

import { Box, Typography } from '@material-ui/core/';
import makeStyles from '@material-ui/styles/makeStyles';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import PrivacyPolicyContent from '#src/pages/privacy-policy/PrivacyPolicyContent.md';
import { fetchCustomPrivacyPolicy } from '#src/libs/settings/api';

type Props = {
  customAppConfigurationId: number;
};

type PrivacyPolicyData = {
  app_name: string;
  company_name: string;
};

// Custom styles
const useStyles = makeStyles({
  root: {
    padding: '20px',
    paddingRight: '10%',
    paddingLeft: '10%',
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '100px',
    color: '#333',
  },

  remark: {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#008080',
  },

  highlightTeal: {
    color: '#008080',
  },
  section: {
    marginBottom: '20px',
  },
  list: {
    paddingLeft: '20px',
  },
});

// Function to fetch custom privacy policy data
const fetchCustomPrivacyPolicyData = async (
  customAppConfigurationId: number,
): Promise<PrivacyPolicyData> => {
  try {
    const response = await fetchCustomPrivacyPolicy(customAppConfigurationId);
    return response.data as PrivacyPolicyData;
  } catch (error) {
    console.error('Failed to fetch privacy policy:', error);
    throw error;
  }
};

const CustomPrivacyPolicy: React.FC<Props> = ({ customAppConfigurationId }) => {
  const classes = useStyles();

  // To update the markdown, modify then export as markdown this notion page
  // [https://www.notion.so/bright-shovel-41b/Privacy-policy-for-bsport-s-client-Company-Name-143137e4c64080fbb905e47e7270f23a]
  const [markdownContent, setMarkdownContent] = useState(``);
  const [companyName, setCompanyName] = useState('COMPANY NAME');
  const [appName, setAppName] = useState('APP NAME');

  // Function to fetch and set markdown content
  const fetchMarkdownContent = async () => {
    try {
      const response = await fetch(PrivacyPolicyContent);
      const text = await response.text();
      setMarkdownContent(text);
    } catch (error) {
      console.error('Error fetching the markdown content:', error);
    }
  };

  useEffect(() => {
    fetchMarkdownContent();
  }, []);

  // Fetch privacy policy data
  useEffect(() => {
    if (!customAppConfigurationId) {
      console.error('Invalid customAppConfiguration id');
      return;
    }

    const fetchPolicyData = async () => {
      try {
        const data = await fetchCustomPrivacyPolicyData(
          customAppConfigurationId,
        );
        setCompanyName(data.company_name || 'COMPANY NAME');
        setAppName(data.app_name || 'APP NAME');
        // GDA email is also available in the json response (can be null)
      } catch (error) {
        console.error('Error fetching the privacy policy:', error);
      }
    };

    fetchPolicyData();
  }, [customAppConfigurationId]);

  return (
    // privacy-policy-page is a custom class to override the hidden bullet points defined in index.scss.
    <Box className={clsx(classes.root, 'privacy-policy-page')}>
      <div className={classes.header}>
        <Typography variant="h2">Privacy policy</Typography>
        <Typography variant="h4">
          for <span className={classes.highlightTeal}>b</span>sport&apos;s
          client: {companyName}
        </Typography>
      </div>
      <Typography className={classes.remark} component="em" variant="body1">
        This privacy policy applies to {companyName} and its mobile application
        , {appName}.
      </Typography>

      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </Box>
  );
};

export default compose(
  routerParamsToProps({
    customAppConfigurationId: 'customAppConfigurationId:number',
  }),
)(CustomPrivacyPolicy);
