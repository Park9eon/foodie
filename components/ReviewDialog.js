import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dropzone from 'react-dropzone';
import Rating from './Rating';
import { createReview, updateReview } from '../lib/api/eatery';

const styles = (theme) => ({
  dropzone: {
    border: '#ddd 4px dashed',
    borderRadius: '2px',
    textAlign: 'center',
    color: '#aaa',
    cursor: 'pointer',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  dropzoneAccept: {
    borderColor: theme.palette.primary.main,
    background: '#eee',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageRemove: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#fff',
    background: 'rgba(0, 0, 0, .5)',
  },
});

class ReviewDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.shape().isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    eateryId: PropTypes.string,
    _id: PropTypes.string,
    review: PropTypes.string,
    rating: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.any),
  };

  static defaultProps = {
    eateryId: null,
    _id: null,
    review: '',
    rating: 3,
    images: [],
  };

  constructor(props) {
    super(props);
    this.handleTextField = this.handleTextField.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.save = this.save.bind(this);
  }

  state = {
    _id: null,
    review: '',
    rating: null,
    images: [],
  };

  componentDidMount() {
    this.setStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStateByProps(nextProps);
  }

  setStateByProps({ _id, review, rating, images }) {
    this.setState({
      _id,
      review,
      rating,
      images,
    });
  }

  handleTextField(event) {
    this.setState({
      review: event.target.value,
    });
  }

  handleRating(rating) {
    this.setState({
      rating,
    });
  }

  handleDrop(files) {
    const { images } = this.state;
    images.push(...files);
    this.setState({ images });
  }

  removeImage(index) {
    const { images } = this.state;
    images.splice(index, 1);
    this.setState({ images });
  }

  async save(callback) {
    try {
      const { eateryId } = this.props;
      const { _id, review, rating, images } = this.state;
      const data = new FormData();
      data.append('review', review);
      data.append('rating', rating);
      images.forEach((image) => {
        data.append('images', image);
      });
      if (_id) {
        await updateReview(eateryId, _id, data);
      } else {
        await createReview(eateryId, data);
      }
      callback(true);
    } catch (e) {
      callback(false);
    }
  }

  render() {
    const { classes, onClose, open, } = this.props;
    const {
      review, rating, images,
    } = this.state;
    return (
      <Dialog fullWidth
              open={open}
              onClose={onClose}
              aria-labelledby="edit-dialog-title">
        <DialogContent>
          <form>
            <Rating value={rating}
                    max={5}
                    fontSize="large"
                    onChange={this.handleRating}/>
            <TextField id="description"
                       label="리뷰"
                       multiline
                       helperText="여러줄 입력가능합니다."
                       value={review}
                       onChange={this.handleTextField}
                       margin="normal"
                       fullWidth/>
            <div>
              <GridList cellHeight={100}
                        cols={4}>
                {images.map((image, index) => (
                  <GridListTile key={index}
                                cols={1}>
                    <div className={classes.imageWrapper}>
                      <img className={classes.image}
                           src={image.preview || image}/>
                      <IconButton className={classes.imageRemove}
                                  onClick={() => this.removeImage(index)}>
                        <CloseIcon fontSize="small"/>
                      </IconButton>
                    </div>
                  </GridListTile>
                ))}
              </GridList>
              <Dropzone accept="image/jpeg, image/png"
                        className={classes.dropzone}
                        acceptClassName={classes.dropzoneAccept}
                        onDrop={this.handleDrop}>
                <p>사진등록</p>
                <p>클릭 혹은 이미지를 드래그 해주세요.</p>
              </Dropzone>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}
                  variant="outlined"
                  color="secondary">
            취소
          </Button>
          <Button onClick={() => this.save(onClose)}
                  variant="contained"
                  color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ReviewDialog);
