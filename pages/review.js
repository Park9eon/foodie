import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getEatery, getTagList } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import Rating from '../components/Rating';
import ReviewList from '../components/ReviewList';
import { getRating } from '../lib/utlis';

const styles = theme => ({
  root: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    marginTop: '48px',
    padding: theme.spacing.unit * 2,
  },
  imageWrapper: {
    height: '200px',
  },
  image: {
    background: 'rgba(0, 0, 0, .1)',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

class Review extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    classes: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

  static defaultProps = {
    id: null,
  };

  static getInitialProps({ query }) {
    return { id: query.id };
  }

  constructor(props) {
    super(props);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  state = {
    eatery: {},
    tags: [],
  };

  async componentDidMount() {
    const { id } = this.props;
    try {
      const eatery = await getEatery(id);
      const tags = await getTagList();

      this.setState({
        eatery,
        tags,
      });
    } catch (err) {
      Router.push('/');
    }
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
    const { eatery, tags } = this.state;
    const rating = getRating(eatery);
    return (
      <div>
        <Head>
          <title>Mediex Foodie - {eatery.name}</title>
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
            {eatery.name && <Grid item
                                  xs={9}>
              <div>
                <Typography variant="h4">
                  {eatery.name}
                </Typography>
                <Rating
                  value={rating}
                  max={5}
                />
                <div>
                  {eatery.location && eatery.location.address &&
                  <span>{eatery.location.address}</span>}
                  {eatery.tags && eatery.tags.length > 0 && <span>{eatery.tags.join(', ')}</span>}
                  {eatery.description && <span>{eatery.description}</span>}
                </div>
                <Grid container
                      spacing={8}>
                  <Grid item
                        xs={8}
                        className={classes.imageWrapper}>
                    <img className={classes.image}
                         src={eatery.photos[0] || '/static/img_default.png'}/>
                  </Grid>
                  <Grid item
                        xs={4}
                        className={classes.imageWrapper}>
                    <img className={classes.image}
                         src={eatery.photos[1] || '/static/img_default.png'}/>
                  </Grid>
                  <Grid item
                        xs={6}
                        className={classes.imageWrapper}>
                    <img className={classes.image}
                         src={eatery.photos[2] || '/static/img_default.png'}/>
                  </Grid>
                  <Grid item
                        xs={6}
                        className={classes.imageWrapper}>
                    <img className={classes.image}
                         src={eatery.photos[3] || '/static/img_default.png'}/>
                  </Grid>
                </Grid>
              </div>
              <Typography variant="h4">리뷰</Typography>
              <div>
                <ReviewList id={eatery._id}
                            user={user}
                            items={eatery.reviews}/>
              </div>
            </Grid>}
          </Grid>
        </main>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(Review)), { loginRequired: true });
