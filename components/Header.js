import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MapIcon from '@material-ui/icons/Map';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountIcon from '@material-ui/icons/AccountCircle';
import ExitIcon from '@material-ui/icons/ExitToApp';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  toolbar: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    paddingRight: 0,
  },
  avatar: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.unit,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

class Header extends React.Component {
  static propTypes = {
    classes: PropTypes.shape().isRequired,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      avatarUrl: PropTypes.string,
    }).isRequired,
  };

  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  logout = () => {
    window.location = '/logout';
  };

  render() {
    const { user, classes } = this.props;
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    return (
      <div>
        <AppBar color="primary"
                position="fixed">
          <Toolbar variant="dense"
                   className={classes.toolbar}>
            <Link href="/">
              <a style={{
                color: '#fff',
                flexGrow: 1,
                fontWeight: 700,
              }}>
                <Typography variant="h6"
                            color="inherit">
                  MediexFoodie
                </Typography>
              </a>
            </Link>
            <div className={classes.sectionDesktop}>
              <Button color="inherit"
                      onClick={() => Router.push('/')}>
                <ListIcon/>
              </Button>
              <Button color="inherit"
                      onClick={() => Router.push('/map')}>
                <MapIcon/>
              </Button>
              <Button color="inherit"
                      aria-owns={isMenuOpen ? 'material-appbar' : null}
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen}>
                <Avatar alt={user.displayName}
                        src={user.avatarUrl}
                        className={classes.avatar}>
                  <AccountIcon/>
                </Avatar>
                {user.displayName}
              </Button>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true"
                          onClick={this.handleMobileMenuOpen}
                          color="inherit">
                <MoreIcon/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Menu anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={isMenuOpen}
              onClose={this.handleMenuClose}>
          <MenuItem disabled>내정보(준비중)</MenuItem>
          <MenuItem onClick={this.logout}>로그아웃</MenuItem>
        </Menu>
        <Menu anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={isMobileMenuOpen}
              onClose={this.handleMobileMenuClose}>
          <MenuItem>
            <ListIcon className={classes.leftIcon}/>
            <p>목록</p>
          </MenuItem>
          <MenuItem>
            <MapIcon className={classes.leftIcon}/>
            <p>지도</p>
          </MenuItem>
          <MenuItem disabled>
            <AccountIcon className={classes.leftIcon}/>
            <p>내정보(준비중)</p>
          </MenuItem>
          <MenuItem onClick={this.logout}>
            <ExitIcon className={classes.leftIcon}/>
            <p>로그아웃</p>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
