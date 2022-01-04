import React from "react";
import {IRouterCtx} from "../types";
import {RouterContext} from "./Context";


const RouterProvider: React.FC<IRouterCtx> = (props) => {
  const {children, routes, isAuth} = props;

  return <RouterContext.Provider value={{routes, isAuth}}>{children}</RouterContext.Provider>
}

export {RouterProvider}







