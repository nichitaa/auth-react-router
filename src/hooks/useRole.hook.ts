import {useState, useEffect} from "react";

/**
 * Custom hook that returns a boolean value if the user can access the specified route path,
 * by assigned role
 *
 * @param path
 * @param userRole
 * @param routeRoles
 * @returns [boolean]
 */
export const useRole = (path: string, userRole?: string, routeRoles?: string[]) => {
  const [userHasRequiredRole, setUserHasRequiredRole] = useState(false);

  useEffect(() => {
    /** the route has some roles */
    if (routeRoles && routeRoles.length) {
      if (!userRole) {
        /** but user has no role */
        const errorMsg = `The path ${path} has some required roles: ${JSON.stringify(routeRoles)}, but current user does not have a role!`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      } else {
        /** user has a role, validate it! */
        const roleIsIncluded = routeRoles.includes(userRole);
        setUserHasRequiredRole(roleIsIncluded)
      }
    } else {
      /** the route has no roles */
      setUserHasRequiredRole(true);
    }
  }, [userRole, routeRoles]);

  return [userHasRequiredRole];
}