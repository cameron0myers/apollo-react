import React, { useState } from 'react';

import withAuthorization from '../Session/withAuthorization';
import Applications from './Applications';
import ApplicationCreate from './ApplicationCreate';

// this component for signed in user
const ApplicationPage = ({ refetch }) => {
  const [isCreate, toggleCreate] = useState(false); // toggle the display creation using useState hook

  return (
    <div>
      <h1>Application Page</h1>
      <div>
        {!isCreate ? (
          <Applications toggleCreate={toggleCreate} />
        ) : (
          <ApplicationCreate toggleCreate={toggleCreate} />
        )}
      </div>
    </div>
  );
};

export default withAuthorization((session) => session && session.me)(
  ApplicationPage,
); // pass the condition & component to withAuthorization HOC
