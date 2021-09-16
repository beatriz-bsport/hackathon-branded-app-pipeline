// @flow

import React, { Component } from 'react';
import { Icon } from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import './Map.css';

import type { MarkerType } from './types';
import { centerMarker, setZoom, maxDistance } from './utils';

const TILE_LAYER_URL =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';

const MARKER_ASSET = require('./marker-icon-2x.png');

const CENTER = [48.86, 2.33];

type Props = {
  markers: ?Array<MarkerType>,
  zoom: number,
  mapContainerClassName?: string,
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

  constructor(props: Props) {
    super(props);
    this.state.zoom = props.zoom || setZoom(maxDistance(props.markers || []));
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps &&
        prevProps.markers?.length === 0 &&
        this.props.markers?.length !== 0) ||
      prevProps.markers?.length !== this.props.markers?.length
    ) {
      this.setState({
        zoom: setZoom(maxDistance(this.props.markers)),
      });
    }
  }

  renderMarker = (marker: MarkerType) => {
    const { title, location, id } = marker;
    return (
      <Marker
        position={[location.latitude, location.longitude]}
        key={id}
        icon={
          new Icon({
            iconUrl: MARKER_ASSET,
            iconSize: [50, 82],
            iconAnchor: [25, 79],
          })
        }
      >
        <Popup>
          <Grid container spacing={1}>
            <Grid item>
              <Typography variant="subtitle1">{title}</Typography>
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
    const { markers, mapContainerClassName } = this.props;
    const center = markers && markers.length ? centerMarker(markers) : CENTER;

    return (
      <div className={`map-container ${mapContainerClassName || ''}`}>
        <Map
          center={center}
          zoom={this.state.zoom}
          scrollWheelZoom={false}
          boxZoom={false}
        >
          <TileLayer url={TILE_LAYER_URL} variant="light_all" />
          {markers.map((m) => this.renderMarker(m))}
        </Map>
      </div>
    );
  }
}
