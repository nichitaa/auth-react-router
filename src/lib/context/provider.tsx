import type { AuthReactRouterProps } from '../types';
import { useMemo } from 'react';
import { getRoutesConfig } from '../utils';
import { AuthReactRouterContext, type AuthReactRouterContextValue } from '../context';

/**
 * AuthReactRouter Provider
 *
 * ### Example
 * ```jsx
 * const App = () => {
 *   const {isAuthorized, userRoles} = useAuthProvider();
 *
 *   return (
 *     <AuthReactRouter routes={routes} authorized={isAuthorized} roles={userRoles}>
 *       <Header />
 *       <Layout>
 *         <RoutesRoot />
 *       </Layout>
 *     </AuthReactRouter>
 *   );
 * }
 * ```
 *
 * @category Component
 */
export const AuthReactRouterProvider = ({
  children,
  authorized,
  roles,
  routes,
}: AuthReactRouterProps) => {

  const value: AuthReactRouterContextValue = useMemo(
    () => ({
      authorized,
      roles,
      routes: getRoutesConfig(routes),
    }),
    [authorized, roles, routes],
  );

  return (
    <AuthReactRouterContext.Provider value={value}>{children}</AuthReactRouterContext.Provider>
  );
};
