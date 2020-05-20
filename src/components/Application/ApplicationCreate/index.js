import React, { Component } from 'react';
import { Mutation, Query } from '@apollo/react-components';
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
`; // createApplication mutation for creating an application

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
`; // query for getting all job listings

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
`; // query for getting all applications

class ApplicationCreate extends Component {
  state = {
    jobId: '',
    fields: [],
  };

  onChange = (event, id, name) => {
    const { value } = event.target;
    const updatedFields = [...this.state.fields];
    updatedFields.splice(id, 1, {
      // update the array using splice
      ...updatedFields[id],
      [name]: value,
    });
    this.setState({ fields: updatedFields });
  }; // input change handling

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
  }; // add a field to the application

  onJobSelected = (event) => {
    this.setState({ jobId: event.target.value });
  }; // job select handling

  onSubmit = async (event, createApplication) => {
    event.preventDefault(); // block the auto form submit

    try {
      await createApplication(); // call createApplication mutation for creating new application
      this.props.toggleCreate(false); // after submitting, toggle the isCreate variable
    } catch (error) {}
  };

  update = (caches, { data: { createApplication } }) => {
    // after create update the graphql cache storage
    const { applications } = caches.readQuery({
      query: APPLICATIONS,
    });
    caches.writeQuery({
      query: APPLICATIONS,
      data: {
        applications: applications.concat([createApplication]),
      },
    });
  };

  render() {
    const { jobId, fields } = this.state;

    const renderFields = (
      data, // rendering fields
    ) =>
      data.map(({ name, value }, i) => (
        <div key={i}>
          <span>Name :</span>
          <input
            value={name}
            onChange={(e) => this.onChange(e, i, 'name')} // onChange(event, index of this object in the array, the key of this value in the object)
          />
          <span>Value :</span>
          <input
            value={value}
            onChange={(e) => this.onChange(e, i, 'value')}
          />
        </div>
      ));
    // [
    //   {name: 'Name', value: 'Bill Gates'},
    //   {name: 'Email', value: 'bill@microsift.com'},
    // ]

    const renderSelect = ({ data, loading, error }) => {
      // rendering job select component
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <select
          name="job"
          onChange={this.onJobSelected}
          value={jobId}
        >
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
      <Mutation // pass the graphql mutation and update function to props. the update function is called after the end of mutation call
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
              Submit
            </button>
            {error && <ErrorMessage error={error} />}
          </div>
        )}
      </Mutation>
    );
  }
}

export default ApplicationCreate;
