import { AuthReactRouter, RoutesRoot } from '@nichitaa/auth-react-router';
import { roles, routes } from './routes';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReRenderer } from './re-renderer.tsx';

const App = () => {
  const [s, setS] = useState(1)
  const [isAuth, setIsAuth] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([roles.OPERATION]);
  const navigate = useNavigate();
  const location = useLocation() as { state: { from?: { pathname?: string } }; pathname: string };

  useEffect(() => {
    if (isAuth) {
      // returnUrl is the last private route that user tried to access, but it was unauthorized, and it was redirected to `/login`
      // so if user logins successfully, then we should redirect it on that route, instead of the default `/home` path
      const returnUrl = location.state?.from?.pathname;
      if (returnUrl) {
        navigate(returnUrl);
      }
    }
  }, [isAuth]);

  // login - logout functionality
  const toggleIsAuth = () => {
    setIsAuth((prev) => !prev);
  };

  console.log('app.tsx rerender');
  return (
    <AuthReactRouter
      routes={routes}
      authorized={isAuth}
      roles={userRoles}
    >
      some defaults:
      <ul>
        <li>
          <Link to={'/login'}>/login</Link>
        </li>

        <li>
          <Link to={'/public'}>/public</Link>
        </li>
        <li>
          <Link to={'/home'}>/home</Link>
        </li>
        <li>
          <Link to={'/private'}>/private</Link>
        </li>
        <li>
          <Link to={'/private/1'}>/private/:id</Link>
        </li>
        <li>
          <Link to={'/private/create'}>/private/create</Link>
        </li>
        <li>
          <Link to={'/private/1/update'}>/private/:id/update</Link>
        </li>
        <li>
          <Link to={'/common'}>/common</Link>
        </li>
        <li>
          <Link to={'/common/nested'}>/common/nested</Link>
        </li>
        <li>
          <Link to={'/common/nested/more'}>/common/nested/more</Link>
        </li>
        <li>
          <Link to={'/404'}>/404</Link>
        </li>
      </ul>
      <br />
      role based:
      <ul>
        <li>
          <Link to={'/role_admin_or_operation'}>/role_admin_or_operation</Link>
        </li>
        <li>
          <Link to={'/role_admin_and_operation'}>/role_admin_and_operation</Link>
        </li>
      </ul>
      <br />
      with outlet:
      <ul>
        <li>
          <Link to={'/outlet'}>/outlet</Link>
        </li>
        <li>
          <Link to={'/outlet/more'}>/outlet/more</Link>
        </li>
        <li>
          <Link to={'/outlet/less'}>/outlet/less</Link>
        </li>
      </ul>
      <fieldset style={{ minHeight: 100 }}>
        <legend>pages wrapper</legend>
        <RoutesRoot />
      </fieldset>
      <br />
      <ReRenderer/>
      <button onClick={toggleIsAuth}>toggle isAuth</button>
      <button onClick={() => setS(prev => prev + 1)}>{s}</button>
      <button onClick={() => setUserRoles([roles.ADMIN, roles.OPERATION])}>
        set role <code>ADMIN and OPERATION</code>
      </button>
      <button onClick={() => setUserRoles([roles.REGULAR])}>
        set role <code>REGULAR</code>
      </button>
      <button onClick={() => setUserRoles([roles.ADMIN])}>
        set role <code>[ADMIN]</code>
      </button>
      <br />
      <code>isAuth: {JSON.stringify(isAuth)}</code> <br />
      <code>role: {JSON.stringify(userRoles)}</code> <br />
      <code>location.pathname: {location.pathname}</code>
    </AuthReactRouter>
  );
};

export default App;
