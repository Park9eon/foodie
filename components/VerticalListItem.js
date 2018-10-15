import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid';
import Tags from './Tags';
import Rating from './Rating';

const styles = theme => ({
  imageWrapper: {
    height: '160px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

class VerticalListItem extends React.Component {
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
            spacing={16}
            className={className}>
        <Grid item
              xs={3}
              className={classes.imageWrapper}>
          <img className={classes.image}
               src={item.photos[0] || '/static/img_default.png'}/>
        </Grid>
        <Grid item
              xs={9}>
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

export default withStyles(styles)(VerticalListItem);
