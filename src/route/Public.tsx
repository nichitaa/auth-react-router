import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { RouterContext } from '../context/Context';
import { IRoute } from '../types';

export const Public: FC<IRoute> = (props): ReactElement => {
  const { component, fallback } = props;

  const ctx = useContext(RouterContext);
  const {
    routes: { defaultFallback, privateRedirectRoute },
    isAuth,
  } = ctx!;

  const redirectTo: string = privateRedirectRoute ? privateRedirectRoute : '/';
  const suspenseFallback = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  return isAuth ? (
    <Navigate to={redirectTo} />
  ) : (
    <Suspense fallback={suspenseFallback}>{component}</Suspense>
  );
};
