import React from 'react';
import { Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';
import ApplicationPage from '../Application';
import withSession from '../Session/withSession';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

const App = ({ session, refetch }) => (
  // pass your own history handler
  <Router history={history}>
    <div>
      {/* navigation */}
      <Navigation session={session} />

      <hr />

      {/* routes */}
      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUpPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignInPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
      <Route
        exact
        path={routes.APPLICATION}
        component={() => <ApplicationPage />}
      />
    </div>
  </Router>
);

export default withSession(App);
