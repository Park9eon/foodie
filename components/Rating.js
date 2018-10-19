import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = (theme) => ({});

class Rating extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    value: PropTypes.number,
    max: PropTypes.number
      .isRequired,
    onChange: PropTypes.func,
    fontSize: PropTypes.string,
  };

  static defaultProps = {
    rating: 0,
    onChange: null,
    fontSize: 'default',
  };

  render() {
    const {
      classes, value, max, onChange, fontSize,
    } = this.props;
    const rating = Array.from(Array(max), (_, index) => (index < value ? 1 : 0));
    return (
      <div>
        {rating.map((on, key) => (on
          ? (
            <StarIcon color="primary"
                      fontSize={fontSize}
                      key={key}
                      onClick={onChange && (() => onChange(key + 1))}/>
          )
          : (
            <StarBorderIcon color="disabled"
                            fontSize={fontSize}
                            onClick={onChange && (() => onChange(key + 1))}
                            key={key}/>
          )))}
      </div>
    );
  }
}

export default withStyles(styles)(Rating);
