import React, {FC} from 'react';

interface MainProps {
  routeRequiredRoles?: string[];
  currentUserRole?: string[] | string;
}

const InvalidUserDefaultFallback: FC<MainProps> = ({
  routeRequiredRoles,
  currentUserRole,
}) => (
  <>
    <h1>Current user does not have required role to access this page</h1>
    <p>
      Current user role: <strong>{currentUserRole}</strong>
    </p>
    <br />
    <p>
      Route required roles:&nbsp;
      <strong>{JSON.stringify(routeRequiredRoles)}</strong>
    </p>
  </>
);

export default InvalidUserDefaultFallback;