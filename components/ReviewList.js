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
  };

  //
  // async handleSubmit() {
  //   try {
  //     const { id, user } = this.props;
  //     const { rating, review, items } = this.state;
  //     if (!(rating || review)) {
  //       throw new Error('별점 혹은 리뷰중 하나를 넣어주세요.');
  //     }
  //     await addReview(id, {
  //       rating,
  //       review,
  //     });
  //     items.push({
  //       rating,
  //       review,
  //       user,
  //     });
  //     this.setState({
  //       items,
  //       rating: null,
  //       review: '',
  //     });
  //     Router.push(`/review?id=${id}`, `/review/${id}`);
  //   } catch (err) {
  //     this.handleError(err.message || err.error);
  //   }
  // }

  render() {
    const { user, items } = this.props;
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
              sm>
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
            <IconButton>
              <EditIcon fontSize="small"/>
            </IconButton>
            <IconButton>
              <DeleteIcon fontSize="small"/>
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
    return (
      <Grid container
            spacing={16}>
        {items.filter((item) => item.review)
          .map(listItem)}
      </Grid>
    );
  }
}

export default ReviewList;
