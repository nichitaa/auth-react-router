**auth-react-router** is a wrapper over `react-router-dom` v6 that provides a simple API for configuring `public`, `private` and `common` routes (React suspense ready). I noticed how this code and route pattern was used on most of my projects and it was decided to convert it into a reusable package, that would probably meet most of the routing requirements without a lot of boilerplate.

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
  public: [
    {
      path: '/public',
      component: <LazyPublicPage />,
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
      <AppRouter isAuth={isAuth} routes={routes}>
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
}
```

