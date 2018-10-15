import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SummaryListItem from './SummaryListItem';

const styles = theme => ({});

class SummaryList extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string
        .isRequired,
      image: PropTypes.string
        .isRequired,
    }))
      .isRequired,
  };

  render() {
    const { classes, items, className } = this.props;
    return (
      <div className={className}>
        <Grid container
              spacing={8}>
          {items.map((item, index) => (
            <Grid item
                  key={index}
                  xs={4}>
              <SummaryListItem item={item}/>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SummaryList);
