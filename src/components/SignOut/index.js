import React from 'react';
import { ApolloConsumer } from '@apollo/react-components';

import * as routes from '../../constants/routes';
import history from '../../constants/history'; // import for managing history

const SignOutButton = () => (
  // apollo comsumer pass the client to the child
  <ApolloConsumer>
    {client => (
      <button type="button" onClick={() => signOut(client)}>
        Sign Out
      </button>
    )}
  </ApolloConsumer>
);

const signOut = client => {
  localStorage.removeItem('token'); // remove token
  client.resetStore(); // reset the graphql cache store
  history.push(routes.SIGN_IN); // after sign out go to sign in page
};

export { signOut };

export default SignOutButton;
