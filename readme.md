**auth-react-router** is a wrapper over `react-router-dom` v6 that provides a simple API for configuring `public`, `private` and `common` routes (React suspense ready). I noticed how this code and route pattern was used on most of my projects and it was decided to convert it into a reusable package, that would probably meet most of the routing requirements without a lot of boilerplate.

Note: `react-router-dom` version >= 6 is required

### **Getting Started**

Check out this demo app below in order to get started:

```react
import {AppRouter, Routes} from 'auth-react-router'
import {BrowserRouter} from "react-router-dom";

const App = () => {
  const {isAuth} = useAuthProvider();
  return <BrowserRouter>
    <AppRouter
      isAuth={isAuth} // user auth state
      routes={{
        publicRedirectRoute: '/', // if unauthorized user will access private path, will redirect to /
        privateRedirectRoute: '/', // if authorized user will access public path, will redirect to /
        defaultFallback: <p>loading...</p>, // default fallback (spinner on page change, in case it was not yet loaded)
        public: [{ // unauthorized users only
          path: '/public',
          component: <p>public</p> //  React.lazy(() => import('../pages/Home/HomePage')) will work too
        }],
        private: [{ // authorized users only
          path: '/private',
          component: <p>private</p>
        }],
        common: [{ // authorized and authorized users have access to it
          path: '/',
          component: <p>common</p>
        }, {
          path: '*',
          component: <p>page not found 404</p>
        }]
      }}>
      <Routes/> {/* will have all the defined above routes */}
    </AppRouter>
  </BrowserRouter>
}

export default App
```



`AppRouter` component interface

```typescript
interface IRouterCtx {
  routes: IRoutesConfig; // routes configuration
  isAuth: boolean; // the user auth state
}
```

`routes` configuration interface

```typescript
interface IRoutesConfig {
  privateRedirectRoute: string;
  publicRedirectRoute: string;
  defaultFallback: React.ReactElement; // default fallback component for routes
  private: IRoute[];
  public: IRoute[];
  common: IRoute[];
}
```

`public` routes - authorized users will not have access to `public` routes

`private` routes - unauthorized users will not have access to `private` routes

`common` routes - both, authorized and unauthorized users have access to `common` routes



single route interface `IRoute`

```typescript
interface IRoute {
  path: string; // valid react-router-dom v6 path string
  component: React.ReactElement; // supports lazy loading e.g.: React.lazy(() => import('../pages/Home/HomePage'));
  fallback?: React.ReactElement; // optional fallback for each route, more prioritar then `defaultFallback`
}
```

