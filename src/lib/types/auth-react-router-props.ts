import type { RoutesConfig } from './routes-config.ts';
import type { ReactNode } from 'react';

/**
 * Props for {@link AuthReactRouter | `AuthReactRouter`}
 *
 * @category Interface
 */
export interface AuthReactRouterProps {
  /**
   * Application routes definitions
   */
  routes: RoutesConfig;

  /**
   * Authorization state of the user, if not provided only `common` routes will work correspondingly
   */
  authorized?: boolean;

  /**
   * User roles
   */
  roles?: string[];

  children?: ReactNode;
}