import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import Rating from './Rating';
import { getRating } from '../lib/utlis';

const styles = theme => ({
  imageWrapper: {
    width: '100%',
    height: '123px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

class HorizontalListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    item: PropTypes.shape({
      _id: PropTypes.string
        .isRequired,
      name: PropTypes.string
        .isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  render() {
    const { className, classes, item } = this.props;
    const rating = getRating(item);
    return (
      <Grid container
            className={className}>
        <Grid item
              xs={12}
              className={classes.imageWrapper}>
          <Link as={`/review/${item._id}`}
                href={`/review?id=${item._id}`}>
            <a>
              <img className={classes.image}
                   src={item.photos[0] || '/static/img_default.png'}/>
            </a>
          </Link>
        </Grid>
        <Grid item
              xs={12}>
          <Typography variant="h6">
            <Link as={`/review/${item._id}`}
                  href={`/review?id=${item._id}`}>
              <a>{item.name}</a>
            </Link>
          </Typography>
          <Rating
            value={rating}
            max={5}
          />
          <span>{item.tags && item.tags.join(', ')}</span>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(HorizontalListItem);
