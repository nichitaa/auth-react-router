import type { RouteProps } from '../types';
import type { FC } from 'react';
import { Route } from 'react-router-dom';
import { isDefined } from './index';

export const createNestedRoutes = (RouteType: FC<RouteProps>, routes?: RouteProps[]) => {
  if (!isDefined(routes)) return null;
  return (
    <>
      {routes.map((route, idx) => {
        const { routes: childRoutes, index, ...routeProps } = route;
        const key = `${route.path}_${idx}`;
        if (index) {
          return <Route {...routeProps} key={key} element={<RouteType {...route} />} index />;
        }
        return (
          <Route {...routeProps} key={key} element={<RouteType {...route} />}>
            {isDefined(childRoutes) && createNestedRoutes(RouteType, childRoutes)}
          </Route>
        );
      })}
    </>
  );
};
