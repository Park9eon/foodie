import React from 'react';
import PropTypes from 'prop-types';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

class GoogleMapWrapper extends React.Component {
  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
  };

  static defaultProps = {
    lat: 37.499615,
    lng: 127.005799,
  };

  render() {
    const { lat, lng } = this.props;
    return (
      <GoogleMap defaultZoom={15}
                 defaultCenter={{
                   lat,
                   lng,
                 }}>
        <Marker position={{
          lat,
          lng,
        }}/>
      </GoogleMap>
    );
  }
}

export default withGoogleMap(GoogleMapWrapper);
