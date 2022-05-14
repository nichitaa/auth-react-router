**`auth-react-router`** is a package that wraps over `react-router-dom` v6 and allows you, to easily define the routes, based on user authorized (`isAuth`) and role (`userRole`) state. It provides a simple API for configuring `public`, `private` and `common` routes (React suspense ready) and it has a simple and advance RBAC configuration.

This code and route pattern is used on most of the projects and would probably meet all the routing requirement for an actual react application. 

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

// define some roles if RBAC is needed
export const roles = {
  ADMIN: 'ADMIN',
  OPERATION: 'OPERATION',
  MANAGER: 'MANAGER',
  REGULAR: 'REGULAR',
};

// routes definition
export const routes: IRoutesConfig = {
  publicRedirectRoute: '/profile', // redirect to `/profile` when authorized is trying to access public routes
  privateRedirectRoute: '/login', // redirect to `/login` when unauthorized user access a private route
  defaultFallback: <MyCustomSpinner />,
  // if the role of the user (`userRole` props) is not contained in the route `roles`
  InvalidUserRoleFallback: ({ currentUserRole, routeRequiredRoles }) => <p>USER HAS NO PERMISSION FOR THIS ROUTE, current user role is {currentUserRole}, required roles: {JSON.stringify(routeRequiredRoles)}</p>,
  public: [
    {
      path: '/public',
      component: <LazyPublicPage />
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
      // role based routing
      // user must have ONE of the bellow roles
      roles: [roles.ADMIN, roles.MANAGER] 
    },
    {
      path: '/profile',
      component: <LazyProfilePage /> // any autorized user can access this route
    },
    {
      path: '/admin_and_operation',
      roles: [roles.ADMIN, roles.OPERATION], 
      allRolesRequired: true, // user must have ADMIN and OPERATION role to access this route
      component: <h1>ADMIN and OPERATION Page</h1>,
    },
    // nested routes example
    {
      path: '/posts',
      component: <>
        <h1>Posts Lists Layout</h1>
        <Outlet/> {/* render outlet (the matched paths) */}
      </>,
      children: [
        {
          index: true,
          component: <h1>a list of posts here...</h1>
        },
        {
          path: 'create',
          component: <h1>create new post</h1>
    	},
        {
          path: ':id',
          component: <>
            Single post page layout
            <Outlet/>
          </>,
          children: [
            {
              index: true,
              component: <h1>post details</h1>
            },
            {
              path: 'update',
              component: <h1>update post with dynamic :id</h1>
            }
          ]
        }
      ]
    }
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
import { routes, roles } from './routes';

export const App = () => {
  const { isAuth } = useAuthProvider();
  return (
    <BrowserRouter>
      {/* `userRole` is optional, use it only if at least one Route has the `roles` property */}
      {/* `userRole` can be an array of roles too, usually you will fetch it from an API and set it here */}
      <AppRouter isAuth={isAuth} routes={routes} userRole={roles.ADMIN}>
        {/* Wrap `Routes` component into a Layout component or add Header */}
        <Routes />
      </AppRouter>
    </BrowserRouter>
  );
};
```

**That is it, super easy!**

To add a new route just add it to `public`, `private` or `common` array and it will work. 

**Check out [example](./example) directory for a demo application (includes all most of the described features).**

```bash
$ git clone https://github.com/nichitaa/auth-react-router # clone repo
$ npm i # install library dependencies
$ npm start # build the library `dist` folder

$ cd example
$ npm i # install demo app dependencies 
$ npm run dev # see live changes for demo app
```

### **Hooks**

### `useCheckRole`

Validate current user role with some given roles. This way is easy to dynamically render the UI, block or allow some of your application functionalities in dependence with user role.

`useCheckRole` arguments:

```typescript
requiredRoles: string | string[]; // role/roles to check against 
allRolesRequired?: boolean; // if user must have all roles to have access to resource
```

`useCheckRole` return:

```typescript
interface IUseCheckRoleReturn {
  isAllowed?: boolean; // eighter user has required permission or not
  userRole?: string[] | string; // current user permission
}
```

**usage:**

```jsx
const Component = () => {
  const { isAllowed, userRole } = useCheckRole(roles.OPERATION);
  // render UI based on isAllowed flag
  return <h1>Component {isAllowed && <p>and isAllowed</p>}</h1>;
};
```

```jsx
const Component = () => {
  const { isAllowed, userRole } = useCheckRole(['OPERATION', 'ADMIN']); // should have only one of them
  return <h1>Component {isAllowed && <p>and isAllowed</p>}</h1>;
};
```

```jsx
const Component = () => {
  const { isAllowed, userRole } = useCheckRole(['OPERATION', 'ADMIN'], true); // should have both roles
  return <h1>Component {isAllowed && <p>and isAllowed</p>}</h1>;
};
```

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
  path?: string;

  /** the component to be rendered under the path */
  component: React.ReactElement;
    
  /** if this is a route definition for index path */
  index?: boolean;
   
  /** used for nested (aka children) routes definition */
  children?: IRoute[];

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
    
  /**
   * user must have all roles from `roles` array to access the route,
   * defaults to `false` 
   */
  allRolesRequired?: boolean;
}
```

