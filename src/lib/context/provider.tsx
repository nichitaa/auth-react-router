import type { RouterContextProps } from '../types';
import { useMemo } from 'react';
import { getRoutesConfig } from '../utils';
import { AuthReactRouterContext, type AuthReactRouterContextValue } from '../context';

export const AuthReactRouterProvider = ({
  children,
  authorized,
  roles,
  routes,
}: RouterContextProps) => {
  console.log('[AuthReactRouterProvidsssser]');

  const value: AuthReactRouterContextValue = useMemo(
    () => ({
      authorized,
      roles,
      routes: getRoutesConfig(routes),
    }),
    [authorized, roles, routes],
  );

  return (
    <AuthReactRouterContext.Provider value={value}>{children}</AuthReactRouterContext.Provider>
  );
};
