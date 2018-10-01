import React from 'react';
import withAuth from '../lib/withAuth';

class Index extends React.Component {
  constructor() {
    super();

    this.eateryList = [];
  }

  componentDidMount() {
    this.eateryList = [];
  }

  render() {
    return (
      <div>
        <section className="eatery-list">
          <ul>
            {this.eateryList.map(eatery => (
              <li>
                <div>
                  {eatery.name}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="eatery-map">
          NONE
        </section>
      </div>
    );
  }
}

export default withAuth(Index, { loginRequired: true });
