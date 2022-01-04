import React from "react";

export interface IRoute {
  path: string;
  component: React.ReactElement;
  fallback?: React.ReactElement;
}

export interface IRouteProps {
  component: React.ReactElement;
  isAuth: boolean;
  fallback?: React.ReactElement
}

export interface IRoutesConfig {
  privateRedirectRoute: string;
  publicRedirectRoute: string;
  defaultFallback: React.ReactElement;
  private: IRoute[];
  public: IRoute[];
  common: IRoute[];
}

export interface IRouterCtx {
  routes: IRoutesConfig;
  isAuth: boolean;
}
