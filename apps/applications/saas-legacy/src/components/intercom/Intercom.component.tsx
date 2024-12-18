import React from 'react';

import Intercom from 'react-intercom';
// @ts-expect-error
import withSentryErrorReporting from '#src/hocs/error-boundary-hidden.hoc';
import { Theme } from '#src/libs/theme/types';

type Props = {
  email: string;
  company?: number;
  user_id: number;
  environment: string;
  release: string;
  role: string;
  action_color?: string;
  language_override?: string;
  theme?: Theme;
};

export const FORCE_DISPLAY_FOR_TESTING = false;

export const IntercomComponent = (props: Props) => {
  const shouldHideENV = !['production', 'staging'].includes(props.environment);
  const shouldHideTHEME = props.theme?.hide_intercom;

  if ((shouldHideENV || shouldHideTHEME) && !FORCE_DISPLAY_FOR_TESTING) {
    return null;
  }

  // dirty : as we mix environment on Intercom, between production and staging, we
  // want to avoid users and company collisions
  //
  // company will have a negative id on staging, and users will have +staging@ in the
  // email
  //
  const company = props.company;
  let email = props.email;

  if (props.environment === 'staging') {
    // @ts-expect-error
    if (company && company.id && company.name) {
      // @ts-expect-error
      company.id = -company.id;
      // @ts-expect-error
      company.name = `[STAGING] ${company.name}`;
    }
    if ((email || '').includes('@')) {
      email = email.replace('@', '+staging@');
    }
  }

  return (
    <Intercom
      action_color={props.action_color}
      appID="q6foivp2"
      company={props.company}
      custom_launcher_selector="#intercomIcon"
      email={props.email}
      environment={props.environment}
      language_override={props.language_override}
      // @ts-expect-error
      name={props.name}
      release={props.release}
      role={props.role}
      user_id={props.user_id}
    />
  );
};

export default withSentryErrorReporting(IntercomComponent);
