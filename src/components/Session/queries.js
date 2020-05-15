import gql from 'graphql-tag';

export const GET_ME = gql`
  {
    me {
      id
      username
      email
      createdAt
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
      profile {
        userId
        fields {
          name
          value
        }
      }
    }
  }
`;
