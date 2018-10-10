import React from 'react';
import Header from '../components/header';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getEateryList } from '../lib/api/eatery';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    eateryList: [],
  };

  async componentDidMount() {
    const eateryList = await getEateryList();
    this.setState({ eateryList });
  }

  render() {
    return (
      <div>
        <Header {...this.props}></Header>
      </div>
    );
  }
}

export default withAuth(withLayout(Index), { loginRequired: true });
