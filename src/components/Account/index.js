import React, { useState } from 'react';
import { Query } from '@apollo/react-components';
import gql from 'graphql-tag';

import withAuthorization from '../Session/withAuthorization';
import ProfileUpdate from './ProfileUpdate';
import ProfileCreate from './ProfileCreate';
import Loading from '../Loading';

const PROFILES = gql`
  query {
    profile {
      id
      fields {
        name
        value
      }
      user {
        email
        username
        id
        createdAt
      }
      applications {
        id
        fields {
          name
          value
        }
      }
    }
  }
`;

const AccountPage = () => {
  // account page is similar with Application page
  const [isCreate, toggleCreate] = useState(false);

  return (
    <div>
      <h1>Account Page</h1>
      <div>
        {!isCreate ? (
          <Query query={PROFILES}>
            {({ data, loading, error }) => {
              if (loading) return <Loading />;

              if (!data || !data.profile) {
                return (
                  <div>
                    There are no profile yet ... Try to create by
                    yourself.
                    <button
                      type="button"
                      onClick={() => toggleCreate(true)}
                    >
                      Create
                    </button>
                  </div>
                );
              }

              return (
                <ProfileUpdate
                  toggleCreate={toggleCreate}
                  fields={data.profile.fields}
                />
              );
            }}
          </Query>
        ) : (
          <ProfileCreate toggleCreate={toggleCreate} />
        )}
      </div>
    </div>
  );
};

export default withAuthorization((session) => session && session.me)(
  AccountPage,
);
