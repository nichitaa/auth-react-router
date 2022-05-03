import { useContext, useEffect, useState } from 'react';
import { RouterContext } from '../context/context';

interface IUseCheckRoleReturn {
  isAllowed?: boolean;
  userRole?: string[] | string;
}

export const useCheckRole = (
  requiredRoles: string | string[],
  allRolesRequired?: boolean,
): IUseCheckRoleReturn => {
  const ctx = useContext(RouterContext);

  // undefined can be treated in UI as loading state
  const [hasRequiredRoles, setHasRequiredRoles] = useState<boolean | undefined>(
    undefined,
  );

  if (!ctx) {
    throw new Error(
      `useCheckRole hook must be used inside AppRouter provider!`,
    );
  }

  const { userRole } = ctx!;

  useEffect(() => {
    if (userRole === undefined) {
      const err = `'userRole' is undefined`;
      console.error(err);
      setHasRequiredRoles(false);
    } else {
      // user has some roles
      if (Array.isArray(requiredRoles)) {
        // multiple roles
        if (allRolesRequired) {
          if (!Array.isArray(userRole)) {
            throw new Error(
              `'userRole' must be an array of roles (for 'allRolesRequired' check), current: ${userRole}`,
            );
          }
          // must have all roles to access the resource
          const hasAllRoles = requiredRoles.every((r) => userRole.includes(r));
          setHasRequiredRoles(hasAllRoles);
        } else {
          // at least one role
          if (Array.isArray(userRole)) {
            const hasAtLeastOneRole = userRole.some((r) =>
              requiredRoles.includes(r),
            );
            setHasRequiredRoles(hasAtLeastOneRole);
          } else {
            const roleIsIncluded = requiredRoles.includes(userRole);
            setHasRequiredRoles(roleIsIncluded);
          }
        }
      } else {
        // single role check
        if (Array.isArray(userRole)) {
          // user has multiple roles
          const roleIsIncluded = userRole.includes(requiredRoles);
          setHasRequiredRoles(roleIsIncluded);
        } else {
          // user has single role
          const sameRoles = requiredRoles === userRole;
          setHasRequiredRoles(sameRoles);
        }
      }
    }
  }, [requiredRoles, allRolesRequired, userRole]);

  return {isAllowed: hasRequiredRoles, userRole};
};
