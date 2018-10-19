import React from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import EateryDialog from './EateryDialog';

const styles = (theme) => ({
  mapWrapper: {
    background: 'url(/static/img_map.png)  no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '112px',
    position: 'relative',
  },
  mapButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    whiteSpace: 'nowrap',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  formControl: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
  },
  listItem: {
    padding: '4px 0',
  },
  input: {
    flexGrow: '1',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class NavigationMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.shape()
      .isRequired,
    items: PropTypes.arrayOf(PropTypes.string)
      .isRequired,
    onCheck: PropTypes.func,
    onSearch: PropTypes.func,
    query: PropTypes.arrayOf(PropTypes.string),
    keyword: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    query: null,
    keyword: '',
    onCheck: null,
    onSearch: null,
  };

  state = {
    keyword: '',
    dialogOpen: false,
  };

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
  }

  componentDidMount() {
    const { keyword } = this.props;
    this.setState({ keyword });
  }

  componentWillReceiveProps(nextProps) {
    const { keyword } = nextProps;
    if (keyword) {
      this.setState({ keyword });
    }
  }

  handleSearch(k) {
    return Router.push({
      pathname: '/search',
      query: { k },
    });
  }

  handleCheck(q) {
    return Router.push({
      pathname: '/search',
      query: { q },
    });
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }


  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    const {
      className, items, classes, onCheck, onSearch, query,
    } = this.props;
    const { dialogOpen } = this.state;
    const handleCheck = onCheck || this.handleCheck;
    const handleSearch = onSearch || this.handleSearch;
    const { keyword } = this.state;
    return (
      <div className={className}>
        <List disablePadding>
          <div className={classes.listItem}>
            <Button fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={this.handleDialogOpen}>
              <AddIcon className={classes.leftIcon}/>
              음식점 추가하기
            </Button>
          </div>
          {query && query.length > 0
          && (
            <div className={classes.listItem}>
              <Button variant="outlined"
                      fullWidth
                      onClick={() => Router.push('/')}
                      color="primary">
                <DeleteIcon className={classes.leftIcon}/>
                태그 모두지우기
              </Button>
            </div>
          )}
          <ListItem disableGutters
                    className={classes.dense}>
            <div className={classes.mapWrapper}>
              <Button className={classes.mapButton}
                      variant="contained"
                      color="primary">
                지도에서 보기
              </Button>
            </div>
          </ListItem>
          <div className={classes.formControl}>
            <TextField type="search"
                       value={keyword}
                       onKeyPress={(e) => e.key === 'Enter' && handleSearch(keyword)}
                       onChange={(e) => this.setState({ keyword: e.target.value })}
                       className={classes.input}
                       fullWidth/>
            <IconButton color="secondary"
                        onClick={() => handleSearch(keyword)}>
              <SearchIcon/>
            </IconButton>
          </div>
          <ListSubheader disableGutters>정렬</ListSubheader>
          {['최근', '추천'].map((tag) => (
            <ListItem disableGutters
                      className={classes.dense}
                      key={tag}>
              <Checkbox onChange={() => handleCheck(tag)}
                        checked={query && query.indexOf(tag) > -1}/>
              <ListItemText primary={tag}/>
            </ListItem>
          ))}
          <ListSubheader disableGutters>추천태그</ListSubheader>
          {['가성비', '회식', '점심', '저녁', '근사한', '술'].map((tag) => (
            <ListItem disableGutters
                      className={classes.dense}
                      key={tag}>
              <Checkbox onChange={() => handleCheck(tag)}
                        checked={query && query.indexOf(tag) > -1}/>
              <ListItemText primary={tag}/>
            </ListItem>
          ))}
          <ListSubheader disableGutters>태그</ListSubheader>
          {items.map((tag) => (
            <ListItem disableGutters
                      className={classes.dense}
                      key={tag}>
              <Checkbox onChange={() => handleCheck(tag)}
                        checked={query && query.indexOf(tag) > -1}/>
              <ListItemText primary={tag}/>
            </ListItem>
          ))}
        </List>
        <EateryDialog onClose={this.handleDialogClose}
                      open={dialogOpen}/>
      </div>
    );
  }
}

export default withStyles(styles)(NavigationMenu);
