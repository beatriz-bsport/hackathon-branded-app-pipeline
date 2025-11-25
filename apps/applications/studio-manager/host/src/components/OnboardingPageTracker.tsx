import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { onboardingManagerClient } from "#src/utils/onboarding";

export const OnboardingPageTracker = () => {
  const location = useLocation();
  const lastPathRef = useRef<string>(null);

  useEffect(() => {
    onboardingManagerClient.loadScript();
  }, []);

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
