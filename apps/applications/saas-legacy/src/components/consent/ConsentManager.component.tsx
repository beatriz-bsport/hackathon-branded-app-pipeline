// Duplicated in packages/consent-management/src/ConsentManager.tsx

import React from 'react';
import { DidomiSDK } from '@didomi/react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error when rendering consent manager:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

const isInIframe = () => window.self !== window.top;

const ConsentManager = ({
  apiKey,
  noticeId,
  domain,
}: {
  apiKey: string;
  noticeId: string;
  domain: string;
}) => {
  if (!apiKey || !noticeId || !domain) return null;
  if (isInIframe()) return null;

  return (
    <ErrorBoundary>
      <DidomiSDK
        apiKey={apiKey}
        config={{
          cookies: {
            local: {
              customDomain: domain,
            },
          },
        }}
        noticeId={noticeId}
      />
    </ErrorBoundary>
  );
};

export default ConsentManager;
