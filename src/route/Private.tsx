import React, {FC, ReactElement, Suspense, useContext} from 'react';
import {IRoute} from '../types';
import {Navigate, useLocation} from 'react-router-dom';
import {RouterContext} from '../context/Context';
import {useRole} from "../hooks/useRole.hook";
import InvalidUserDefaultFallback from "../shared/InvalidUserDefaultFallback";

export const Private: FC<IRoute> = (props): ReactElement => {
  const {component, fallback, roles, path} = props;
  const ctx = useContext(RouterContext);
  const {
    routes: {defaultFallback, publicRedirectRoute, InvalidUserRoleFallback},
    isAuth,
    userRole
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, userRole, roles);
  const location = useLocation();
  const { pathname, search } = location;

  const redirectTo: string = publicRedirectRoute ? publicRedirectRoute : '/';
  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
      ? defaultFallback
      : null;

  /** user must be authorized */
  if (!isAuth) {
    return <Navigate to={redirectTo} state={{ returnUrl: `${pathname}${search}` }}/>;
  } else {
    /** user must have the required role that matches a route role */
    if (!userHasRequiredRole) {
      if (InvalidUserRoleFallback)
        return <InvalidUserRoleFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
      else
        return <InvalidUserDefaultFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
    } else {
      /** user is authorized and roles are OK */
      return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>
    }
  }
};
