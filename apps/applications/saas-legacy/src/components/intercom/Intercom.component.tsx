import React, { useEffect } from 'react';
import { captureException } from '@sentry/react';
import Intercom from 'react-intercom';
// @ts-expect-error
import withSentryErrorReporting from '#src/hocs/error-boundary-hidden.hoc';
import { Theme } from '#src/libs/theme/types';
import { SENTRY_FRONTEND_MODULE_TAG_NAME } from '#src/sentry/types';

function isInvalidEmail(email: string | undefined): boolean {
  return (
    !email ||
    typeof email !== 'string' ||
    !EMAIL_VALIDATION_REGEXP.test(email.trim())
  );
}

type Props = {
  email: string;
  company?: number;
  user_id: string;
  environment: string;
  release: string;
  role: string;
  action_color?: string;
  language_override?: string;
  theme?: Theme;
};

/** Regex to validate email format (used as user_id for Intercom). */
export const EMAIL_VALIDATION_REGEXP = /^(.*)+@(.*)\.(.*)/;

const INTERCOM_INVALID_EMAIL_ERROR_MESSAGE =
  'Intercom widget skipped: invalid or missing email';

const shutdownIntercom = () => {
  try {
    window?.Intercom?.('shutdown');
  } catch (err) {
    console.error(err);
    captureException(err, {
      tags: {
        component: 'Intercom',
        [SENTRY_FRONTEND_MODULE_TAG_NAME]: 'customer-data-platform',
      },
    });
  }
};
export const FORCE_DISPLAY_FOR_TESTING = false;

export const IntercomComponent = (props: Props) => {
  const shouldHideENV = !['production', 'staging'].includes(props.environment);
  const shouldHideTHEME = props.theme?.hide_intercom;

  useEffect(() => {
    window.addEventListener('beforeunload', shutdownIntercom);
    return () => {
      shutdownIntercom();
      window.removeEventListener('beforeunload', shutdownIntercom);
    };
  }, []);

  if ((shouldHideENV || shouldHideTHEME) && !FORCE_DISPLAY_FOR_TESTING) {
    return null;
  }

  // We check both email and user_id because user_id is the primary key that we are using to identify the user and assign them to their
  // Intercom contact. And the user_id for use will always be equal to the email of the user currently connected to Intercom.
  if (isInvalidEmail(props.user_id) || isInvalidEmail(props.email)) {
    console.error('[Intercom]', INTERCOM_INVALID_EMAIL_ERROR_MESSAGE, {
      email: props.email,
      user_id: props.user_id,
    });
    captureException(new Error(INTERCOM_INVALID_EMAIL_ERROR_MESSAGE), {
      extra: {
        email: props.email,
        user_id: props.user_id,
        environment: props.environment,
      },
    });
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
