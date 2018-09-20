import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tags from './Tags';
import { createEatery, updateEatery } from '../lib/api/eatery';

class EateryDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.string,
    lat: PropTypes.number,
    let: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    _id: null,
    name: null,
    description: null,
    address: null,
    let: null,
    lat: null,
    tags: null,
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
    address: '',
    lng: '',
    lat: '',
    tags: [],
  };

  componentDidMount() {
    this.setStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStateByProps(nextProps);
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

  setStateByProps({
    name, description, address, lng, lat, tags,
  }) {
    this.setState({
      name: name || '',
      description: description || '',
      address: address || '',
      lng: lng || '',
      lat: lat || '',
      tags: tags || [],
    });
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

  async save(callback) {
    try {
      const { _id } = this.props;
      const {
        name, description, tags, address, lat, lng,
      } = this.state;
      const data = {};
      if (name) {
        data.name = name;
      } else {
        this.setState({ nameError: true });
        throw new Error('이름을 입력해주세요.');
      }
      if (description) {
        data.description = description;
      }
      if (tags) {
        data.tags = tags;
      }
      if (address) {
        data.address = address;
      }
      if (lat) {
        data.lat = Number.parseFloat(lat);
      }
      if (lng) {
        data.lng = Number.parseFloat(lng);
      }
      if (_id) {
        await updateEatery(_id, data);
        callback(true);
      } else {
        const result = await createEatery(data);
        callback(result);
      }
    } catch (err) {
      callback(false);
    }
  }

  render() {
    const {
      name, nameError, description, tag, tags, address, lng, lat,
    } = this.state;
    const { onClose } = this.props;
    return (
      <Dialog fullWidth
              {...this.props}
              aria-labelledby="edit-dialog-title">
        <DialogContent>
          <form>
            <TextField id="name"
                       label="이름 (필수)"
                       error={nameError}
                       value={name}
                       onChange={this.handleChange('name')}
                       margin="normal"
                       fullWidth/>
            <TextField id="description"
                       label="설명 (선택)"
                       multiline
                       helperText="여러줄 입력가능합니다."
                       value={description}
                       onChange={this.handleChange('description')}
                       margin="normal"
                       fullWidth/>
            <TextField label="주소 (선택)"
                       onKeyPress={this.handleKeyPress}
                       value={address}
                       onChange={this.handleChange('address')}
                       margin="normal"
                       fullWidth/>
            <Grid container
                  spacing={8}>
              <Grid item
                    xs={6}>
                <TextField label="경도 (선택)"
                           onKeyPress={this.handleKeyPress}
                           value={lat}
                           type="number"
                           margin="normal"
                           onChange={this.handleChange('lat')}
                           fullWidth/>
              </Grid>
              <Grid item
                    xs={6}>
                <TextField label="위도 (선택)"
                           onKeyPress={this.handleKeyPress}
                           value={lng}
                           type="number"
                           margin="normal"
                           onChange={this.handleChange('lng')}
                           fullWidth/>
              </Grid>
            </Grid>
            <TextField id="tags"
                       label="태그 (권장)"
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
                  color="secondary"
                  variant="outlined">
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

export default EateryDialog;
