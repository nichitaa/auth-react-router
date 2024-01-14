import { useAuthReactRouter } from '../hooks';
import type { FallbackProps, RouteProps } from '../types';
import { type SuspenseProps, useMemo } from 'react';
import { isDefined } from '../utils';

/**
 * @internal
 */
export const useSuspenseFallbackComponent = ({
  fallback,
}: Pick<RouteProps, 'fallback'>): SuspenseProps['fallback'] => {
  const { routes } = useAuthReactRouter();

  return useMemo(() => {
    if (isDefined(fallback?.Suspense)) return fallback.Suspense;
    return routes.fallback.Suspense;
  }, [fallback?.Suspense, routes.fallback.Suspense]);
};
/**
 * @internal
 */
export const useInvalidRolesFallbackComponent = ({
  fallback,
}: Pick<RouteProps, 'fallback'>): FallbackProps['InvalidRoles'] => {
  const { routes } = useAuthReactRouter();

  return useMemo(() => {
    if (isDefined(fallback?.InvalidRoles)) return fallback.InvalidRoles;
    return routes.fallback.InvalidRoles;
  }, [fallback?.InvalidRoles, routes.fallback.InvalidRoles]);
};

/**
 * @internal
 */
export const useFallbackRoute = (
  { fallback }: Pick<RouteProps, 'fallback'>,
  type: 'private' | 'public',
): string => {
  const { routes } = useAuthReactRouter();

  return useMemo(() => {
    if (isDefined(fallback?.route)) return fallback.route;
    if (type === 'private') {
      return routes.fallback.privateRoute;
    }
    if (type === 'public') {
      return routes.fallback.publicRoute;
    }
    throw new Error('[useFallbackRoute] Could not find fallback route ');
  }, [fallback?.route, type, routes.fallback]);
};
