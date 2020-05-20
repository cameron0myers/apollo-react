import React, { Component } from 'react';
import { Query } from '@apollo/react-components';
import gql from 'graphql-tag';

import Loading from '../../Loading';

const APPLICATIONS = gql`
  query {
    applications {
      id
      createdAt
      fields {
        name
        value
      }
      userId
      jobId
      user {
        id
        username
        email
        createdAt
      }
      job {
        id
        url
        company
        createdAt
        source
        platform
      }
    }
  }
`; // get applications using graphql query

const Applications = ({ toggleCreate, isCreate }) => (
  <div>
    <div>
      <button type="button" onClick={() => toggleCreate(true)}>
        Create
      </button>
    </div>
    <Query query={APPLICATIONS}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;

        if (
          !data ||
          !data.applications ||
          !data.applications.length
        ) {
          return (
            <div>
              There are no applications yet ... Try to create one by
              yourself.
            </div>
          );
        }

        return (
          <ApplicationList
            applications={data.applications}
            isCreate={isCreate}
          />
        );
      }}
    </Query>
  </div>
);

const ApplicationList = ({ applications }) => ( // render the applications
  <>
    {applications.map((application) => (
      <div key={application.id}>
        <h5>{`${application.jobId} - ${application.createdAt}`}</h5>
      </div>
    ))}
  </>
);

export default Applications;
