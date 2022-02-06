import React, {FC, ReactElement, Suspense, useContext} from 'react';
import {RouterContext} from '../context/Context';
import {IRoute} from '../types';
import {useRole} from "../hooks/useRole.hook";
import InvalidUserDefaultFallback from "../shared/InvalidUserDefaultFallback";


export const Common: FC<IRoute> = (props): ReactElement => {
  const {component, fallback, roles, path} = props;
  const ctx = useContext(RouterContext);
  const {
    routes: {defaultFallback, InvalidUserRoleFallback},
    userRole,
  } = ctx!;
  const [userHasRequiredRole] = useRole(path, userRole, roles);

  const SuspenseFallbackComponent = fallback
    ? fallback
    : defaultFallback
      ? defaultFallback
      : null;

  if (!userHasRequiredRole) {
    if (InvalidUserRoleFallback)
      return <InvalidUserRoleFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
    else
      return <InvalidUserDefaultFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
  }

  return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>;
};
