import React, {FC, ReactElement, Suspense, useContext} from "react";
import {IRouteProps} from "../types";
import {Navigate} from "react-router-dom";
import {RouterContext} from "../context/Context";

export const Private: FC<IRouteProps> = (props): ReactElement => {
  const {component, isAuth, fallback} = props;

  const ctx = useContext(RouterContext);
  const {routes: {defaultFallback, publicRedirectRoute}} = ctx!;

  return !isAuth
    ? <Navigate to={publicRedirectRoute}/>
    : <Suspense fallback={fallback ? fallback : defaultFallback}>{component}</Suspense>
}