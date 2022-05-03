import React, { FC, ReactElement, Suspense, useContext } from 'react';
import { IRoute } from '../types';
import { Navigate, useLocation } from 'react-router-dom';
import { RouterContext } from '../context/context';
import { useRole } from '../hooks/use-role.hook';
import InvalidUserDefaultFallback from '../shared/invalid-user-default-fallback';


export const Private: FC<IRoute> = (props): ReactElement => {
  const { component, fallback, roles, path, allRolesRequired } = props;
  const ctx = useContext(RouterContext);
  const location = useLocation();
  const {
    routes: { defaultFallback, publicRedirectRoute, InvalidUserRoleFallback },
    isAuth,
    userRole,
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, roles, allRolesRequired);

  const redirectTo: string = publicRedirectRoute ? publicRedirectRoute : '/';
  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
    ? defaultFallback
    : null;

  /** user must be authorized */
  if (!isAuth) {
    return (
      <Navigate to={redirectTo} state={{ from: location }} />
    );
  } else {
    /** user must have the required role that matches a route role */
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
    } else {
      /** user is authorized and roles are OK */
      return (
        <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>
      );
    }
  }
};
