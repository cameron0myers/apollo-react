import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Mutation } from '@apollo/react-components';
import gql from 'graphql-tag';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

const SIGN_UP = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
    }
  }
`;// signup mutation return token

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

const SignUpPage = ({ history, refetch }) => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm history={history} refetch={refetch} />
  </div>
);

class SignUpForm extends Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, signUp) => {
    event.preventDefault();

    signUp().then(async ({ data }) => { // after signed up store the token to localStorage
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signUp.token);

      await this.props.refetch(); // then refetch the graphql data

      this.props.history.push(routes.LANDING); // then go to landing page
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
    } = this.state;

    const isInvalid =
      password !== passwordConfirmation ||
      password === '' ||
      email === '' ||
      username === ''; // validation

    return (
      <Mutation
        mutation={SIGN_UP}
        variables={{ username, email, password }}
      >
        {(signUp, { data, loading, error }) => (
          // pass the signUp mutation to onSubmit
          <form onSubmit={event => this.onSubmit(event, signUp)}> 
            <input
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <input
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
            <button disabled={isInvalid || loading} type="submit">
              Sign Up
            </button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUpPage);

export { SignUpLink };
