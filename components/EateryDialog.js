import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
  };

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
    const { tags, location } = this.state;
    if (name === 'lat' || name === 'let' || name === 'address') {
      location[name] = value;
      this.setState({ location });
    } else {
      this.setState({
        [name]: value,
      });
    }
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
        name, description, location, tags,
      } = this.state;
      const data = new FormData();
      if (!name) {
        this.setState({ nameError: true });
        throw new Error('이름을 입력해주세요.');
      }
      data.append('name', name);
      if (description) {
        data.append('description', description);
      }
      if (tags.length > 0) {
        tags.forEach((tag) => {
          data.append('tags', tag);
        });
      }
      await createEatery(data);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {
      name, nameError, description, tag, tags, location,
    } = this.state;
    const { onClose } = this.props;
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
                       error={nameError}
                       value={name}
                       onChange={this.handleChange('name')}
                       margin="normal"
                       fullWidth/>
            <TextField id="description"
                       label="설명"
                       multiline
                       value={description}
                       onChange={this.handleChange('description')}
                       margin="normal"
                       fullWidth/>
            <TextField label="주소"
                       onKeyPress={this.handleKeyPress}
                       value={location.address}
                       onChange={this.handleChange('address')}
                       margin="normal"
                       fullWidth/>
            <Grid container spacing={8}>
              <Grid item xs={6}>
                <TextField label="위도"
                           onKeyPress={this.handleKeyPress}
                           value={location.let}
                           type="number"
                           margin="normal"
                           onChange={this.handleChange('let')}
                           fullWidth/>
              </Grid>
              <Grid item xs={6}>
                <TextField label="경도"
                           onKeyPress={this.handleKeyPress}
                           value={location.lat}
                           type="number"
                           margin="normal"
                           onChange={this.handleChange('lat')}
                           fullWidth/>
              </Grid>
            </Grid>
            <TextField id="tags"
                       label="태그"
                       onKeyPress={this.handleKeyPress}
                       value={tag}
                       onChange={this.handleChange('tag')}
                       InputProps={{ onBlur: this.addTag }}
                       margin="normal"
                       helperText="쉼표, 스페이스바, 엔터로 구분합니다."
                       fullWidth/>
            <Tags onDelete={this.removeTag}
                  tags={tags}/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}
                  color="secondary">
            취소
          </Button>
          <Button onClick={() => this.save(onClose)}
                  color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EateryDialog;
