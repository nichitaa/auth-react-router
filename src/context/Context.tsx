import React from 'react';
import {IRouterContextProps} from '../types';

const RouterContext = React.createContext<IRouterContextProps | undefined>(
  undefined
);

export {RouterContext};
