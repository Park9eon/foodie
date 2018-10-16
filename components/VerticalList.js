import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VerticalListItem from './VerticalListItem';

const styles = theme => ({});

class VerticalList extends React.Component {
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
            spacing={8}
            className={className}>
        {items.map((item, index) => (
          <Grid item
                key={index}
                xs={12}>
            <VerticalListItem item={item}/>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(VerticalList);
