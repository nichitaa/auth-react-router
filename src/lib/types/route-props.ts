import type { RouteObject } from 'react-router-dom';

import type { FallbackProps } from './fallback-props.ts';

/**
 * Single route configuration
 */
export interface RouteProps
  extends Pick<RouteObject, 'index' | 'path' | 'element' | 'caseSensitive' | 'handle'> {

  /**
   * Route fallback definitions
   */
  fallback?: Partial<Pick<FallbackProps, 'Suspense' | 'InvalidRoles'>> & {
    /**
     * Fallback route (applied for private or public routes)
     */
    route?: string;
  };

  /**
   * Array of roles that protects the route.
   * If not provided, then the page can be accessed by users without roles.
   */
  roles?: string[];

  /**
   * If set to `true` - user must have all roles from `route.roles` Array.
   * If set to `false` - user must have at least one role from `route.roles` Array.
   * @default to `false`
   */
  allRolesRequired?: boolean;

  /**
   * Nested routes definitions
   */
  routes?: RouteProps[];
}
