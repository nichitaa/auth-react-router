import React, {useContext} from "react";
import {RouterContext} from "./context/Context";
import {Route, Routes as ReactRouterDomRoutes} from "react-router-dom";
import {Common} from "./route/Common";
import {Public} from "./route/Public";
import {Private} from "./route/Private";

export const Routes = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw Error(`<Routes /> Component must be inside a SimpleReactRouterProvider`);

  const { routes, isAuth} = ctx;

  return <ReactRouterDomRoutes>
    {routes.common.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={<Common isAuth={isAuth} {...route}/>}
      />
    ))}

    {routes.public.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={<Public isAuth={isAuth} {...route}/>}
      />
    ))}

    {routes.private.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={<Private isAuth={isAuth} {...route}/>}
      />
    ))}
  </ReactRouterDomRoutes>
}