import React from 'react';

import Intercom from 'react-intercom';
import withSentryErrorReporting from '#hocs/error-boundary-hidden.hoc';
import { Theme } from '#libs/theme/types';

type Props = {
  email: string;
  company?: number;
  user_id: number;
  environment: string;
  release: string;
  role: string;
  action_color?: string;
  language_override?: string;
  isBsportChromePluginActivated: boolean;
  theme?: Theme;
};

export const FORCE_DISPLAY_FOR_TESTING = false;

export const IntercomComponent = (props: Props) => {
  const shouldHideENV = !['production', 'staging'].includes(props.environment);
  const shouldHidePLUGIN = props.isBsportChromePluginActivated;
  const shouldHideTHEME = props.theme?.hide_intercom;

  if (
    (shouldHideENV || shouldHidePLUGIN || shouldHideTHEME) &&
    !FORCE_DISPLAY_FOR_TESTING
  ) {
    return null;
  }

  return (
    <Intercom
      appID="q6foivp2"
      email={props.email}
      company={props.company}
      name={props.name}
      user_id={props.user_id}
      environment={props.environment}
      release={props.release}
      role={props.role}
      action_color={props.action_color}
      custom_launcher_selector="#intercomIcon"
      language_override={props.language_override}
    />
  );
};

export default withSentryErrorReporting(IntercomComponent);
