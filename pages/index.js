import PropTypes from 'prop-types';
import withAuth from '../lib/withAuth';

const Index = ({ user }) => (
  <div>
    {user ? user.displayName : ''}
  </div>
);

Index.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
};

Index.defaultProps = {
  user: null,
};

export default withAuth(Index, { loginRequired: true });
