import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LeftIcon from '@material-ui/icons/ArrowLeft';
import RightIcon from '@material-ui/icons/ArrowRight';
import Dialog from '@material-ui/core/Dialog';

const styles = () => ({
  image: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    minHeight: '100px',
  },
  action: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  left: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

class ImageDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.shape().isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    images: [],
  };

  constructor(props) {
    super(props);
    this.move = this.move.bind(this);
  }

  state = {
    page: 0,
  };

  move(size) {
    let { page } = this.state;
    const { images } = this.props;
    page += size;
    if (page < 0) {
      page = images.length - 1;
    }
    if (page === images.length) {
      page = 0;
    }
    this.setState({ page });
  }

  render() {
    const { classes, onClose, open, images, } = this.props;
    const { page } = this.state;
    return (
      <Dialog fullWidth
              maxWidth="lg"
              open={open}
              onClose={onClose}
              aria-labelledby="edit-dialog-title">
        <img className={classes.image}
             src={images[page]}/>
        <Grid container
              className={classes.action}>
          <Grid item
                xs={6}
                className={classes.left}>
            <IconButton onClick={() => this.move(-1)}>
              <LeftIcon fontSize="large"/>
            </IconButton>
          </Grid>
          <Grid item
                xs={6}
                className={classes.right}>
            <IconButton onClick={() => this.move(1)}>
              <RightIcon fontSize="large"/>
            </IconButton>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ImageDialog);
