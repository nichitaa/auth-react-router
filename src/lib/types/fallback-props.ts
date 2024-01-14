import type { ComponentType, SuspenseProps } from 'react';
import type { RouteProps } from './route-props.ts';

/**
 * Globally configured fallback properties (can be configured at route level as well)
 * @category Interface
 */
export interface FallbackProps {
  /**
   * Fallback component, rendered if user does not have required role to visit the route
   * (configurable globally and at route level)
   *
   * ### Example
   * ```jsx
   * const fallback: FallbackProps = {
   *   InvalidRoles: (route) => <>User has no access to {route.path}, required roles are: {JSON.stringify(route.roles)}</>
   * }
   * ```
   */
  InvalidRoles: ComponentType<RouteProps>;

  /**
   * Fallback for lazy loaded routes (configurable globally and at route level)
   *
   * ### Example
   * ```jsx
   * const fallback: FallbackProps = {
   *   Suspense: <>...loading...<>
   * }
   * ```
   */
  Suspense: SuspenseProps['fallback'];

  /**
   * Unauthorized users on private routes will be redirected to this route
   * @default common[0].path ?? '/'
   */
  privateRoute: string;

  /**
   * Authorized users on public routes will be redirected to this route
   * @default common[0].path ?? '/'
   */
  publicRoute: string;
}
