import React from 'react';
import { IRouterContextProps } from '../types';
import { RouterContext } from './context';

const RouterProvider = (props: IRouterContextProps) => {
  const { children, routes, isAuth, userRole } = props;

  return (
    <RouterContext.Provider value={{ routes, isAuth, userRole }}>
      {children}
    </RouterContext.Provider>
  );
};

export { RouterProvider };
