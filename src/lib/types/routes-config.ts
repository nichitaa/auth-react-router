import type { RouteProps } from './route-props.ts';
import type { FallbackProps } from './fallback-props.ts';

/**
 * Routes configurations for the application
 *
 * @category Interface
 */
export interface RoutesConfig {
  /**
   * Fallback props configured globally
   */
  fallback?: Partial<FallbackProps>;

  /**
   * Private routes definitions - accessible only by authorized users (`authorized`: `true`)
   */
  private?: RouteProps[];

  /**
   * Public routes definitions - accessible only by unauthorized users (`authorized`: `false`)
   */
  public?: RouteProps[];

  /**
   * Common routes definitions - accessible by both authorized and unauthorized users
   */
  common?: RouteProps[];
}

