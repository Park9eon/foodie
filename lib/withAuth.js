import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

let globalUser = null;

export default function withAuth(
  BaseComponent,
  { loginRequired = true, logoutRequired = false, adminRequired = false } = {},
) {
  class App extends React.PureComponent {
    static propTypes = {
      user: PropTypes.shape({
        _id: PropTypes.string,
      }),
      isFromServer: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      user: null,
    };

    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      const user = ctx.req ? ctx.req.user && ctx.req.user.toObject() : globalUser;

      if (isFromServer && user) {
        user._id = user._id.toString();
      }

      const props = {
        user,
        isFromServer
      };

      if (BaseComponent.getInitialProps) {
        Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {});
      }
      return props;
    }

    componentDidMount() {
      const { user } = this.props;

      if (this.props.isFromServer) {
        globalUser = this.props.user;
      }

      if (loginRequired && !logoutRequired && !user) {
        window.location = '/login';
        return;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        Router.push('/');
      }

      if (logoutRequired && user) {
        Router.push('/');
      }

      if (user && window.gtag) {
        window.gtag('set', { user_id: user._id });
      }
    }

    render() {
      const { user } = this.props;

      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      return <BaseComponent {...this.props} />;
    }
  }

  return App;
}
