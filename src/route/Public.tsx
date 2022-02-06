import React, {FC, ReactElement, Suspense, useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {RouterContext} from '../context/Context';
import {IRoute} from '../types';
import {useRole} from "../hooks/useRole.hook";
import InvalidUserDefaultFallback from "../shared/InvalidUserDefaultFallback";

export const Public: FC<IRoute> = (props): ReactElement => {
  const {component, fallback, path, roles} = props;
  const ctx = useContext(RouterContext);
  const {
    routes: {defaultFallback, privateRedirectRoute, InvalidUserRoleFallback},
    userRole,
    isAuth,
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, userRole, roles);

  const redirectTo: string = privateRedirectRoute ? privateRedirectRoute : '/';
  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
      ? defaultFallback
      : null;

  /** user must not be authorized */
  if (isAuth) {
    return <Navigate to={redirectTo}/>;
  } else {
    /** user must have the required role that matches a route role */
    if (!userHasRequiredRole) {
      if (InvalidUserRoleFallback)
        return <InvalidUserRoleFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
      else
        return <InvalidUserDefaultFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
    } else {
      /** user is not authorized and roles are OK */
      return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>;
    }
  }

};
