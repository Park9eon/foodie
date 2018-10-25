import React from 'react';
import Head from 'next/head';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { search, getTagList } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import VerticalList from '../components/VerticalList';

const styles = (theme) => ({
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
    router: PropTypes.shape()
      .isRequired,
    classes: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

  state = {
    eateryList: [],
    tags: [],
    query: [],
    keyword: '',
  };

  constructor(props) {
    super(props);

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  async componentDidMount() {
    const { router: { query: { q, k } } } = this.props;
    const query = (q && q.split('|')) || [];
    const eateryList = await this.getEateryList(q, k);
    const tags = await getTagList();

    this.setState({
      eateryList,
      tags,
      query,
      keyword: k,
    });
  }

  async componentWillReceiveProps(nextProps) {
    const { router: { query: { q, k } } } = nextProps;
    const query = (q && q.split('|')) || [];
    const eateryList = await this.getEateryList(q, k);
    this.setState({
      eateryList,
      query,
      keyword: k,
    });
  }

  async getEateryList(q, k) {
    let queryString = '';
    if (q && k) {
      queryString = `${q}|${k}`;
    } else if (q) {
      queryString = q;
    } else {
      queryString = k;
    }
    const eateryList = await search(queryString);
    return eateryList;
  }

  handleCheckbox(q) {
    const { query, keyword } = this.state;
    const { router } = this.props;
    const index = query.indexOf(q);
    if (index > -1) {
      query.splice(index, 1);
    } else {
      query.push(q);
    }
    return router.push({
      pathname: '/search',
      query: {
        q: query.join('|'),
        k: keyword,
      },
    });
  }

  handleSearch(k) {
    this.setState({ keyword: k });
    const { query } = this.state;
    const { router } = this.props;
    return router.push({
      pathname: '/search',
      query: {
        q: query.join('|'),
        k,
      },
    });
  }

  render() {
    const { user, classes } = this.props;
    const {
      eateryList, tags, query, keyword,
    } = this.state;
    return (
      <div>
        <Head>
          <title>Mediex Foodie - 찾아보기</title>
        </Head>
        <Header user={user}/>
        <main className={classes.root}>
          <Grid container
                spacing={16}>
            <Grid item
                  md={3}>
              <Hidden smDown>
                <NavigationMenu onCheck={this.handleCheckbox}
                                onSearch={this.handleSearch}
                                query={query}
                                keyword={keyword}
                                items={tags}/>
              </Hidden>
            </Grid>
            <Grid item
                  sm={12}
                  md={9}>
              <VerticalList items={eateryList}/>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(withRouter(Search))), { loginRequired: true });
