import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { RouterContext } from '../context/context';
import { IRoute } from '../types';
import { useRole } from '../hooks/use-role.hook';
import InvalidUserDefaultFallback from '../shared/invalid-user-default-fallback';

export const Common: FC<IRoute> = (props): ReactElement => {
  const { component, fallback, roles, path, allRolesRequired } = props;
  const ctx = useContext(RouterContext);
  const {
    routes: { defaultFallback, InvalidUserRoleFallback },
    userRole,
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, userRole, roles, allRolesRequired);

  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  if (!userHasRequiredRole) {
    if (InvalidUserRoleFallback)
      return (
        <InvalidUserRoleFallback
          currentUserRole={userRole}
          routeRequiredRoles={roles}
        />
      );
    else
      return (
        <InvalidUserDefaultFallback
          currentUserRole={userRole}
          routeRequiredRoles={roles}
        />
      );
  }

  return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>;
};
