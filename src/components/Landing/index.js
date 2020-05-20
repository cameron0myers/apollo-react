import React from 'react';

import withSession from '../Session/withSession';

const Landing = ({ session }) => (
  <div>
    <h2>Landing Page</h2>
  </div>
);

export default withSession(Landing); // landing page ( you can make landing page per signed in user or not signed in user with session )
