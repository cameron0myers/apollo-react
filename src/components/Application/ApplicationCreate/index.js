import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const CREATE_APPLICATION = gql`
  mutation($fields: [FieldInput!]!, $jobId: String!) {
    createApplication(fields: $fields, jobId: $jobId) {
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
`;

const GET_ALL_JOBS = gql`
  query {
    jobs {
      id
      url
      company
      createdAt
      source
      platform
    }
  }
`;

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
`;

class ApplicationCreate extends Component {
  state = {
    jobId: '',
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

  onJobSelected = (event) => {
    this.setState({ jobId: event.target.value });
  };

  onSubmit = async (event, createApplication) => {
    event.preventDefault();

    try {
      await createApplication();
      this.props.toggleCreate(false);
    } catch (error) {}
  };

  update = (caches, { data: { createApplication } }) => {
    const applications = caches.readQuery({ query: APPLICATIONS });
    caches.writeQuery({
      query: APPLICATIONS,
      data: { applications: applications.concat([createApplication]) },
    });
  }

  render() {
    const { jobId, fields } = this.state;

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

    const renderSelect = ({ data, loading, error }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <select name="job" onChange={this.onJobSelected} value={jobId}>
          {data.jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {`${job.company} - ${job.source}`}
            </option>
          ))}
          <option key={'null'} value={''}></option>
        </select>
      );
    };

    return (
      <Mutation
        mutation={CREATE_APPLICATION}
        update={this.update}
        variables={{ fields, jobId }}
      >
        {(createApplication, { loading, error }) => (
          <div>
            <div>
              <Query query={GET_ALL_JOBS}>{renderSelect}</Query>
            </div>
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
                this.onSubmit(event, createApplication)
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

export default ApplicationCreate;
