import React from 'react';

export interface IRoute {
  /** a valid react-router-dom v6 path */
  path: string;

  /** the component to be rendered under the path */
  component: React.ReactElement;

  /**
   * if route component is lazy loaded using React.lazy() a fallback loading / spinner component can be specified
   * it has higher priority then the `defaultFallback` component
   * */
  fallback?: React.ReactElement;

  /**
   * what roles a user must have in order to view this page,
   * if not provided, then the page can be accessed by every user
   */
  roles?: string[];
}

export interface IRoutesConfig {
  /**
   * defaults to `/`
   * authorized users on public routes will be redirected to this route
   */
  privateRedirectRoute?: string;

  /**
   * defaults to `/`
   * unauthorized users on private routes will be redirected to this route
   */
  publicRedirectRoute?: string;

  /** default fallback component for lazy loaded route components */
  defaultFallback?: React.ReactElement;

  /** fallback component in case the user does not have the required role to access the route */
  InvalidUserRoleFallback?: React.ComponentType<any>

  /** private routes are accessible only by authorized users */
  private?: IRoute[];

  /** public routes are accessible only by unauthorized users */
  public?: IRoute[];

  /** common routes are accessible only by authorized and unauthorized users */
  common?: IRoute[];
}

export interface IRouterContextProps {
  /** routes configuration */
  routes: IRoutesConfig;

  /** authorization state of the user, if not provided only `common` routes will work correspondingly */
  isAuth?: boolean;

  /** current user role that will be validated for accessing a specific route */
  userRole?: string;
}
