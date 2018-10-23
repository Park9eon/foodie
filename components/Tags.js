import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip/Chip';
import { withStyles } from '@material-ui/core/styles';
import { yellow, green } from '@material-ui/core/colors';

const styles = (theme) => ({
  tags: {
    margin: theme.spacing.unit * -0.5,
  },
  tag: {
    margin: theme.spacing.unit * 0.5,
  },
  recent: {
    backgroundColor: yellow[500],
    margin: theme.spacing.unit * 0.5,
  },
  recommend: {
    backgroundColor: green[500],
    color: '#fff',
    margin: theme.spacing.unit * 0.5,
  },
});

class Tags extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    tags: [],
    onDelete: null,
  };

  render() {
    const {
      classes, tags, onDelete,
    } = this.props;
    return (
      <div className={classes.tags}>
        {tags.map((tag, index) => (
          <Chip key={index}
                label={tag}
                className={classes.tag}
                onDelete={onDelete && (() => onDelete(index))}/>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Tags);
