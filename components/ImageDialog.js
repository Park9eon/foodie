import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Search from '@material-ui/icons/Search';
import Link from '@material-ui/icons/Link';
import Dropzone from 'react-dropzone';

class ImageDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleImageNotFound = this.handleImageNotFound.bind(this);
    this.loadSearch = this.loadSearch.bind(this);
    this.loadImageUrl = this.loadImageUrl.bind(this);
    this.loadImageFile = this.loadImageFile.bind(this);
    this.resetState = this.resetState.bind(this);
    this.search = this.search.bind(this);
    this.getResult = this.getResult.bind(this);
  }

  state = {
    queryError: false,
    imageError: false,
    tab: 0, // 업로드, 1 : URL , 2 : Search
    imageUrl: '', // 외부 이미지
    imageFile: null, // 컴퓨터에 저장된 이미지
    query: '', // 검색어
  };

  search(platform) {
    if (this.state.query) {
      const query = encodeURIComponent(this.state.query);
      if (platform === 'naver') {
        window.open(`https://search.naver.com/search.naver?where=image&query=${query}`, '_blank');
      }
      if (platform === 'google') {
        window.open(`https://www.google.co.kr/search?tbm=isch&q=${query}`, '_blank');
      }
    } else {
      this.setState({ queryError: true });
    }
  }

  handleChange(event, tab) {
    this.setState({ tab });
  }

  handleImageNotFound() {
    this.setState({ imageError: true });
  }

  loadSearch(event) {
    this.setState({
      query: event.target.value,
      queryError: false,
    });
  }

  loadImageUrl(event) {
    this.setState({
      imageUrl: event.target.value,
      imageError: false,
    });
  }

  loadImageFile(files) {
    this.setState({ imageFile: files[0] });
  }

  resetState() {
    this.setState({
      queryError: false,
      imageError: false,
      tab: 0,
      imageUrl: '',
      imageFile: null,
      query: '',
    });
  }

  getResult() {
    if (this.state.tab === 0) {
      return this.state.imageFile;
    }
    if (this.state.tab === 1 && !this.state.imageError) {
      return this.state.imageUrl;
    }
    return null;
  }

  render() {
    return (
      <Dialog
        fullWidth
        {...this.props}
        onEnter={this.resetState}
        aria-labelledby="edit-dialog-title"
      >
        <Tabs
          value={this.state.tab}
          onChange={this.handleChange}
          fullWidth
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab
            label="업로드"
            icon={<CloudUpload />}
          />
          <Tab
            label="URL"
            icon={<Link />}
          />
          <Tab
            label="검색"
            icon={<Search />}
          />
        </Tabs>
        <DialogContent style={{
          margin: '24px 0 0 0',
        }}
        >
          {this.state.tab === 0 && (
            <div>
              {this.state.imageFile ? (
                <img
                  src={this.state.imageFile.preview}
                  style={{
                    width: '100%',
                    maxHeight: '1000px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Dropzone
                  onDrop={this.loadImageFile}
                  multiple={false}
                  style={{
                    width: '100%',
                    height: '200px',
                    border: '#ddd 4px dashed',
                    borderRadius: '2px',
                    textAlign: 'center',
                    color: '#ddd',
                  }}
                >
                  <h1>
                    이곳에 이미지를 드래그하세요.
                  </h1>
                  <p>
                    클릭하면 저장된 이미지를 선택할 수 있습니다.
                  </p>
                </Dropzone>
              )}
            </div>
          )}
          {this.state.tab === 1 && (
            <div>
              {!this.state.imageError && (
              <img
                src={this.state.imageUrl}
                onError={this.handleImageNotFound}
                style={{
                  width: '100%',
                  maxHeight: '1000px',
                  objectFit: 'cover',
                }}
              />
              )}
              <TextField
                id="url"
                label="URL"
                value={this.state.imageUrl}
                onChange={this.loadImageUrl}
                margin="normal"
                fullWidth
                helperText="인터넷에 있는 이미지주소를 복사 후 붙여넣기 해주세요."
              />
            </div>
          )}
          {this.state.tab === 2 && (
            <div>
              <TextField
                id="search"
                label="검색"
                error={this.state.queryError}
                value={this.state.query}
                onChange={this.loadSearch}
                margin="normal"
                fullWidth
                helperText="검색한 이미지를 저장 후 업로드 혹은 이미지 URL을 복사 후 등록해주세요."
              />
              <div style={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.search('google')}
                >
                  구글
                </Button>
                <Button
                  variant="contained"
                  onClick={() => this.search('naver')}
                  style={{
                    marginLeft: '8px',
                    color: '#fff',
                    backgroundColor: '#1EC800',
                    '&:hover': {
                      backgroundColor: '',
                    },
                  }}
                >
                  네이버
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.onClose}
            color="secondary"
          >
            취소
          </Button>
          <Button
            onClick={() => this.props.onClose(this.getResult())}
            color="primary"
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ImageDialog;
