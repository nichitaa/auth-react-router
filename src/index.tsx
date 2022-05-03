/**
 * @author Pasecinic Nichita
 */

import { RouterProvider } from './context/provider';
import { Routes } from './Routes';
import { IRoute, IRoutesConfig } from './types';
import { useCheckRole } from './hooks';

export {
  RouterProvider as AppRouter,
  Routes,
  IRoute,
  IRoutesConfig,
  useCheckRole,
};
