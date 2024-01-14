import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteProps } from '../types';
import {
  useAuthReactRouter,
  useSuspenseFallbackComponent,
  useHasRoles,
  useInvalidRolesFallbackComponent,
  useFallbackRoute,
} from '../hooks';

/**
 * @internal
 */
export const Public = (route: RouteProps) => {
  const { authorized } = useAuthReactRouter();

  const suspenseFallback = useSuspenseFallbackComponent(route);
  const InvalidRolesFallback = useInvalidRolesFallbackComponent(route);
  const routeFallback = useFallbackRoute(route, 'public');
  const hasRoles = useHasRoles(route);

  if (authorized) {
    return <Navigate to={routeFallback} />;
  }

  if (!hasRoles) {
    return <InvalidRolesFallback {...route} />;
  }

  return <Suspense fallback={suspenseFallback}>{route.element}</Suspense>;
};
