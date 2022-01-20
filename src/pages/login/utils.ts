import { buildUrlParams } from '../../http';

export const buildSignUpUrl = (
  signUpNext: string,
  context: string,
  membership: string,
  location: { pathname: string; search: string },
) =>
  `/login/signup${
    !signUpNext && !context && !membership
      ? ''
      : buildUrlParams({
          ...(membership ? { membership: encodeURIComponent(membership) } : {}),
          ...(signUpNext && context === 'widget'
            ? {
                next: encodeURIComponent(
                  `/checkout/${membership}/${signUpNext}`,
                ),
              }
            : {}),
          ...(context === 'widget'
            ? {
                previous: encodeURIComponent(
                  `${location.pathname}${location.search}`,
                ),
              }
            : {}),
        })
  }`;
