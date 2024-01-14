import { AuthReactRouter, type RoutesConfig, RoutesRoot } from '../';
import { render } from './utils.tsx';
import { fireEvent, waitFor } from '@testing-library/react';
import { Link, Outlet } from 'react-router-dom';
import { expect } from 'vitest';
import { getLazyLoadedPageA } from './__mocks__/utils.ts';

describe('[AuthReactRouter] various configurations', () => {
  it('[routes common] should render correctly', () => {
    const routes: RoutesConfig = {
      common: [
        {
          path: '/a',
          element: (
            <>
              <div data-testid={'a'} />
              <Link to={'/b'} children={'link_to_b'} />
            </>
          ),
        },
        {
          path: '/b',
          element: (
            <>
              <div data-testid={'b'} />
              <Link to={'/a'} children={'link_to_a'} />
            </>
          ),
        },
      ],
    };
    const { getByRole, getByTestId } = render(
      <AuthReactRouter routes={routes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );

    expect(getByTestId('a')).toBeInTheDocument();
    fireEvent.click(getByRole('link', { name: 'link_to_b' }));
    expect(getByTestId('b')).toBeInTheDocument();
    fireEvent.click(getByRole('link', { name: 'link_to_a' }));
    expect(getByTestId('a')).toBeInTheDocument();
  });

  it('[routes nested] should render correctly', async () => {
    const routes: RoutesConfig = {
      common: [
        {
          path: '/',
          element: (
            <>
              <div data-testid={'root'} />
              <Outlet />
            </>
          ),
          routes: [
            {
              index: true,
              element: (
                <>
                  <div data-testid={'index'} />
                  <Link to={'/a'} children={'link_to_a'} />
                </>
              ),
            },
            {
              path: 'a',
              element: (
                <>
                  <div data-testid={'a_root'} />
                  <Link to={'/a/dynamic_param'} children={'link_to_a/dynamic_param'} />
                  <Outlet />
                </>
              ),
              routes: [
                {
                  path: ':id',
                  element: (
                    <>
                      <div data-testid={'dynamic_param_page'} />
                    </>
                  ),
                },
              ],
            },
          ],
        },
      ],
    };
    const { getByRole, getByTestId } = render(
      <AuthReactRouter routes={routes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/'],
        },
      },
    );

    expect(getByTestId('root')).toBeInTheDocument();
    expect(getByTestId('index')).toBeInTheDocument();
    fireEvent.click(getByRole('link', { name: 'link_to_a' }));
    expect(getByTestId('a_root')).toBeInTheDocument();
    fireEvent.click(getByRole('link', { name: 'link_to_a/dynamic_param' }));
    expect(getByTestId('dynamic_param_page')).toBeInTheDocument();
  });

  it('[routes common redirect] should redirect to first common route when accessing routes with wrong authorized state', async () => {
    const authorizedRoutes: RoutesConfig = {
      common: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
        },
      ],
      public: [
        {
          path: '/b',
          element: <div data-testid={'b'} />,
        },
      ],
      private: [
        {
          path: '/c',
          element: <div data-testid={'c'} />,
        },
      ],
    };

    // authorized
    const { getByTestId, rerender } = render(
      <AuthReactRouter authorized routes={authorizedRoutes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/b'],
        },
      },
    );

    expect(getByTestId('a')).toBeInTheDocument();

    const unauthorizedRoutes: RoutesConfig = {
      common: [
        {
          path: '/d',
          element: <div data-testid={'d'} />,
        },
      ],
      public: [
        {
          path: '/e',
          element: <div data-testid={'e'} />,
        },
      ],
      private: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
        },
      ],
    };

    // unauthorized
    rerender(
      <AuthReactRouter authorized={false} routes={unauthorizedRoutes}>
        <RoutesRoot />
      </AuthReactRouter>,
    );
    expect(getByTestId('d')).toBeInTheDocument();
  });

  it('[global fallback] redirect to privateRoute when unauthorized users navigates to private route', () => {
    const routes: RoutesConfig = {
      fallback: {
        privateRoute: '/a',
      },
      public: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
        },
      ],
      private: [
        {
          path: '/b',
          element: <div data-testid={'b'} />,
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized={false} routes={routes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/b'],
        },
      },
    );
    expect(getByTestId('a')).toBeInTheDocument();
  });

  it('[global fallback] redirect to publicRoute when authorized users navigates to public route', () => {
    const routes: RoutesConfig = {
      fallback: {
        publicRoute: '/b',
      },
      public: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
        },
      ],
      private: [
        {
          path: '/b',
          element: <div data-testid={'b'} />,
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized routes={routes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );
    expect(getByTestId('b')).toBeInTheDocument();
  });

  it('[roles] should render page protected by roles', () => {
    const atLeastOneRoleRequired: RoutesConfig = {
      private: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
          roles: ['admin', 'manager'],
        },
      ],
    };
    const { getByTestId, rerender } = render(
      <AuthReactRouter authorized routes={atLeastOneRoleRequired} roles={['admin']}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );
    expect(getByTestId('a')).toBeInTheDocument();

    const allRolesRequired: RoutesConfig = {
      private: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
          roles: ['admin', 'manager'],
          allRolesRequired: true,
        },
      ],
    };

    rerender(
      <AuthReactRouter authorized routes={allRolesRequired} roles={['manager', 'admin']}>
        <RoutesRoot />
      </AuthReactRouter>,
    );
    expect(getByTestId('a')).toBeInTheDocument();
  });

  it('[global fallback] should render InvalidRoles (allRolesRequired: false)', () => {
    const routes: RoutesConfig = {
      fallback: {
        InvalidRoles: () => <div data-testid={'invalid_roles'} />,
      },
      private: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
          roles: ['admin'],
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized routes={routes} roles={['manager']}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );
    expect(getByTestId('invalid_roles')).toBeInTheDocument();
  });

  it('[global fallback] should render InvalidRoles (allRolesRequired: true)', () => {
    const routes: RoutesConfig = {
      fallback: {
        InvalidRoles: () => <div data-testid={'invalid_roles'} />,
      },
      private: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
          roles: ['admin', 'manager'],
          allRolesRequired: true,
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized routes={routes} roles={['admin']}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );
    expect(getByTestId('invalid_roles')).toBeInTheDocument();
  });

  it('[route fallback] should render InvalidRoles', () => {
    const routes: RoutesConfig = {
      private: [
        {
          path: '/a',
          element: <div data-testid={'a'} />,
          roles: ['admin', 'manager'],
          fallback: {
            InvalidRoles: () => <div data-testid={'invalid_roles'} />,
          },
          allRolesRequired: true,
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized routes={routes} roles={['admin']}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );
    expect(getByTestId('invalid_roles')).toBeInTheDocument();
  });

  it('[global fallback] should render Suspense', async () => {
    const PageA = getLazyLoadedPageA(2000);
    const routes: RoutesConfig = {
      fallback: {
        Suspense: <div data-testid={'suspense_global'} />,
      },
      private: [
        {
          path: '/a',
          element: <PageA />,
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized routes={routes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );
    expect(getByTestId('suspense_global')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(getByTestId('page_a')).toBeInTheDocument();
      },
      {
        timeout: 2500,
      },
    );
  });

  it('[route fallback] should render Suspense', async () => {
    const PageA = getLazyLoadedPageA(2000);
    const routes: RoutesConfig = {
      private: [
        {
          path: '/a',
          element: <PageA />,
          fallback: {
            Suspense: <div data-testid={'suspense_route'} />,
          },
        },
      ],
    };
    const { getByTestId } = render(
      <AuthReactRouter authorized routes={routes}>
        <RoutesRoot />
      </AuthReactRouter>,
      {
        wrapperProps: {
          initialEntries: ['/a'],
        },
      },
    );

    expect(getByTestId('suspense_route')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(getByTestId('page_a')).toBeInTheDocument();
      },
      {
        timeout: 2500,
      },
    );
  });
});
