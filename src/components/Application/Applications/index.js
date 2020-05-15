import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../../Loading';

const APPLICATIONS = gql`
  query {
    applications {
      fields {
        name
        value
      }
      id
      createdAt
      userId
      jobId
    }
  }
`;

const APPLICATION_CREATED = gql`
  subscription {
    applicationCreated {
      application {
        fields {
          name
          value
        }
        id
        createdAt
        userId
        jobId
      }
    }
  }
`;

const Applications = ({ toggleCreate }) => (
  <div>
    <div>
      <button type="button" onClick={() => toggleCreate(true)}>
        Create
      </button>
    </div>
    <Query query={APPLICATIONS}>
      {({ data, loading, error, subscribeToMore }) => {
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
            subscribeToMore={subscribeToMore}
          />
        );
      }}
    </Query>
  </div>
);

class ApplicationList extends Component {
  subscribeToMoreApplication = () => {
    this.props.subscribeToMore({
      document: APPLICATION_CREATED,
      updateQuery: (previousResult, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previousResult;
        }

        const { applicationCreated } = subscriptionData.data;

        console.log('created');
        return {
          ...previousResult,
          applications: [
            ...previousResult.applications,
            applicationCreated.application,
          ],
        };
      },
    });
  };

  componentDidMount() {
    this.subscribeToMoreApplication();
  }

  render() {
    const { applications } = this.props;

    return applications.map((application) => (
      <div key={application.id}>
        <h5>{`${application.jobId} - ${application.createdAt}`}</h5>
      </div>
    ));
  }
}

export default Applications;
