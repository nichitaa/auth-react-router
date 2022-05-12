import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { RouterContext } from '../context/context';
import { IRoute } from '../types';
import { useRole } from '../hooks';
import InvalidUserDefaultFallback from '../shared/invalid-user-default-fallback';

export const Public: FC<IRoute> = (props): ReactElement => {
  const { component, fallback, path, roles, allRolesRequired } = props;
  const ctx = useContext(RouterContext);
  const {
    routes: { defaultFallback, privateRedirectRoute, InvalidUserRoleFallback },
    userRole,
    isAuth,
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, roles, allRolesRequired);

  const redirectTo: string = privateRedirectRoute ? privateRedirectRoute : '/';
  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  /** user must not be authorized */
  if (isAuth) {
    return <Navigate to={redirectTo} />;
  }

  /** user must have the required role that matches a route role */
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

  /** user is not authorized and roles are OK */
  return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>;
};
