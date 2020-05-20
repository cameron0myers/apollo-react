import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from '@apollo/react-components';
import gql from 'graphql-tag';

import { SignUpLink } from '../SignUp';
import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`; // sign in mutation return the token

const SignInPage = ({ history, refetch }) => (
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} refetch={refetch} />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  login: '',
  password: '',
};

class SignInForm extends Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, signIn) => {
    event.preventDefault();

    signIn().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signIn.token); // store the token

      await this.props.refetch(); // then refetch the graphql data

      this.props.history.push(routes.LANDING); // then go to the landing page
    });
  };

  render() {
    const { login, password } = this.state;

    const isInvalid = password === '' || login === ''; // validation

    return (
      <Mutation mutation={SIGN_IN} variables={{ login, password }}>
        {(signIn, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, signIn)}>
            <input
              name="login"
              value={login}
              onChange={this.onChange}
              type="text"
              placeholder="Email or Username"
            />
            <input
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <button disabled={isInvalid || loading} type="submit">
              Sign In
            </button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

export default withRouter(SignInPage); // withRouter pass the routing context to SignInPage (history, router, etc)

export { SignInForm };
