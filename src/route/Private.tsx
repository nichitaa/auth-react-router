import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { IRoute } from '../types';
import { Navigate } from 'react-router-dom';
import { RouterContext } from '../context/Context';

export const Private: FC<IRoute> = (props): ReactElement => {
  const { component, fallback } = props;

  const ctx = useContext(RouterContext);
  const {
    routes: { defaultFallback, publicRedirectRoute },
    isAuth,
  } = ctx!;

  const redirectTo: string = publicRedirectRoute ? publicRedirectRoute : '/';
  const suspenseFallback = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  return !isAuth ? (
    <Navigate to={redirectTo} />
  ) : (
    <Suspense fallback={suspenseFallback}>{component}</Suspense>
  );
};
