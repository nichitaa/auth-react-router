**`@nichitaa/auth-react-router`** is a lightweight package that uses and extends basic `react-router-dom` v6
functionality and allows you to define the routes based on user `authorized` and `roles` states. It provides a simple
API for configuring `public`, `private` and `common` routes, and it has a simple and advance RBAC configuration.


This code and routing pattern is used on most of my personal projects and would probably meet most of the routing
requirement for any other react application, but beware and use it at your own risk.

### Getting Started 🎉
#### Peer Dependencies 🔨

* `react`: `>=16`,
* `react-dom`: `>=16`,
* `react-router-dom`: `^6.x`

#### Installation ✨
```shell
npm install @nichitaa/auth-react-router
```

#### Example

Define your application routes *(easier to maintain if are in separate file)

```JSX
// src/routes.tsx
import { RoutesConfig } from '@nichitaa/auth-react-router';
import { Outlet } from 'react-router-dom';
import { lazy } from 'react';

/**
 * using normal `imports` or `lazy`
 */
import PageA from '../pages/LoginPage.tsx';

const LazyPageB = lazy(() => import('../pages/PageB'));
const LazyPageC = lazy(() => import('../pages/PageC'));
const LazyPageD = lazy(() => import('../pages/PageD'));

/**
 * optionally define roles (if you want to use RBAC functionality)
 */
export const roles = {
  ADMIN: 'ADMIN',
  OPERATION: 'OPERATION',
  MANAGER: 'MANAGER',
  REGULAR: 'REGULAR',
} as const;


/** routes definition */
export const routes: RoutesConfig = {
  /**
   * globally configured fallbacks (can be configured at route level too)
   */
  fallback: {
    /**
     * if user is on private route and has `authorized: false`, then he probably should be redirectied to a public route
     * and vice-versa, if those route fallbacks are not provided, default one is first common route (common[0].path)
     */
    privateRoute: '/b', 
    publicRoute: '/c',
    InvalidRoles: route => <GlobalInvalidRoute {...route} />,
    Suspense: <>...loading page...</>,
  },
  /**
   * common routes (accessible by all users)
   */
  common: [
    {
      path: '/',
      element: <>Route available for all users</>,
    },
    {
      path: '*',
      element: <p>PAGE NOT FOUND 404</p>,
    },
  ],
  /**
   * public paths (accessible only by users with `authorized: false`)
   */
  public: [
    {
      path: '/b',
      // with <Outlet/>
      element: <>
        <CustomLayout>
          <Outlet />
        </CustomLayout>
      </>,
      // nested routes
      routes: [
        {
          index: true,
          element: <LazyPageB />,
        },
        {
          path: ':id',
          element: <LazyPageC />,
        },
      ],
    },
  ],
  /**
   * private paths (accessible only by users with `authorized: true`)
   */
  private: [
    {
      path: '/c',
      element: <>Private page protected by all roles</>,
      roles: [roles.ADMIN, roles.MANAGER],
      allRolesRequired: true,
    },
    {
      path: '/c',
      element: <>Private page protected by at least one role</>,
      roles: [roles.OPERATION, roles.MANAGER],
    },
    {
      path: '/d',
      element: <LazyPageD />,
      roles: [roles.OPERATION, roles.MANAGER],
      // Private route with its own fallbacks
      fallback: {
        Suspense: <>...loading page for private route /d...</>,
        InvalidRoles: (route) => <>:( could not access route /d</>,
        /**
         *  fallback route if unauthroized user tryies to access `/d` route,
         *  usually you'd want to redirect him to a public/common page (a page that he has access to)
         */
        route: '/b',
      },
    },
  ],
};
```

Configure `AuthReactRouter` and render `RoutesRoot`

```JSX
import { AuthReactRouter, RoutesRoot } from '@nichitaa/auth-react-router';
import { BrowserRouter } from 'react-router-dom';
import { routes, roles } from './routes';

export const App = () => {
  const { isAuthorized, userRoles } = useAuthProvider();
  return (
    <BrowserRouter>
      <AppRouter authorized={isAuthorized} routes={routes} roles={userRoles}>
        <RoutesRoot />
      </AppRouter>
    </BrowserRouter>
  );
};
```

To add a new route just add it to `public`, `private` or `common` array and it will work. 

