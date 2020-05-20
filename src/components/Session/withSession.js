import React from 'react';
import { Query } from '@apollo/react-components';
import { GET_ME } from './queries';

const withSession = Component => props => (
  <Query query={GET_ME}>
    {({ data, refetch }) => (
      <Component {...props} session={data} refetch={refetch} />
    )}
  </Query>
);

export default withSession; // HOC(Higher Order Component) for getting a current session.
