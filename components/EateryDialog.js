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
import CloseIcon from '@material-ui/icons/Close';
import ImageDialog from './ImageDialog';
import Tags from './Tags';
import { createEatery } from '../lib/api/eatery';

class EateryDialog extends React.Component {
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

    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.removeImage = this.removeImage.bind(this);

    this.save = this.save.bind(this);
  }

  state = {
    name: '',
    nameError: false,
    tag: '',
    description: '',
    location: {
      address: '',
      let: '',
      lat: '',
    },
    tags: [],
    images: [],
    isImgDialogOpen: false,
  };

  onImgDialogClose(image) {
    const { images } = this.state;
    if (typeof image === 'string' || (typeof image === 'object' && image.preview)) {
      // URL
      images.push(image);
    }
    this.setState({
      isImgDialogOpen: false,
      images,
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

  handleChange = (name) => (event) => {
    const { value } = event.target;
    const { tags } = this.state;
    this.setState({
      [name]: value,
    });
    if (name === 'tag' && value !== '') {
      const splitter = this.getSplitter(value);
      if (splitter) {
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
    const { tag, tags } = this.state;
    if (event.key === 'Enter' && tag) {
      tags.push(tag);
      this.setState({
        tags,
        tag: '',
      });
    }
  }

  addTag() {
    const { tag, tags } = this.state;
    if (tag) {
      tags.push(tag);
      this.setState({
        tags,
        tag: '',
      });
    }
  }

  removeTag(index) {
    const { tags } = this.state;
    tags.splice(index, 1);
    this.setState({ tags });
  }

  removeImage(index) {
    const { images } = this.state;
    images.splice(index, 1);
    this.setState({ images });
  }

  async save() {
    try {
      const {
        name, description, location, tags, images
      } = this.state;
      if (!this.state.name) {
        return this.setState({ nameError: true });
      }
      const data = new FormData();
      data.append('name', this.state.name);
      if (this.state.description) {
        data.append('description', this.state.description);
      }
      if (this.state.tags.length > 0) {
        this.state.tags.forEach((tag) => {
          data.append('tags', tag);
        });
      }
      if (this.state.images.length > 0) {
        this.state.images.forEach((image) => {
          if (typeof image === 'string') {
            data.append('imageUrls', image);
          } else {
            data.append('images', image);
          }
        });
      }
      await createEatery(data);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Dialog fullWidth
              {...this.props}
              aria-labelledby="edit-dialog-title">
        <DialogTitle id="edit-dialog-title">
          음식점 추가
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField id="name"
                       label="이름"
                       error={this.state.nameError}
                       value={this.state.name}
                       onChange={this.handleChange('name')}
                       margin="normal"
                       fullWidth/>
            <TextField id="description"
                       label="설명"
                       multiline
                       value={this.state.description}
                       onChange={this.handleChange('description')}
                       margin="normal"
                       fullWidth/>
            <TextField id="tags"
                       label="태그"
                       onKeyPress={this.handleKeyPress}
                       value={this.state.tag}
                       onChange={this.handleChange('tag')}
                       inputProps={{ onBlur: this.addTag }}
                       margin="normal"
                       fullWidth/>
            <Tags onDelete={this.removeTag}
                  tags={this.state.tags}/>
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
                           }}/>
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
          <Button onClick={this.props.onClose}
                  color="secondary">
            취소
          </Button>
          <Button onClick={() => this.save(this.props.onClose)}
                  color="primary">
            저장
          </Button>
        </DialogActions>
        <ImageDialog onClose={this.onImgDialogClose}
                     open={this.state.isImgDialogOpen}/>
      </Dialog>
    );
  }
}

export default EateryDialog;
