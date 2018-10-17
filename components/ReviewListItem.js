import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class ReviewListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    item: PropTypes.shape()
      .isRequired,
  };

  render() {
    const { classes, item } = this.props;
    return (
      <div>
        {item.review}
      </div>
    );
  }
}

export default withStyles(styles)(ReviewListItem);
