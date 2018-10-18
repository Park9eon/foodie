import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
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
    user: PropTypes.shape()
      .isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);
  }

  state = {
    rating: 0,
    errorShow: false,
    errorMessage: 'Error',
    items: [],
  };

  componentDidMount() {
    const { items } = this.props;
    this.setState({ items });
  }

  componentWillReceiveProps(nextProps) {
    const { items } = nextProps;
    this.setState({ items });
  }

  handleRating(value) {
    this.setState({ rating: value });
  }

  handleChange({ target: { value } }) {
    this.setState({ review: value });
  }

  async handleSubmit() {
    try {
      const { id, user } = this.props;
      const { rating, review, items } = this.state;
      if (!(rating || review)) {
        throw new Error('별점 혹은 리뷰중 하나를 넣어주세요.');
      }
      await addReview(id, {
        rating,
        review,
      });
      items.push({
        rating,
        review,
        user,
      });
      this.setState({
        items,
        rating: null,
        review: '',
      });
      Router.push(`/review?id=${id}`, `/review/${id}`);
    } catch (err) {
      this.handleError(err.message || err.error);
    }
  }

  handleError(message) {
    this.setState({
      errorShow: true,
      errorMessage: message,
    });
  }

  handleSnackClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      errorShow: false,
    });
  }

  render() {
    const { classes, user } = this.props;
    const { rating, errorShow, errorMessage, items } = this.state;
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
        <div>
          {items.filter(item => item.review || item.rating)
            .map((item, index) => (
              <ReviewListItem
                user={user}
                key={index}
                item={item}
              />
            ))}
        </div>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={errorShow}
            onClose={this.handleSnackClose}
            autoHideDuration={6000}
            ContentProps={{
              'aria-describedby': 'message-id',
              headlineMapping: {
                body1: 'div',
                body2: 'div',
              },
            }}
            message={errorMessage}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ReviewList);
