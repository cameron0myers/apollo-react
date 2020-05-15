import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../../Loading';

const PROFILE = gql`
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

const Profile = ({ toggleCreate }) => (
  <div>
    <Query query={PROFILE}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;

        if (!data || !data.profile) {
          return (
            <div>
              There are no profile yet ... Try to create by yourself.
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
          <div>
            {data.profile.fields.map(({ name, value }, i) => (
              <div key={i}>
                <span>Name :</span>
                <input
                  value={name}
                  onChange={(e) => this.onChange(e, i, 'name')}
                />
                <span>Value :</span>
                <input
                  value={value}
                  onChange={(e) => this.onChange(e, i, 'value')}
                />
              </div>
            ))}
          </div>
        );
      }}
    </Query>
  </div>
);

export default Profile;
