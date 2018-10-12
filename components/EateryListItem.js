import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tags from './Tags';
import Rating from './Rating';

const styles = theme => ({
  content: {
    padding: theme.spacing.unit * 2,
  },
  imageWrapper: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  rating: {
    marginTop: theme.spacing.unit * 2,
  },
  name: {
    marginBottom: theme.spacing.unit,
  },
});

class EateryListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    eatery: PropTypes.shape()
      .isRequired,
  };

  render() {
    const {
      eatery, classes, isRecommend, isRecent,
    } = this.props;
    const thumbnail = eatery.photos && eatery.photos[0] && (
      <div className={classes.imageWrapper}>
        <img
          className={classes.image}
          src={eatery.photos[0]}
        />
      </div>
    );
    return (
      <div>
        {thumbnail}
        <div className={classes.content}>
          <Typography variant="h6" className={classes.name}>{eatery.name}</Typography>
          <Tags {...{ isRecent, isRecommend }} tags={eatery.tags} />
          <div className={classes.rating}>
            <Rating
              value={1}
              max={5}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(EateryListItem);
