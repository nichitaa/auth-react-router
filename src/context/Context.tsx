import React from "react";
import {IRouterCtx} from "../types";

const RouterContext = React.createContext<IRouterCtx | undefined>(undefined)

export {RouterContext};