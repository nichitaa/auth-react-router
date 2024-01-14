import { memo } from 'react';
import { Routes as ReactRouterDomRoutes } from 'react-router-dom';
import { Common, Private, Public } from './index.ts';
import { createNestedRoutes, isDefined } from '../utils';
import { useAuthReactRouter } from '../hooks';

/**
 * Component to mount application routes, can be used anywhere in your application. The important thing is
 * to render it under a {@link AuthReactRouter | `AuthReactRouter`} provider
 *
 * ### Example
 *
 * ```jsx
 * const App = () => {
 *   return (
 *     <AuthReactRouter routes={routes} authorized={authorized}>
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
export const RoutesRoot = memo(() => {
  const { routes, authorized } = useAuthReactRouter();

  return (
    <ReactRouterDomRoutes>
      {createNestedRoutes(Common, routes.common)}
      {isDefined(authorized) && createNestedRoutes(Public, routes.public)}
      {isDefined(authorized) && createNestedRoutes(Private, routes.private)}
    </ReactRouterDomRoutes>
  );
});
