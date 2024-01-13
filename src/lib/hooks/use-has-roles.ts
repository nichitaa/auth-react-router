import { useAuthReactRouter } from '../hooks';
import type { RouteProps } from '../types';
import { useMemo } from 'react';
import { isDefined } from '../utils';

export const useHasRoles = ({
  allRolesRequired,
  roles,
}: Pick<RouteProps, 'allRolesRequired' | 'roles'>) => {
  const { roles: userRole } = useAuthReactRouter();

  return useMemo(() => {
    if (!isDefined(roles)) return true;
    if (!isDefined(userRole)) return false;
    if (Array.isArray(userRole)) {
      if (allRolesRequired) return roles.every((x) => userRole.includes(x));
      return userRole.some((x) => roles.includes(x));
    }
    return roles.includes(userRole);
  }, [roles, allRolesRequired, userRole]);
};
