import type { FallbackProps } from '../types';
import { useAuthReactRouter } from '../hooks';

/**
 * @internal
 */
export const InvalidRolesDefaultFallback: FallbackProps['InvalidRoles'] = ({ path, roles }) => {
  const { roles: userRole } = useAuthReactRouter();

  return (
    <>
      <h1>Current user does not have required role to access {path} route</h1>
      <p>
        Current user role: <strong>{userRole}</strong>
      </p>
      <br />
      <p>
        Route required roles:&nbsp;
        <strong>{JSON.stringify(roles)}</strong>
      </p>
    </>
  );
};
