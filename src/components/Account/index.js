import React, { useState } from 'react';

import withAuthorization from '../Session/withAuthorization';
import Profile from './Profile';
import ProfileCreate from './ProfileCreate';

const AccountPage = () => {
  const [isCreate, toggleCreate] = useState(false);

  return (
    <div>
      <h1>Account Page</h1>
      <div>
        {!isCreate ? (
          <Profile toggleCreate={toggleCreate} />
        ) : (
          <ProfileCreate toggleCreate={toggleCreate} />
        )}
      </div>
    </div>
  );
};

export default withAuthorization(session => session && session.me)(
  AccountPage,
);
