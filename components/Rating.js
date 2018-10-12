import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = theme => ({});

class Rating extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    value: PropTypes.number
      .isRequired,
    max: PropTypes.number
      .isRequired,
    onRate: PropTypes.func,
  };

  render() {
    const { classes, value, max } = this.props;
    const rating = Array.from(Array(max), (_, index) => (index < value ? 1 : 0));
    return (
      <div>
        {rating.map((on, key) => (on ? <StarIcon fontSize="large"
                                                 color="primary"
                                                 key={key}/> : <StarBorderIcon fontSize="large" color="disabled"
                                                                               key={key}/>))}
      </div>
    );
  }
}

export default withStyles(styles)(Rating);
