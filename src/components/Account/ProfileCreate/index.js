import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const CREATE_PROFILE = gql`
  mutation($fields: [FieldInput!]!) {
    createProfile(fields: $fields) {
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

class ProfileCreate extends Component {
  state = {
    fields: [],
  };

  onChange = (event, id, name) => {
    const { value } = event.target;
    const updatedFields = [...this.state.fields];
    updatedFields.splice(id, 1, {
      ...updatedFields[id],
      [name]: value,
    });
    this.setState({ fields: updatedFields });
  };

  onAdd = (event) => {
    const { fields } = this.state;

    this.setState({
      fields: [
        ...fields,
        {
          name: '',
          value: '',
        },
      ],
    });
  };

  onSubmit = async (event, createProfile) => {
    event.preventDefault();

    try {
      await createProfile();
      this.props.toggleCreate(false);
    } catch (error) {}
  };

  render() {
    const { fields } = this.state;

    const renderFields = (fields) =>
      fields.map(({ name, value }, i) => (
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
      ));

    return (
      <Mutation
        mutation={CREATE_PROFILE}
        variables={{ fields }}
      >
        {(createProfile, { loading, error }) => (
          <div>
            {renderFields(fields)}
            <button
              type="button"
              onClick={this.onAdd}
              disabled={loading}
            >
              Add Field
            </button>
            <button
              type="button"
              onClick={(event) =>
                this.onSubmit(event, createProfile)
              }
              disabled={loading}
            >
              Send
            </button>
            {error && <ErrorMessage error={error} />}
          </div>
        )}
      </Mutation>
    );
  }
}

export default ProfileCreate;
