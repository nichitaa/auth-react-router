import React, {FC, ReactElement, Suspense, useContext, useState, useEffect} from 'react';
import {RouterContext} from '../context/Context';
import {IRoute} from '../types';

const validateUserRole = (userRole: string | undefined, roles: string[] | undefined): boolean => !(roles && roles.length && !userRole);

export const Common: FC<IRoute> = (props): ReactElement => {
  const {component, fallback, roles} = props;
  const ctx = useContext(RouterContext);
  const [userHasRequiredRole, setUserHasRequiredRole] = useState(false);

  const {
    routes: {defaultFallback, invalidUserRoleFallback},
    userRole,
  } = ctx!;

  useEffect(() => {
    console.log('effect roles, userRole', roles, userRole);
    // validate user role before accessing the route
    if (!validateUserRole(userRole, roles)) {
      const msg = `Common route has some roles assigned (${JSON.stringify(roles)}) but the current user configuration does not! (add userRole property to Routes Provider)`;
      console.error(msg);
      throw Error(msg);
    }

    if (userRole && roles && roles.length) {
      const hasRequiredRole = roles.includes(userRole);
      setUserHasRequiredRole(hasRequiredRole);
    } else {
      setUserHasRequiredRole(true);
    }

  }, [roles, userRole])


  const suspenseFallback = fallback
    ? fallback
    : defaultFallback
      ? defaultFallback
      : null;

  if (!userHasRequiredRole) {
    return invalidUserRoleFallback ||
      <p>Routes roles are: {JSON.stringify(roles)}, but current user roles are: {userRole}, and add a fallback component
        here</p>
  }

  return <Suspense fallback={suspenseFallback}>{component}</Suspense>;
};
