import React, {FC, ReactElement, Suspense, useContext} from 'react';
import {IRouteProps} from "../types";
import {RouterContext} from "../context/Context";

export const Common: FC<IRouteProps> = (props): ReactElement => {
  const {component, fallback} = props;
  const ctx = useContext(RouterContext);

  const {routes: {defaultFallback}} = ctx!;
  return <Suspense fallback={fallback ? fallback : defaultFallback}>{component}</Suspense>;
}