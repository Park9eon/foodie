import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid/Grid';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Rating from './Rating';

class ReviewList extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape())
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  render() {
    const { user, items, onClick } = this.props;
    const listItem = (item) => (
      <Grid item
            key={item._id}
            xs={12}
            container
            spacing={8}>
        <Grid item>
          <Avatar alt={item.user.displayName}
                  src={item.user.avatarUrl}>
            <AccountIcon/>
          </Avatar>
        </Grid>
        <Grid item
              xs>
          <Typography variant="h6">{item.user.displayName}</Typography>
          <Rating value={item.rating}
                  max={5}/>
          <div>
            {item.review}
          </div>
        </Grid>
        {item.user && user._id === item.user._id
        && (
          <Grid item>
            <IconButton onClick={() => onClick && onClick({ review: item, event: 'edit' })}>
              <EditIcon fontSize="small"/>
            </IconButton>
            {/*<IconButton onClick={() => onClick && onClick({ review: item, event: 'delete' })}>*/}
              {/*<DeleteIcon fontSize="small"/>*/}
            {/*</IconButton>*/}
          </Grid>
        )}
      </Grid>
    );
    return (
      <Grid container
            spacing={16}>
        {items.filter((item) => (item.user))
          .map(listItem)}
      </Grid>
    );
  }
}

export default ReviewList;
