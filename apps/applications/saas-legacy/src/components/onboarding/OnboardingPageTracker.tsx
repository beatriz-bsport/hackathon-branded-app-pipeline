import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { onboardingManagerClient } from './onboardingManagerClient';

const OnboardingPageTracker = (): null => {
  const location = useLocation();
  const lastPathRef = useRef<string>();

  useEffect(() => {
    const path = location.pathname + location.search;

    if (lastPathRef.current === path) {
      return;
    }

    lastPathRef.current = path;

    onboardingManagerClient.navigate();
  }, [location.pathname, location.search]);

  return null;
};

export default OnboardingPageTracker;
