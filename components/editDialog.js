import React from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import ImgDialog from './imgDialog';

class EditDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.onImgDialogClose = this.onImgDialogClose.bind(this);
    this.onImgDialogOpen = this.onImgDialogOpen.bind(this);

    this.removeTag = this.removeTag.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  state = {
    name: '',
    tag: '',
    description: '',
    tags: [],
    images: [],
    isImgDialogOpen: false,
  };

  onImgDialogClose(image) {
    if (typeof image === 'string' || (typeof image === 'object' && image.preview)) {
      // URL
      this.state.images.push(image);
    }
    this.setState({
      isImgDialogOpen: false,
      images: this.state.images,
    });
  }

  onImgDialogOpen() {
    this.setState({ isImgDialogOpen: true });
  }

  getSplitter(value) {
    if (value.includes(',')) {
      return ',';
    }
    if (value.includes(' ')) {
      return ' ';
    }
    return null;
  }

  handleChange = name => (event) => {
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
    if (name === 'tag' && value !== '') {
      const splitter = this.getSplitter(value);
      if (splitter) {
        const tags = this.state.tags;
        value.split(splitter)
          .forEach((t) => {
            if (t) {
              tags.push(t);
            }
          });
        this.setState({
          tags,
          tag: '',
        });
      }
    }
  };

  handleKeyPress(event) {
    if (event.key === 'Enter' && this.state.tag) {
      this.state.tags.push(this.state.tag);
      this.setState({
        tags: this.state.tags,
        tag: '',
      });
    }
  }

  removeTag(index) {
    this.state.tags.splice(index, 1);
    this.setState({ tags: this.state.tags });
  }

  removeImage(index) {
    this.state.images.splice(index, 1);
    this.setState({ images: this.state.images });
  }

  render() {
    return (
      <Dialog
        fullWidth
        {...this.props}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">
          음식점 추가
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField
              id="name"
              label="이름"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="description"
              label="설명"
              multiline
              rows="5"
              value={this.state.description}
              onChange={this.handleChange('description')}
              margin="normal"
              fullWidth
            />
            <TextField
              id="tags"
              label="태그"
              onKeyPress={this.handleKeyPress}
              value={this.state.tag}
              onChange={this.handleChange('tag')}
              margin="normal"
              fullWidth
            />
            {this.state.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                style={{ margin: '2px' }}
                onDelete={() => this.removeTag(index)}
              />
            ))}
            <div>
              <GridList cellHeight={100}
                        cols={4}
                        style={{
                          marginTop: '16px',
                        }}>
                {this.state.images.map((image, index) => (
                  <GridListTile key={index}
                                cols={1}>
                    <div style={{
                      position: 'relative',
                      height: '100%',
                    }}>
                      <img src={typeof image === 'string' ? image : image.preview}
                           style={{
                             width: '100%',
                             height: '100%',
                             objectFit: 'cover',
                           }}
                      />
                      <IconButton onClick={() => this.removeImage(index)}
                                  style={{
                                    color: '#eee',
                                    background: 'rgba(0, 0, 0, .8)',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}>
                        <CloseIcon fontSize="small"/>
                      </IconButton>
                    </div>
                  </GridListTile>
                ))}
                <GridListTile>
                  <Button color="primary"
                          variant="outlined"
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          onClick={this.onImgDialogOpen}>
                    이미지 추가
                  </Button>
                </GridListTile>
              </GridList>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.onClose}
            color="secondary"
          >
            취소
          </Button>
          <Button
            onClick={this.props.onClose}
            color="primary"
          >
            저장
          </Button>
        </DialogActions>
        <ImgDialog
          onClose={this.onImgDialogClose}
          open={this.state.isImgDialogOpen}
        />
      </Dialog>
    );
  }
}

export default EditDialog;
