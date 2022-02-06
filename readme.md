**auth-react-router** is a package that wraps over `react-router-dom` v6 and allows you, to easily define the routes, based on user authorized (`isAuth`) and role (`userRole`) state. It provides a simple API for configuring `public`, `private` and `common` routes (React suspense ready).

This code and route pattern is used on most of the projects and would probably meet all the routing requirement for a simple or advance react application. 

Note: `react-router-dom` version >= 6 is required

### **Getting Started**

Define your application routes *(easier to maintain if are in separate file)

```JSX
// routes.tsx

import React from 'react';
import { IRoutesConfig } from 'auth-react-router';
import LoginPage from '../pages/LoginPage.tsx';

// public lazy loaded pages
const LazyPublicPage = React.lazy(() => import('../pages/PublicPage.tsx'));

// private lazy loaded pages
const LazyPrivatePage = React.lazy(() => import('../pages/PrivatePage.tsx'));
const LazyProfilePage = React.lazy(() => import('../pages/ProfilePage.tsx'));


export const routes: IRoutesConfig = {
  publicRedirectRoute: '/profile', // redirect to `/profile` when authorized is trying to access public routes
  privateRedirectRoute: '/login', // redirect to `/login` when unauthorized user access a private route
  defaultFallback: <MyCustomSpinner />,
  // if the role of the user (`userRole` props) is not contained in the route `roles`
  InvalidUserRoleFallback: ({ currentUserRole, routeRequiredRoles }) => <p>USER HAS NO PERMISSION FOR THIS ROUTE, current user role is {currentUserRole}, required roles: {JSON.stringify(routeRequiredRoles)}</p>,
  public: [
    {
      path: '/public',
      component: <LazyPublicPage />,
      roles: ['admin', 'manager'] // role based routing
    },
    {
      path: '/login',
      component: <LoginPage />,
    },
  ],
  private: [
    {
      path: '/private',
      component: <LazyPrivatePage />,
    },
    {
      path: '/profile',
      component: <LazyProfilePage />
    },
  ],
  common: [
    {
      path: '/',
      component: <p>common</p>,
    },
    {
      path: '*',
      component: <p>page not found 404</p>,
    },
  ],
};
```

Link the defined above routes using `AppRouter` component

```JSX
import { AppRouter, Routes } from 'auth-react-router';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './routes';

export const App = () => {
  const { isAuth } = useAuthProvider();
  return (
    <BrowserRouter>
      {/* `userRole` is optional, use it only if at least one Route has the `roles` property */}
      <AppRouter isAuth={isAuth} routes={routes} userRole={'admin'}>
        {/* Wrap `Routes` component into a Layout component or add Header */}
        <Routes />
      </AppRouter>
    </BrowserRouter>
  );
};
```

**That is it, super easy!**

To add a new route just add it to `public`, `private` or `common` array and it will work



### **Router / Routes basic configuration**

`AppRouter` Provider interface

```typescript
export interface IRouterContextProps {
  /** routes configuration */
  routes: IRoutesConfig;

  /** authorization state of the user, if not provided only `common` routes will work correspondingly */
  isAuth?: boolean;

  /** current user role that will be validated for accessing a specific route */
  userRole?: string;
}
```

`routes` configuration interface

```typescript
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
```

single route interface `IRoute`

```typescript
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
```

