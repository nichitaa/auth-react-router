import { Suspense } from 'react';
import type { RouteProps } from '../types';
import {
  useHasRoles,
  useInvalidRolesFallbackComponent,
  useSuspenseFallbackComponent,
} from '../hooks';

export const Common = (route: RouteProps) => {
  const suspenseFallback = useSuspenseFallbackComponent(route);
  const InvalidRolesFallback = useInvalidRolesFallbackComponent(route);
  const hasRoles = useHasRoles(route);

  if (!hasRoles) {
    return <InvalidRolesFallback {...route} />;
  }

  return <Suspense fallback={suspenseFallback}>{route.element}</Suspense>;
};
