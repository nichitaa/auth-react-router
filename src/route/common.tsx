import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { RouterContext } from '../context/context';
import { IRoute } from '../types';
import { useRole } from '../hooks';
import InvalidUserDefaultFallback from '../shared/invalid-user-default-fallback';

export const Common: FC<IRoute> = (props): ReactElement => {
  const { component, fallback, roles, path, allRolesRequired } = props;
  const ctx = useContext(RouterContext);
  const {
    routes: { defaultFallback, InvalidUserRoleFallback },
    userRole,
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, roles, allRolesRequired);

  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  if (userHasRequiredRole === false) {
    return InvalidUserRoleFallback ? (
      <InvalidUserRoleFallback
        currentUserRole={userRole}
        routeRequiredRoles={roles}
      />
    ) : (
      <InvalidUserDefaultFallback
        currentUserRole={userRole}
        routeRequiredRoles={roles}
      />
    );
  }

  return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>;
};
