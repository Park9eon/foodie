import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LocationIcon from '@material-ui/icons/LocationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import _ from 'lodash';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import { deleteReview, getEatery, getTagList } from '../lib/api/eatery';
import Header from '../components/Header';
import NavigationMenu from '../components/NavigationMenu';
import Rating from '../components/Rating';
import ReviewList from '../components/ReviewList';
import EateryDialog from '../components/EateryDialog';
import ReviewDialog from '../components/ReviewDialog';
import ImageDialog from '../components/ImageDialog';
import Alert from '../components/Alert';
import Tags from '../components/Tags';

const { publicRuntimeConfig } = getConfig();
const { GOOGLE_MAP_KEY } = publicRuntimeConfig;

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
    border: '1px solid #eee',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mapImage: {
    width: '100%',
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
      lng: null,
      rating: 0,
      reviews: [],
      images: [],
    },
    review: {},
    tags: [],
    eateryDialogOpen: false,
    reviewDialogOpen: false,
    imageDialogOpen: false,
    alertOpen: false,
  };

  constructor(props) {
    super(props);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleEditReview = this.handleEditReview.bind(this);
    this.handleDeleteReview = this.handleDeleteReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }

  async componentDidMount() {
    await this.update();
  }

  handleDialogOpen(name) {
    return () => {
      this.setState({ [name]: true });
    };
  }

  handleDialogClose(name) {
    return async (result) => {
      this.setState({ [name]: false });
      if (result === true) {
        await this.update();
      }
    };
  }

  handleEditReview(review) {
    this.setState({
      review: review._id ? review : {},
      reviewDialogOpen: true,
    });
  }

  handleDeleteReview(review) {
    this.setState({
      review,
      alertOpen: true,
    });
  }

  async update() {
    const { id } = this.props;
    try {
      const eatery = await getEatery(id);
      const tags = await getTagList();
      eatery.reviews = eatery.reviews.filter((review) => review.user);
      eatery.images = _.shuffle(eatery.images.filter((image) => image));
      this.setState({
        eatery,
        tags,
      });
    } catch (err) {
      Router.push('/');
    }
  }

  async deleteReview() {
    const { eatery, review } = this.state;
    try {
      this.setState({ alertOpen: false });
      await deleteReview(eatery._id, review._id);
      await this.update();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { user, classes } = this.props;
    const {
      eatery, tags, eateryDialogOpen, reviewDialogOpen, imageDialogOpen, review, alertOpen,
    } = this.state;
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
                  md={3}>
              <Hidden smDown>
                <NavigationMenu items={tags}/>
              </Hidden>
            </Grid>
            <Grid item
                  sm={12}
                  md={9}>
              <Grid container
                    className={classes.titleWrapper}>
                <Grid item
                      xs>
                  <Typography variant="h5"
                              className={classes.title}>
                    {eatery.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="secondary"
                          onClick={this.handleDialogOpen('eateryDialogOpen')}>
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
                    <Grid container
                          spacing={8}>
                      <Grid item>
                        <LocationIcon fontSize="small"/>
                      </Grid>
                      <Grid item
                            xs>
                        {eatery.address}
                      </Grid>
                    </Grid>
                  )}
                  {eatery.description && (
                    <Grid container
                          spacing={8}>
                      <Grid item>
                        <DescriptionIcon fontSize="small"/>
                      </Grid>
                      <Grid item
                            xs>
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
              <div className={classes.imagesSection}>
                <Grid container
                      spacing={8}
                      className={classes.section}
                      onClick={this.handleDialogOpen('imageDialogOpen')}>
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
              </div>
              {eatery.lat && eatery.lng && (
                <div className={classes.section}>
                  <a target="_blank"
                     href={`https://www.google.com/maps/search/?api=1&query=${eatery.lat},${eatery.lng}`}>
                    <img className={classes.mapImage}
                         src={`https://maps.googleapis.com/maps/api/staticmap?center=${eatery.lat},${eatery.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red|${eatery.lat},${eatery.lng}&key=${GOOGLE_MAP_KEY}`}/>
                  </a>
                </div>
              )}
              <Grid container
                    className={classes.titleWrapper}>
                <Grid item
                      xs>
                  <Typography variant="h5"
                              className={classes.title}>
                    리뷰
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="primary"
                          onClick={this.handleEditReview}>
                    리뷰작성하기
                  </Button>
                </Grid>
              </Grid>
              <div>
                <ReviewList user={user}
                            onEdit={this.handleEditReview}
                            onDelete={this.handleDeleteReview}
                            items={eatery.reviews}/>
              </div>
            </Grid>
          </Grid>
        </main>
        <EateryDialog onClose={this.handleDialogClose('eateryDialogOpen')}
                      open={eateryDialogOpen}
                      {...eatery}/>
        <ReviewDialog onClose={this.handleDialogClose('reviewDialogOpen')}
                      open={reviewDialogOpen}
                      eateryId={eatery._id}
                      {...review}/>
        <ImageDialog onClose={this.handleDialogClose('imageDialogOpen')}
                     open={imageDialogOpen}
                     images={eatery.images}/>
        <Alert open={alertOpen}
               onClose={this.handleDialogClose('alertOpen')}
               message="리뷰를 삭제하시겠습니까?"
               positiveName="삭제"
               positiveAction={this.deleteReview}/>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(Review)), { loginRequired: true });
