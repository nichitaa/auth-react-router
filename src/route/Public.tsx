import React, {FC, ReactElement, Suspense, useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {IRouteProps} from "../types";
import {RouterContext} from "../context/Context";

export const Public: FC<IRouteProps> = (props): ReactElement => {
  const {component, isAuth, fallback} = props;

  const ctx = useContext(RouterContext);
  const {routes: {defaultFallback, privateRedirectRoute}} = ctx!;

  return isAuth
    ? <Navigate to={privateRedirectRoute}/>
    : <Suspense fallback={fallback ? fallback : defaultFallback}>{component}</Suspense>
}