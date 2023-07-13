// @ts-nocheck
import { buildUrlParams } from '../../http';
import { PAGES_NOT_LOGIN } from './constants';

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

/*
This function has to return true when the page displayed is the login page.
'/login*' almost always displays the login page
EXCEPT IN THE CASE OF some pathnames matching '/login*' that redirect to other pages, defined in Login.router and listed in PAGES_NOT_LOGIN.
Therefore we return false only when the pathname matches one of PAGES_NOT_LOGIN.
*/
export const isLoginBackgroundFixed = (pathname: string) => {
  let backgroundFixed = true;
  PAGES_NOT_LOGIN.forEach((regex) => {
    if (regex.test(pathname)) {
      backgroundFixed = false;
    }
  });
  return backgroundFixed;
};
