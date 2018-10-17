import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ReviewListItem from './ReviewListItem';
import Rating from './Rating';
import { addReview } from '../lib/api/eatery';

const styles = theme => ({
  textField: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: 'auto',
  },
});

class ReviewList extends React.Component {
  static propTypes = {
    id: PropTypes.string
      .isRequired,
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.shape())
      .isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    rating: 0,
  };

  handleRating(value) {
    this.setState({ rating: value });
  }

  handleChange({ target: { value } }) {
    this.setState({ review: value });
  }

  async handleSubmit() {
    try {
      const { id } = this.props;
      const { rating, review } = this.state;
      const result = await addReview(id, {
        rating,
        review,
      });
      Router.push(`/review/${id}`);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { classes, items } = this.props;
    const { rating } = this.state;
    return (
      <div>
        <div>
          <Rating
            onChange={this.handleRating}
            fontSize="large"
            value={rating}
            max={5}
          />
          <div>
            <TextField
              multiline
              label="리뷰남기기"
              onChange={this.handleChange}
              className={classes.textField}
              rows="5"
            />
          </div>
          <div>
            <Button
              color="primary"
              className={classes.button}
              onClick={this.handleSubmit}
              variant="contained"
            >
리뷰 남기기
            </Button>
          </div>
        </div>
        {items.map((item, index) => (
          <ReviewListItem
            key={index}
            item={item}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(ReviewList);
