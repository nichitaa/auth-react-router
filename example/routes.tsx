import { IRoutesConfig, useCheckRole } from '../.';
import { Navigate, useParams, Outlet } from 'react-router-dom';

export const roles = {
  ADMIN: 'ADMIN',
  OPERATION: 'OPERATION',
  REGULAR: 'REGULAR',
};

const NestedPrivatePage = () => {
  const params = useParams();
  const { isAllowed, userRole } = useCheckRole(roles.OPERATION, true);
  console.log('isAllowed: ', isAllowed, userRole);
  // render UI based on isAllowed flag
  return (
    <h1>
      Nested Private Page :id {params.id}{' '}
      {isAllowed && <p>and is allowed to see this</p>}
    </h1>
  );
};

export const routes: IRoutesConfig = {
  publicRedirectRoute: '/login',
  privateRedirectRoute: '/home',
  defaultFallback: <p>loading...</p>,
  InvalidUserRoleFallback: ({ currentUserRole, routeRequiredRoles }) => (
    <p>
      User role: {currentUserRole}, requiredRoles:{' '}
      {JSON.stringify(routeRequiredRoles)}
    </p>
  ),
  public: [
    {
      path: '/login',
      component: <h1>Login page</h1>,
    },
    {
      path: '/public',
      component: <h1>Public Page</h1>,
    },
  ],
  private: [
    {
      path: '/outlet',
      component: (
        <>
          <h1>outlet path (this must be visible)</h1>
          <Outlet />
        </>
      ),
      children: [
        {
          index: true,
          component: <h1>index path</h1>,
        },
        {
          path: 'more',
          component: <h1>more</h1>,
        },
        {
          path: 'less',
          component: <h1>less</h1>,
        },
      ],
    },
    {
      path: '/home',
      component: <h1>Home Page</h1>,
    },
    {
      path: '/private',
      component: (
        <>
          <span>some private layout</span>
          <Outlet />
        </>
      ),
      children: [
        {
          index: true,
          component: <h1>Private Page</h1>,
        },
        {
          path: 'create',
          component: <h1>nested private /create</h1>,
        },
        {
          path: ':id',
          component: <Outlet />,
          children: [
            {
              index: true,
              component: <NestedPrivatePage />,
            },
            {
              path: 'update',
              component: <h1>nested private /:id/update</h1>,
            },
          ],
        },
      ],
    },
    {
      path: '/role_admin_or_operation',
      roles: [roles.ADMIN, roles.OPERATION], // current user must have or ADMIN or OPERATION role to access this route
      component: (
        <h1>
          <code>ADMIN</code> OR <code>OPERATION</code> role Page
        </h1>
      ),
    },
    {
      path: '/role_admin_and_operation',
      roles: [roles.ADMIN, roles.OPERATION], // current user must have ADMIN and OPERATION role to access this route
      allRolesRequired: true,
      component: (
        <h1>
          <code>ADMIN</code> AND <code>OPERATION</code> role Page
        </h1>
      ),
    },
  ],
  common: [
    {
      path: '/',
      component: <Navigate to={'/home'} />,
    },
    {
      path: '/common',
      component: <h1>Common page</h1>,
      children: [
        {
          path: 'nested',
          component: <h1>a nested common path</h1>,
          children: [
            {
              path: 'more',
              component: <h1>need more ?</h1>,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      component: <h1>404 page *</h1>,
    },
  ],
};
