/*
 * import React, { Component } from 'react';
import { render } from 'react-dom';
import { Paper } from '@material-ui/core';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [51.505, -0.09];
const map = (
  <Map center={position} zoom={13} style={{ height: 300, width: 300 }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup.<br />Easily customizable.
      </Popup>
    </Marker>
  </Map>
);

export default render(map, document.getElementById('container'));
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from '@material-ui/core';

import './Map.css';

const TILE_LAYER_URL =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';

const CENTER = [48.86, 2.33];

type Props = {
  markers: Array,
  markerClicked: () => void,
};

export default class SimpleExample extends Component<Props> {
  constructor() {
    super();
    this.state = {
      lat: 48.86,
      lng: 2.33,
      zoom: 12,
    };
  }

  static defaultProps = {
    markers: [],
    markerClicked: () => {},
  };

  renderMarker = (marker) => {
    const { markerClicked } = this.props;
    const { location, id } = marker;
    return (
      <Marker position={[location.latitude, location.longitude]}>
        <Button
          onClick={() => {
            markerClicked(id);
          }}
        >
          OOO
        </Button>
      </Marker>
    );
  };

  render() {
    const { markers } = this.props;
    return (
      <div className="map-container">
        <Map center={CENTER} zoom={this.state.zoom}>
          <TileLayer url={TILE_LAYER_URL} variant="light_all" />
          {markers.map((m) => this.renderMarker(m))}
        </Map>
      </div>
    );
  }
}
