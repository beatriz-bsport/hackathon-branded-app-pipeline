// @flow

import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Grid, Typography } from '@material-ui/core';

import './Map.css';

const TILE_LAYER_URL =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';

const CENTER = [48.86, 2.33];

type MarkerType = {
  title: string,
  id: number,
  location: {
    latitude: number,
    longitude: number,
    address: string,
  },
};
type Props = {
  markers: Array<MarkerType>,
};

type State = {
  zoom: number,
};

export default class MyMap extends Component<Props, State> {
  state = {
    zoom: 12,
  };

  static defaultProps = {
    markers: [],
  };

  renderMarker = (marker: MarkerType) => {
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
