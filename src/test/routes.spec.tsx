import { AuthReactRouter, RoutesRoot } from '../';
import { render, screen } from './utils.tsx';

describe('[AuthReactRouter] routes configurations', async () => {
  it('should render common page', async () => {
    render(
      <AuthReactRouter
        routes={{
          common: [
            {
              path: '/',
              element: <>[common] /</>,
            }],
        }}
      >
        <RoutesRoot />
      </AuthReactRouter>, {
        wrapperProps: {
          initialEntries: ['/'],
        },
      });
    expect(screen.getByText('[common] /')).toBeInTheDocument();
  });

  it('should redirect to private route', async () => {
    render(
      <AuthReactRouter
        authorized
        routes={{
          public: [
            {
              path: '/public',
              element: <>[public] /</>,
            },
          ],
          private: [
            {
              path: '/',
              element: <>[private] /</>,
            }],
        }}
      >
        <RoutesRoot />
      </AuthReactRouter>, {
        wrapperProps: {
          initialEntries: ['/public'],
        },
      });
    expect(screen.getByText('[private] /')).toBeInTheDocument();
  });

  it('should redirect to public route', async () => {
    render(
      <AuthReactRouter
        authorized={false}
        routes={{
          fallback: {
            privateRoute: '/public',
          },
          public: [
            {
              path: '/public',
              element: <>[public] /</>,
            },
          ],
          private: [
            {
              path: '/',
              element: <>[private] /</>,
            }],
        }}
      >
        <RoutesRoot />
      </AuthReactRouter>, {
        wrapperProps: {
          initialEntries: ['/'],
        },
      });
    expect(screen.getByText('[public] /')).toBeInTheDocument();
  });

  it('should redirect to common route', async () => {
    render(
      <AuthReactRouter
        authorized={false}
        routes={{
          common: [
            {
              path: '/common',
              element: <>[common] /</>,
            },
          ],
          public: [
            {
              path: '/public',
              element: <>[public] /</>,
            },
          ],
          private: [
            {
              path: '/private',
              element: <>[private] /</>,
            }],
        }}
      >
        <RoutesRoot />
      </AuthReactRouter>, {
        wrapperProps: {
          initialEntries: ['/private'],
        },
      });
    expect(screen.getByText('[common] /')).toBeInTheDocument();
  });

  it('should render InvalidRoles globally configured', async () => {
    render(
      <AuthReactRouter
        authorized={true}
        routes={{
          fallback: {
            InvalidRoles: () => <>[InvalidRoles] custom</>,
          },
          private: [
            {
              path: '/private',
              element: <>[private] /</>,
              roles: ['admin'],
            }],
        }}
      >
        <RoutesRoot />
      </AuthReactRouter>, {
        wrapperProps: {
          initialEntries: ['/private'],
        },
      });
    expect(screen.getByText('[InvalidRoles] custom')).toBeInTheDocument();
  });

});