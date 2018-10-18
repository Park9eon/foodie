import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '136px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  textWrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, .3)',
  },
  text: {
    color: '#fff',
    position: 'absolute',
    fontWeight: '700',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

class SummaryListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.shape().isRequired,
    item: PropTypes.shape({
      text: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { classes, item } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.imageWrapper}>
          <img className={classes.image}
               src={item.image}/>
        </div>
        <div className={classes.textWrapper}>
          <Typography variant="h6"
                      className={classes.text}>
            {item.tag}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SummaryListItem);
