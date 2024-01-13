import { RoutesConfig, useAuthReactRouter } from '@nichitaa/auth-react-router';
import { Navigate, useParams, Outlet } from 'react-router-dom';

export const roles = {
  ADMIN: 'ADMIN',
  OPERATION: 'OPERATION',
  REGULAR: 'REGULAR',
};

const NestedPrivatePage = () => {
  const params = useParams();

  // render UI based on isAllowed flag
  return <h1>Nested Private Page :id {params.id} </h1>;
};

export const routes: RoutesConfig = {
  fallback: {
    privateRoute: '/login',
    publicRoute: '/home',
    Suspense: <>...loading...</>,
    InvalidRoles: ({ roles }) => {
      const state = useAuthReactRouter();
      console.log(state);
      return (
        <p>
          User role: {state.roles}, requiredRoles: {JSON.stringify(roles)}
        </p>
      );
    },
  },
  public: [
    {
      path: '/login',
      element: <h1>Login page</h1>,
    },
    {
      path: '/public',
      element: <h1>Public Page</h1>,
    },
  ],
  private: [
    {
      path: '/outlet',
      element: (
        <>
          <h1>outlet path (this must be visible)</h1>
          <Outlet />
        </>
      ),
      routes: [
        {
          index: true,
          element: <h1>index path</h1>,
        },
        {
          path: 'more',
          element: <h1>more</h1>,
        },
        {
          path: 'less',
          element: <h1>less</h1>,
        },
      ],
    },
    {
      path: '/home',
      element: <h1>Home Page</h1>,
    },
    {
      path: '/private',
      element: (
        <>
          <span>some private layout</span>
          <Outlet />
        </>
      ),
      fallback: {
        route: '/public',
      },
      routes: [
        {
          index: true,
          element: <h1>Private Page</h1>,
        },
        {
          path: 'create',
          element: <h1>nested private /create</h1>,
        },
        {
          path: ':id',
          element: <Outlet />,
          routes: [
            {
              index: true,
              element: <NestedPrivatePage />,
            },
            {
              path: 'update',
              element: <h1>nested private /:id/update</h1>,
            },
          ],
        },
      ],
    },
    {
      path: '/role_admin_or_operation',
      roles: [roles.ADMIN, roles.OPERATION], // current user must have or ADMIN or OPERATION role to access this route
      element: (
        <h1>
          <code>ADMIN</code> OR <code>OPERATION</code> role Page
        </h1>
      ),
    },
    {
      path: '/role_admin_and_operation',
      roles: [roles.ADMIN, roles.OPERATION], // current user must have ADMIN and OPERATION role to access this route
      allRolesRequired: true,
      element: (
        <h1>
          <code>ADMIN</code> AND <code>OPERATION</code> role Page
        </h1>
      ),
    },
  ],
  common: [
    {
      path: '/',
      element: <Navigate to={'/home'} />,
    },
    {
      path: '/common',
      element: (
        <>
          common page layout <Outlet />
        </>
      ),
      // roles: [roles.ADMIN],
      routes: [
        {
          index: true,
          element: <h1>Common page</h1>,
        },
        {
          path: 'nested',
          element: <Outlet />,
          routes: [
            {
              index: true,
              element: <h1>a nested common path</h1>,
            },
            {
              path: 'more',
              element: <h1>need more ?</h1>,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <h1>404 page *</h1>,
    },
  ],
};
