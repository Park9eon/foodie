import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { search, getTagList, getRecommendTagList } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import SummaryList from '../components/SummaryList';
import VerticalList from '../components/VerticalList';
import HorizontalList from '../components/HorizontalList';

const styles = theme => ({
  root: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    marginTop: '48px',
    padding: theme.spacing.unit * 2,
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  title: {
    fontWeight: 700,
    flexGrow: 1,
  },
  section: {
    marginBottom: '48px',
  },
});

class Index extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

  constructor(props) {
    super(props);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  state = {
    eateryList: [],
    recommendEateryList: [],
    recentEateryList: [],
    tags: [],
    recommendTags: [],
  };

  async componentDidMount() {
    const eateryList = await search('', 5);
    const recommendEateryList = await search('추천', 4);
    const recentEateryList = await search('최근', 4);
    const recommendTags = await getRecommendTagList();
    const tags = await getTagList();
    this.setState({
      eateryList,
      recommendEateryList,
      recentEateryList,
      tags,
      recommendTags,
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
    return Router.push({
      pathname: '/search',
      query: { q },
    });
  }

  render() {
    const { user, classes } = this.props;
    const { eateryList, recommendEateryList, recentEateryList, tags, recommendTags } = this.state;
    return (
      <div>
        <Head>
          <title>Mediex Foodie</title>
        </Head>
        <Header user={user}/>
        <main className={classes.root}>
          <Grid container
                spacing={16}>
            <Grid item
                  xs={3}>
              <NavigationMenu onChange={this.handleCheckbox}
                              items={tags}/>
            </Grid>
            <Grid item
                  xs={9}>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">추천태그</Typography>
              </div>
              <SummaryList className={classes.section}
                           items={recommendTags}/>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">추천맛집</Typography>
                <Link href="/search?q=추천">
                  <a>더보기</a>
                </Link>
              </div>
              <HorizontalList className={classes.section}
                              items={recommendEateryList}/>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">최근등록</Typography>
                <Link href="/search?q=최근">
                  <a>더보기</a>
                </Link>
              </div>
              <HorizontalList className={classes.section}
                              items={recentEateryList}/>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">모든음식점</Typography>
                <Link href="/search">
                  <a>더보기</a>
                </Link>
              </div>
              <VerticalList className={classes.section}
                            items={eateryList}/>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(Index)), { loginRequired: true });
