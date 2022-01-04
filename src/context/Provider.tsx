import React from 'react';
import { IRouterContextProps } from '../types';
import { RouterContext } from './Context';

const RouterProvider: React.FC<IRouterContextProps> = (props) => {
  const { children, routes, isAuth } = props;

  return (
    <RouterContext.Provider value={{ routes, isAuth }}>
      {children}
    </RouterContext.Provider>
  );
};

export { RouterProvider };
