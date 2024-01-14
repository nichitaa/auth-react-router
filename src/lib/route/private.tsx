import { Suspense } from 'react';
import type { RouteProps } from '../types';
import { Navigate, useLocation } from 'react-router-dom';
import {
  useAuthReactRouter,
  useFallbackRoute,
  useHasRoles,
  useInvalidRolesFallbackComponent,
  useSuspenseFallbackComponent,
} from '../hooks';

/**
 * @internal
 */
export const Private = (route: RouteProps) => {
  const location = useLocation();

  const { authorized } = useAuthReactRouter();
  const suspenseFallback = useSuspenseFallbackComponent(route);
  const InvalidRolesFallback = useInvalidRolesFallbackComponent(route);
  const routeFallback = useFallbackRoute(route, 'private');
  const hasRoles = useHasRoles(route);

  if (!authorized) {
    return <Navigate to={routeFallback} state={{ from: location }} />;
  }

  if (!hasRoles) {
    return <InvalidRolesFallback {...route} />;
  }

  return <Suspense fallback={suspenseFallback}>{route.element}</Suspense>;
};
