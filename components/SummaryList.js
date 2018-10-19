import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';

const styles = () => ({
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

class SummaryList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    className: null,
    items: [],
  };

  render() {
    const { classes, items, className } = this.props;
    const listItem = (item) => (
      <Grid item
            key={item.tag}
            xs={4}>
        <Link href={`/search?q=${item.tag}`}>
          <a>
            <div className={classes.root}>
              <div className={classes.imageWrapper}>
                <img className={classes.image}
                     src={item.image}
                     alt={item.tag}/>
              </div>
              <div className={classes.textWrapper}>
                <Typography variant="h6"
                            className={classes.text}>
                  {item.tag}
                </Typography>
              </div>
            </div>
          </a>
        </Link>
      </Grid>
    );
    return (
      <div className={className}>
        <Grid container
              spacing={8}>
          {items.map(listItem)}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SummaryList);
