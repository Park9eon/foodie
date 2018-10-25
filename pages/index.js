import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getRecommendTagList, getTagList, search } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import SummaryList from '../components/SummaryList';
import VerticalList from '../components/VerticalList';
import HorizontalList from '../components/HorizontalList';

const styles = (theme) => ({
  root: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    marginTop: '48px',
    padding: theme.spacing.unit * 2,
  },
  navigationWrapper: {
    marginTop: '24px',
    marginBottom: '24px',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontWeight: 700,
    flexGrow: 1,
  },
  section: {
    marginBottom: '24px',
  },
  more: {
    color: '#000',
    '&:hover, &:focus': {
      color: '#000',
      textDecoration: 'underline',
    },
  },
});

class Index extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

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

  render() {
    const { user, classes } = this.props;
    const {
      eateryList, recommendEateryList, recentEateryList, tags, recommendTags,
    } = this.state;
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
                  md={3}>
              <Hidden smDown>
                <NavigationMenu items={tags}/>
              </Hidden>
            </Grid>
            <Grid item
                  sm={12}
                  md={9}>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">
                  추천태그
                </Typography>
              </div>
              <SummaryList className={classes.section}
                           items={recommendTags}/>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">
                  추천맛집
                </Typography>
                <Link href="/search?q=추천">
                  <a className={classes.more}>더보기</a>
                </Link>
              </div>
              <HorizontalList className={classes.section}
                              items={recommendEateryList}/>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">
                  최근등록
                </Typography>
                <Link href="/search?q=최근">
                  <a className={classes.more}>더보기</a>
                </Link>
              </div>
              <HorizontalList className={classes.section}
                              items={recentEateryList}/>
              <div className={classes.titleWrapper}>
                <Typography className={classes.title}
                            variant="h5">
                  모든음식점
                </Typography>
                <Link href="/search">
                  <a className={classes.more}>더보기</a>
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
