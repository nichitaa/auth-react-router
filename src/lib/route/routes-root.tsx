import { memo } from 'react';
import { Routes as ReactRouterDomRoutes } from 'react-router-dom';
import { Common, Private, Public } from './index.ts';
import { createNestedRoutes, isDefined } from '../utils';
import { useAuthReactRouter } from '../hooks';

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
