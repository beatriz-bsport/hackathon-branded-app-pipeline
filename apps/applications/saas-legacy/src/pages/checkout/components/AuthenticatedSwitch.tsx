import React from 'react';
import { match as MatchType, matchPath } from 'react-router-dom';
import { Redirect, Switch, Route } from 'react-router';
import { getLoginUrl } from '#src/libs/marketplace/routing-utils';

export const AuthenticatedSwitch: React.FC<{
  isAuthenticated: boolean;
  companyId: number;
  location: { [key: string]: string };
  routes: {
    component: React.ComponentType<any>;
    path: string;
    redirectTo?: <P extends { [key: string]: string }>(
      match: MatchType<P>,
    ) => string;
  }[];
}> = ({ isAuthenticated, companyId, location, routes }) => {
  const matches = routes.map((route) => ({
    route,
    match: matchPath(location.pathname, { path: route.path, exact: true }),
  }));
  for (const { route, match } of matches) {
    if (!isAuthenticated && !!match) {
      return (
        <Redirect
          to={
            route.redirectTo
              ? route.redirectTo(match)
              : getLoginUrl(
                  companyId,
                  location.pathname,
                  window.location.search,
                )
          }
        />
      );
    }
  }

  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  );
};
