import type { FallbackProps, RoutesConfig } from '../types';
import { InvalidRolesDefaultFallback } from '../common';

export const getRoutesConfig = (
  config: RoutesConfig,
): Omit<RoutesConfig, 'fallback'> & {fallback: FallbackProps} => {
  return {
    ...config,
    fallback: {
      privateRoute: config.fallback?.privateRoute ?? config.common?.[0].path ?? '/',
      publicRoute: config.fallback?.publicRoute ?? config.common?.[0].path ?? '/',
      InvalidRoles: config.fallback?.InvalidRoles ?? InvalidRolesDefaultFallback,
      Suspense: config.fallback?.Suspense ?? null,
    },
  };
};
