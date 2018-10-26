import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography/Typography';
import Rating from './Rating';

const styles = () => ({
  imageWrapper: {
    height: '150px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  name: {
    color: '#000',
    fontWeight: '700',
    '&:hover, &:focus': {
      color: '#000',
      textDecoration: 'underline',
    },
  },
  tags: {
    color: '#444',
  },
  info: {
    fontSize: '18px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#888',
  },
});

class VerticalList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string
        .isRequired,
      name: PropTypes.string
        .isRequired,
      location: PropTypes.shape(),
      image: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    })),
  };

  static defaultProps = {
    className: null,
    items: [],
  };

  render() {
    const {
      className, classes, items,
    } = this.props;
    const listItem = (item) => {
      const link = `/review?id=${item._id}`;
      const linkAs = `/review/${item._id}`;
      const image = item.images[Math.floor(Math.random() * item.images.length)];
      return (
        <Grid container
              item
              key={item._id}
              xs={12}
              spacing={8}>
          <Grid item
                xs={3}
                className={classes.imageWrapper}>
            <Link as={linkAs}
                  href={link}>
              <a>
                <img className={classes.image}
                     src={image || '/static/img_default.png'}
                     alt={item.name}/>
              </a>
            </Link>
          </Grid>
          <Grid item
                xs={9}>
            <Typography variant="h6">
              <Link as={linkAs}
                    href={link}>
                <a className={classes.name}>{item.name}</a>
              </Link>
            </Typography>
            <Rating value={item.rating}
                    max={5}/>
            <span className={classes.tags}>{item.tags && item.tags.join(', ')}</span>
            {item.description && (
              <p className={classes.info}>
                {item.description}
              </p>
            )}
          </Grid>
        </Grid>
      );
    };

    return (
      <Grid container
            spacing={8}
            className={className}>
        {items.map(listItem)}
      </Grid>
    );
  }
}

export default withStyles(styles)(VerticalList);
