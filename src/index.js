import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-common';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './components/App';
import { signOut } from './components/SignOut';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
}); // configure the graphql backend

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers = { ...headers, Authorization: `Bearer ${token}` };
    }
    return { headers };
  });

  return forward(operation);
}); // configure the auth middleware

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('GraphQL error', message);

      if (message === 'UNAUTHENTICATED') {
        signOut(client);
      }
    });
  }

  if (networkError) {
    console.log('Network error', networkError);

    if (networkError.statusCode === 401) {
      signOut(client);
    }
  }
}); // configure the error handling middleware

const link = ApolloLink.from([authLink, errorLink, httpLink]); // combine all middlewares

const cache = new InMemoryCache(); // use memory cache for client storage

const client = new ApolloClient({
  link,
  cache,
}); // create apollo client

ReactDOM.render(
  // pass the apollo client by provider
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
