import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOut';

const Navigation = ({ session }) => (
  <div>
    {session && session.me ? (
      <NavigationAuth session={session} /> // if the session is valid, this navigation component rendered
    ) : (
      <NavigationNonAuth /> // if not, this navigation component rendered
    )}
  </div>
);

const NavigationAuth = ({ session }) => ( // navigation for signed in user
  <ul>
    <li>
      <Link to={routes.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={routes.ACCOUNT}>Account ({session.me.username})</Link>
    </li>
    {session && session.me && (
      <li>
        <Link to={routes.APPLICATION}>Application</Link>
      </li>
    )}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => ( // navigation for not signed in user
  <ul>
    <li>
      <Link to={routes.SIGN_IN}>Sign In</Link>
    </li>
    <li>
      <Link to={routes.LANDING}>Landing</Link>
    </li>
  </ul>
);

export default Navigation;
