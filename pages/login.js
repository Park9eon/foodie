import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import withAuth from '../lib/withAuth';

function Login({ url }) {
  const next = (url.query && url.query.next) || '';
  return (
    <Button
      variant="raised"
      href={`/auth/google?next=${next}`}
    >
회사 구글 계정으로 로그인
    </Button>
  );
}

Login.propTypes = {
  url: PropTypes.shape({
    query: PropTypes.shape({
      next: PropTypes.string,
    }),
  }).isRequired,
};

export default withAuth(Login, { logoutRequired: true });
