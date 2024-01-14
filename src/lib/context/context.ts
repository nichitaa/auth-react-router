import type { AuthReactRouterProps } from '../types';
import { getRoutesConfig } from '../utils';
import { createContext } from 'react';

/**
 * @internal
 */
export type AuthReactRouterContextValue = Pick<AuthReactRouterProps, 'authorized' | 'roles'> & {
  routes: ReturnType<typeof getRoutesConfig>;
};

/**
 * @internal
 */
export const AuthReactRouterContext = createContext<AuthReactRouterContextValue | undefined>(
  undefined,
);