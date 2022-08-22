import React, { ReactElement, useContext } from 'react';
import { RouterContext } from './context/context';
import { Route, Routes as ReactRouterDomRoutes } from 'react-router-dom';
import { Common, Private, Public } from './route';
import { IRoute } from './types';

/**
 * recursively creates the nested structure of the rr6 routes components
 * @param routes[]
 * @param RouteType - Common | Private | Public
 */
const createNestedRoutes = (
  routes: IRoute[],
  RouteType: React.FC<IRoute>,
): ReactElement => {
  return (
    <>
      {routes.map((route, i) => {
        if (!route.component) {
          throw new Error(`Missing 'component' for route ${route.path}`);
        }
        if (route.children) {
          return (
            <Route key={i} path={route.path} element={<RouteType {...route} />}>
              {route.children && createNestedRoutes(route.children, RouteType)}
            </Route>
          );
        }
        return (
          <Route
            index={route.index}
            key={i}
            path={route.path}
            element={<RouteType {...route} />}
          />
        );
      })}
    </>
  );
};

export const Routes = () => {
  const ctx = useContext(RouterContext);
  if (!ctx)
    throw Error(
      `<Routes /> Component must be inside a SimpleReactRouterProvider`,
    );

  const { routes, isAuth } = ctx;

  return (
    <ReactRouterDomRoutes>
      {routes.common && createNestedRoutes(routes.common, Common)}

      {isAuth !== undefined &&
        routes.public &&
        createNestedRoutes(routes.public, Public)}

      {isAuth !== undefined &&
        routes.private &&
        createNestedRoutes(routes.private, Private)}
    </ReactRouterDomRoutes>
  );
};
