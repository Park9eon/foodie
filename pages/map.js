import React from 'react';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';

class Index extends React.Component {

  render() {
    return (
      <div>
        준비중입니다.
      </div>
    );
  }
}

export default withAuth(withLayout(Index), { loginRequired: true });
