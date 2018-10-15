import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import HorizontalListItem from './HorizontalListItem';

const styles = theme => ({});

class HorizontalList extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.shape())
      .isRequired,
  };

  render() {
    const { className, classes, items } = this.props;
    return (
      <Grid container
            className={className}
            spacing={8}>
        {items.map((item, index) => (
          <Grid item key={index} xs={3}>
            <HorizontalListItem item={item} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(HorizontalList);
