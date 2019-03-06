import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel';

import { withStyles } from '@material-ui/core/styles';
import Router from 'next/dist/lib/router';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';
import Header from '../components/Header';
import { maps } from '../lib/api/eatery';

const styles = () => ({
  mapWrapper: {
    position: 'inherit',
    maxHeight: '100%',
    height: '400px',
    '& > div': {
      position: 'inherit !important',
    },
  },
});
const Map = withGoogleMap(({ items }) => (
  <GoogleMap defaultZoom={14}
             defaultCenter={{
               lat: 37.499615,
               lng: 127.005799,
             }}>
    {items && items.map((item) => (
      <MarkerWithLabel key={item._id}
                       labelAnchor={new google.maps.Point(item.name.length * 3, 0)}
                       onClick={() => Router.push(`/review/?id=${item._id}`, `/review/${item._id}`)}
                       labelStyle={{
                         fontSize: '12px',
                         fontWeight: 700,
                       }}
                       position={{
                         lng: item.lng,
                         lat: item.lat,
                       }}>
        <p>{item.name}</p>
      </MarkerWithLabel>
    ))}
  </GoogleMap>
));

class MapWithLayout extends React.Component {
  static propTypes = {
    classes: PropTypes.shape()
      .isRequired,
    user: PropTypes.shape()
      .isRequired,
  };

  state = {
    items: [],
  };

  async componentDidMount() {
    try {
      const items = await maps();
      this.setState({ items });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { classes, user } = this.props;
    const { items } = this.state;
    return (
      <div>
        <Head>
          <title>Osqaure Foodie - Map</title>
        </Head>
        <Header user={user}/>
        <div>
          {items && items.length > 0 && (
            <Map items={items}
                 loadingElement={<div style={{ height: '100%' }}/>}
                 containerElement={<div className={classes.mapWrapper}/>}
                 mapElement={<div style={{ height: '100%' }}/>}/>
          )}
        </div>
      </div>
    );
  }
}

export default withAuth(withLayout(withStyles(styles)(MapWithLayout)), { loginRequired: true });
