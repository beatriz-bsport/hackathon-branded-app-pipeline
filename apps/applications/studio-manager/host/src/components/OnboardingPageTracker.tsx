import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { getEnv } from "@bsport/envs";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { onboardingManagerClient } from "#src/utils/onboarding";

export const OnboardingPageTracker = () => {
  const location = useLocation();
  const lastPathRef = useRef<string>(null);

  useEffect(() => {
    const path = location.pathname + location.search;

    if (lastPathRef.current === path) {
      return;
    }

    lastPathRef.current = path;

    onboardingManagerClient.navigate();
  }, [location.pathname, location.search]);

  const user = dataAccessLayer.useUserAccess();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const env = getEnv();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    async function loadOnboardingManagerScript() {
      try {
        await onboardingManagerClient.loadScript();

        setIsScriptLoaded(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Failed to load Onboarding Manager script:",
            error.message,
          );
        } else {
          console.error("Failed to load Onboarding Manager script:", error);
        }
      }
    }

    loadOnboardingManagerScript();
  }, []);

  useEffect(() => {
    if (user?.id && isScriptLoaded) {
      const { id, role: company_role, franchise_role, username } = user;

      onboardingManagerClient.initUser({
        user_id: String(id),
        username,
        company_role,
        franchise_role,
        company_id: companyTheme?.company,
        franchise_id: companyTheme?.franchisor,
        environment: env,
        app: "sm-host",
      });
    }
  }, [user, companyTheme, env, isScriptLoaded]);

  return null;
};
