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
import { Button, withStyles, Grid, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

import './Map.css';

const styles = (theme) => ({});

const TILE_LAYER_URL =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';

const CENTER = [48.86, 2.33];

type Props = {
  markers: Array,
  markerClicked: () => void,
};

export class MyMap extends Component<Props> {
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
    const { t, classes, markerClicked } = this.props;
    const { title, location, id } = marker;
    return (
      <Marker position={[location.latitude, location.longitude]} key={id}>
        <Popup>
          <Grid container spacing={8}>
            <Grid item>
              <Typography variant="title">{title}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption">{location.address}</Typography>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                onClick={() => {
                  markerClicked(id);
                }}
              >
                {t('common.show_more')}
              </Button>
            </Grid>
          </Grid>
        </Popup>
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

export default withStyles(styles)(translate()(MyMap));
