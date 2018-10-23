import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LocationIcon from '@material-ui/icons/LocationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { getEatery, getTagList } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import Rating from '../components/Rating';
import ReviewList from '../components/ReviewList';
import EateryDialog from '../components/EateryDialog';
import Tags from '../components/Tags';

const styles = (theme) => ({
  root: {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    marginTop: '48px',
    padding: theme.spacing.unit * 2,
  },
  titleWrapper: {
    marginBottom: theme.spacing.unit,
  },
  title: {
    fontWeight: 700,
  },
  section: {
    marginBottom: theme.spacing.unit * 2,
  },
  imageWrapper: {
    height: '200px',
  },
  image: {
    background: 'rgb(200, 200, 200)',
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

  state = {
    eatery: {
      _id: null,
      name: '',
      description: '',
      address: '',
      lat: null,
      let: null,
      rating: 0,
      reviews: [],
      images: [],
    },
    tags: [],
    dialogOpen: false,
  };

  constructor(props) {
    super(props);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

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

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    const { user, classes } = this.props;
    const { eatery, tags, dialogOpen } = this.state;
    return (
      <div>
        <Head>
          <title>{`Mediex Foodie - ${eatery.name}`}</title>
        </Head>
        <Header user={user}/>
        <main className={classes.root}>
          <Grid container
                spacing={16}>
            <Grid item
                  xs={3}>
              <NavigationMenu items={tags}/>
            </Grid>
            <Grid item
                  xs={9}>
              <Grid container
                    className={classes.titleWrapper}>
                <Grid item
                      sm>
                  <Typography variant="h5"
                              className={classes.title}>
                    {eatery.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="secondary"
                          onClick={this.handleDialogOpen}>
                    음식점 정보수정
                  </Button>
                </Grid>
              </Grid>
              <div className={classes.section}>
                <Grid container
                      spacing={8}>
                  <Grid item>
                    <Rating value={eatery.rating}
                            max={5}/>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption">{`리뷰 ${eatery.reviews.length}개`}</Typography>
                  </Grid>
                </Grid>
                <div>
                  {eatery.tags && eatery.tags.length > 0
                  && (
                    <Tags tags={eatery.tags}/>
                  )}
                  {eatery.address && (
                    <p>
                      <Grid container
                            spacing={8}>
                        <Grid item>
                          <LocationIcon fontSize="small"/>
                        </Grid>
                        <Grid item
                              sm>
                          {eatery.address}
                        </Grid>
                      </Grid>
                    </p>
                  )}
                  {eatery.description && (
                    <Grid container
                          spacing={8}>
                      <Grid item>
                        <DescriptionIcon fontSize="small"/>
                      </Grid>
                      <Grid item
                            sm>
                        {eatery.description}
                      </Grid>
                    </Grid>
                  )}
                </div>
              </div>
              <Grid container
                    spacing={8}>
                <Grid item>
                  <Grid container>
                    <div className={classes.titleWrapper}>
                      <Typography variant="h5"
                                  className={classes.title}>
                        사진
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="caption">{`사진 ${eatery.images.length}개`}</Typography>
                </Grid>
              </Grid>
              <Grid container
                    spacing={8}
                    className={classes.section}>
                <Grid item
                      xs={8}
                      className={classes.imageWrapper}>
                  <img className={classes.image}
                       src={eatery.images[0] || '/static/img_default.png'}/>
                </Grid>
                <Grid item
                      xs={4}
                      className={classes.imageWrapper}>
                  <img className={classes.image}
                       src={eatery.images[1] || '/static/img_default.png'}/>
                </Grid>
                <Grid item
                      xs={6}
                      className={classes.imageWrapper}>
                  <img className={classes.image}
                       src={eatery.images[2] || '/static/img_default.png'}/>
                </Grid>
                <Grid item
                      xs={6}
                      className={classes.imageWrapper}>
                  <img className={classes.image}
                       src={eatery.images[3] || '/static/img_default.png'}/>
                </Grid>
              </Grid>
              <Grid container
                    className={classes.titleWrapper}>
                <Grid item
                      sm>
                  <Typography variant="h5"
                              className={classes.title}>
                    리뷰
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="primary">
                    리뷰작성하기
                  </Button>
                </Grid>
              </Grid>
              <div>
                <ReviewList user={user}
                            items={eatery.reviews}/>
              </div>
            </Grid>
          </Grid>
        </main>
        <EateryDialog onClose={this.handleDialogClose}
                      open={dialogOpen}
                      {...eatery}/>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(Review)), { loginRequired: true });
