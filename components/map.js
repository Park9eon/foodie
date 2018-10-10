import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';


class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{
          lat: 37.499615,
          lng: 127.005799,
        }}
      >
        <Marker position={{
          lat: 37.499615,
          lng: 127.005799,
        }}
        />
      </GoogleMap>
    );
  }
}

export default withGoogleMap(Map);
