import type { RoutesConfig } from './routes-config.ts';
import type { ReactNode } from 'react';

/**
 * `AuthReactRouter` Provider props
 */
export interface RouterContextProps {
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