import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { RouterContext } from '../context/Context';
import { IRoute } from '../types';

export const Common: FC<IRoute> = (props): ReactElement => {
  const { component, fallback } = props;
  const ctx = useContext(RouterContext);

  const {
    routes: { defaultFallback },
  } = ctx!;

  const suspenseFallback = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  return <Suspense fallback={suspenseFallback}>{component}</Suspense>;
};
