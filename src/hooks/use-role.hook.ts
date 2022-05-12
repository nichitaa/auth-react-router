import { useContext, useEffect, useState } from 'react';
import { RouterContext } from '../context/context';

/**
 * Custom hook that returns a boolean value if the user can access the specified route path,
 * by assigned role
 *
 * @param path
 * @param routeRoles
 * @param allRolesRequired
 * @returns [boolean]
 */
export const useRole = (
  path: string,
  routeRoles?: string[],
  allRolesRequired?: boolean,
) => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error(`useRole hook must be used inside AppRouter provider!`);
  }
  const { userRole } = ctx;

  const [userHasRequiredRole, setUserHasRequiredRole] = useState(() =>
    checkRole(path, routeRoles, userRole, allRolesRequired),
  );

  useEffect(() => {
    const canAccess = checkRole(path, routeRoles, userRole, allRolesRequired);
    if (canAccess !== userHasRequiredRole) setUserHasRequiredRole(canAccess);
  }, [userRole, routeRoles]);

  return [userHasRequiredRole];
};

const checkRole = (
  path: string,
  routeRoles?: string[],
  userRole?: string[] | string,
  allRolesRequired?: boolean,
): boolean => {
  /** the route has some roles */
  if (routeRoles && routeRoles.length) {
    if (!userRole) {
      /** but user has no role */
      const errorMsg = `The path ${path} has some required roles: ${JSON.stringify(
        routeRoles,
      )}, but current user does not have a role!`;
      console.error(errorMsg);
      // throw new Error(errorMsg);
    } else {
      /** check against user role/s */
      if (Array.isArray(userRole)) {
        /** user has multiple roles */
        if (allRolesRequired) {
          /** and all roles must be required */
          const hasAllRoles = routeRoles.every((r) => userRole.includes(r));
          return hasAllRoles;
        }
        /** user must have at least one role */
        const hasAtLeastOneRole = userRole.some((r) => routeRoles.includes(r));
        return hasAtLeastOneRole;
      }
      /** user has a single role */
      const roleIsIncluded = routeRoles.includes(userRole);
      return roleIsIncluded;
    }
  }
  /** the route has no roles */
  return true;
};