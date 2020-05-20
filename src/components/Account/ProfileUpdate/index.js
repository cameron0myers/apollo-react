import React, { Component } from 'react';
import { Mutation } from '@apollo/react-components';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const UPDATE_PROFILE = gql`
  mutation($fields: [FieldInput!]!) {
    updateProfile(fields: $fields) {
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

class ProfileUpdate extends Component {
  state = {
    fields: [],
  };

  componentDidMount() {
    const { fields } = this.props;
    this.setState({
      fields: fields.map(({ name, value }) => ({ name, value })), // filtering the attributes
    });
  }

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

  onSubmit = async (event, updateProfile) => {
    event.preventDefault();

    try {
      await updateProfile();
      this.props.toggleCreate(false);
    } catch (error) {}
  };

  render() {
    const { fields } = this.state;

    const renderFields = (data) =>
      data.map(({ name, value }, i) => (
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
      <Mutation mutation={UPDATE_PROFILE} variables={{ fields }}>
        {(updateProfile, { loading, error }) => (
          <div>
            <div>{renderFields(fields)}</div>
            <button
              type="button"
              onClick={this.onAdd}
              disabled={loading}
            >
              Add Field
            </button>
            <button
              type="button"
              onClick={(event) => this.onSubmit(event, updateProfile)}
              disabled={loading}
            >
              Submit
            </button>
            {error && <ErrorMessage error={error} />}
          </div>
        )}
      </Mutation>
    );
  }
}

export default ProfileUpdate;
