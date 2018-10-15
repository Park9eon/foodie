import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/Typography';
import Tags from './Tags';
import Rating from './Rating';
import Grid from '@material-ui/core/Grid/Grid';

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
      name: PropTypes.string
        .isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  };

  render() {
    const { className, classes, item } = this.props;
    return (
      <Grid container
            className={className}>
        <Grid item
              xs={12}
              className={classes.imageWrapper}>
          <img className={classes.image}
               src={item.photos[0] || '/static/img_default.png'}/>
        </Grid>
        <Grid item
              xs={12}>
          <Typography variant="h6">{item.name}</Typography>
          <Rating
            value={1}
            max={5}
          />
          <span>{item.tags && item.tags.join(', ')}</span>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(HorizontalListItem);
