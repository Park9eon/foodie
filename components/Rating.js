import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = () => ({
  size: {
    fontSize: '14px',
    color: '#8a8a8a',
    margin: '4px',
  },
});

class Rating extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    value: PropTypes.number,
    max: PropTypes.number
      .isRequired,
    size: PropTypes.number,
    onChange: PropTypes.func,
    fontSize: PropTypes.string,
  };

  static defaultProps = {
    value: null,
    onChange: null,
    size: null,
    fontSize: 'default',
  };

  render() {
    const {
      classes, value, max, onChange, fontSize, size,
    } = this.props;
    const rating = Array.from(Array(max), (_, index) => (index < value ? 1 : 0));
    return (
      <div className={classes.root}>
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
        {!!size && (<span className={classes.size}>평가 {size}개</span>)}
      </div>
    );
  }
}

export default withStyles(styles)(Rating);
