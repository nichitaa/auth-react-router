import {useState, useEffect} from "react";

export const useRole = (path: string, userRole?: string, routeRoles?: string[]) => {
  const [userHasRequiredRole, setUserHasRequiredRole] = useState(false);

  useEffect(() => {
    if (routeRoles && routeRoles.length && !userRole) {
      // route has roles but user does not have a role
      const errorMsg = `The path ${path} has some required roles: ${JSON.stringify(routeRoles)}, but current user does not have a role!`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    } else if (routeRoles && routeRoles.length && userRole) {
      // route has roles and user has a role
      const roleIsIncluded = routeRoles.includes(userRole);
      setUserHasRequiredRole(roleIsIncluded)
    } else {
      setUserHasRequiredRole(true);
    }
  }, [userRole, routeRoles]);

  return [userHasRequiredRole];
}