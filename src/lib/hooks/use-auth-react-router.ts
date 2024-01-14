import { useContext, useMemo } from 'react';
import { assertIsDefined } from '../utils';
import { AuthReactRouterContext } from '../context';

/**
 * @category Hook
 */
export const useAuthReactRouter = () => {
  const ctx = useContext(AuthReactRouterContext);
  assertIsDefined(ctx, `useAuthReactRouter must be inside a AuthReactRouter`);

  return useMemo(() => ctx, [ctx]);
};
