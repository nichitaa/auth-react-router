import type { RouterContextProps } from '../types';
import { getRoutesConfig } from '../utils';
import { createContext } from 'react';

export type AuthReactRouterContextValue = Pick<RouterContextProps, 'authorized' | 'roles'> & {
  routes: ReturnType<typeof getRoutesConfig>;
};

export const AuthReactRouterContext = createContext<AuthReactRouterContextValue | undefined>(
  undefined,
);