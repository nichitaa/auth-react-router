import React, {FC, ReactElement, Suspense, useContext} from 'react';
import {RouterContext} from '../context/Context';
import {IRoute} from '../types';
import {useRole} from "../hooks/useRole.hook";


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
    if (InvalidUserRoleFallback) {
      return <InvalidUserRoleFallback currentUserRole={userRole} routeRequiredRoles={roles}/>
    } else return <p>Routes roles are: {JSON.stringify(roles)}, but current user roles are: {userRole}, and add a
      fallback component here</p>
  }

  return <Suspense fallback={SuspenseFallbackComponent}>{component}</Suspense>;
};
