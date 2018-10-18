import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import Rating from './Rating';

const styles = theme => ({
  root: {
    padding: `${theme.spacing.unit * 2}px 0`,
  },
});

class ReviewListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    item: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

  render() {
    const { classes, item, user } = this.props;
    return (
      <div className={classes.root}>
        <Grid container
              spacing={8}>
          <Grid item>
            <Avatar
              src={item.user && item.user.avatarUrl || '/static/img_avatar.png'}
            />
          </Grid>
          <Grid item
                sm>
            <Typography variant="h6">{item.user && item.user.displayName}</Typography>
            <Rating value={item.rating}
                    max={5}/>
            <div>
              {item.review}
            </div>
          </Grid>
          {item.user && user._id === item.user._id &&
          <Grid item>
            <IconButton>
              <DeleteIcon/>
            </IconButton>
            <IconButton>
              <EditIcon/>
            </IconButton>
          </Grid>}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ReviewListItem);
