import React, { useContext } from 'react';
import { RouterContext } from './context/Context';
import { Route, Routes as ReactRouterDomRoutes } from 'react-router-dom';
import { Common, Private, Public } from './route';

export const Routes = () => {
  const ctx = useContext(RouterContext);
  if (!ctx)
    throw Error(
      `<Routes /> Component must be inside a SimpleReactRouterProvider`
    );

  const { routes, isAuth } = ctx;

  return (
    <ReactRouterDomRoutes>
      {routes.common &&
        routes.common.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Common {...route} />}
          />
        ))}

      {isAuth &&
        routes.public &&
        routes.public.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Public {...route} />}
          />
        ))}

      {isAuth &&
        routes.private &&
        routes.private.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Private {...route} />}
          />
        ))}
    </ReactRouterDomRoutes>
  );
};
