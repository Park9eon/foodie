import React from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getEateryList, getTagList } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import VerticalList from '../components/VerticalList';

const styles = theme => ({
  root: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    marginTop: '48px',
    padding: theme.spacing.unit * 2,
  },
  title: {
    textAlign: 'center',
    fontWeight: 700,
    marginBottom: '48px',
  },
});

class Search extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

  state = {
    eateryList: [],
    tags: [],
    query: [],
  };

  constructor(props) {
    super(props);

    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  async componentDidMount() {
    const { router: { query: { q } } } = this.props;
    const query = (q && q.split(',')) || [];

    const eateryList = await getEateryList();
    const tags = await getTagList();

    this.setState({
      eateryList,
      tags,
      query,
    });
  }

  handleCheckbox(id) {
    let q = null;
    if (id === -1) {
      q = '최근';
    } else if (id === -2) {
      q = '추천';
    } else {
      q = this.state.tags[id];
    }
    const { query } = this.state;
    const { router } = this.props;

    const index = query.indexOf(q);
    if (index > -1) {
      query.splice(index, 1);
    } else {
      query.push(q);
    }
    return router.push({
      pathname: '/search',
      query: { q: query.join(',') },
    });
  }

  render() {
    const { user, classes } = this.props;
    const { eateryList, tags, query } = this.state;
    const tags2 = [{
      text: '중국집',
      image: '/static/upload/5bbefc071f0af5f400a726e2.jpg',
    }, {
      text: '급식',
      image: '/static/upload/5bbefc071f0af5f400a726e2.jpg',
    }, {
      text: '저렴한',
      image: '/static/upload/5bbefc071f0af5f400a726e2.jpg',
    }, {
      text: '한식',
      image: '/static/upload/5bbefc071f0af5f400a726e2.jpg',
    }];
    return (
      <div>
        <Header user={user}/>
        <main className={classes.root}>
          <Grid container
                spacing={16}>
            <Grid item
                  xs={3}>
              <NavigationMenu onChange={this.handleCheckbox}
                              query={query}
                              items={tags}/>
            </Grid>
            <Grid item
                  xs={9}>
              <Typography className={classes.title}
                          variant="h4">모든음식점</Typography>
              <VerticalList
                items={eateryList}/>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(withRouter(Search))), { loginRequired: true });
