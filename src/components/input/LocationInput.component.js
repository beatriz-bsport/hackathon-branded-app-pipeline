// @flow

import _ from 'lodash';
import { Icon } from 'leaflet';
import React, { Component } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import IconDone from '@material-ui/icons/Done';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import Config from '../../config';

// prettier-ignore
const TILE_LAYER_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';
const CENTER = [48.86, 2.33];
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = Config.REACT_APP_GOOGLE_MAPS_API_KEY;

const MARKER_ASSET = require('../../marker-icon-2x.png');

type Props = {
  value: Object,
  onChange: (Object) => void,
};

type State = {
  address: string,
};

export class LocationInput extends Component<Props, State> {
  state = {
    address: '',
    center: CENTER,
    zoom: 12,
    isLoading: false,
    candidates: [],
  };

  constructor(props: Props) {
    super(props);

    if (props.value) {
      this.state.address = props.value.address;
      if (props.value.location) {
        this.state.location = {
          lat: props.value.location.y,
          lng: props.value.location.x,
        };
      }
    }
  }

  /**
   * Load address candidates from a user typed address
   */
  loadReversed = _.debounce(async (searchText) => {
    const address = encodeURIComponent(searchText);
    this.setState({ isLoading: true });
    const response = await fetch(
      `${BASE_URL}?address=${address}&key=${API_KEY}`,
    );
    this.setState({ isLoading: false });

    if (response.status === 200) {
      const json = await response.json();
      if (json.status === 'OK') {
        this.setState({ candidates: json.results });
      }
    }
  }, 800);

  /**
   * Load address candidates from a given map location
   */
  loadFromPin = async (location) => {
    const latlng = encodeURIComponent(`${location.lat},${location.lng}`);
    this.setState({ isLoading: true });
    const response = await fetch(`${BASE_URL}?latlng=${latlng}&key=${API_KEY}`);

    this.setState({ isLoading: false });
    if (response.status === 200) {
      const json = await response.json();
      if (json.status === 'OK') {
        const candidates = selectEstablishmentFromLocations(json.results);
        this.setState({ candidates });
      }
    }
  };

  /**
   * Edit the address in the input
   */
  change = (event: Object) => {
    const newAddress = event.target.value;
    this.clearState({ address: newAddress });

    this.loadReversed(newAddress);
  };

  /**
   * Select a candidate from the list of address
   */
  selectCandidate = (c) => {
    this.clearState({
      address: c.formatted_address,
      location: c.geometry.location,
    });
    const { zoom } = this.state;
    this.setState({
      center: [c.geometry.location.lat, c.geometry.location.lng],
      zoom: Math.max(zoom, 17),
      valid: true,
    });

    this.props.onChange({
      location: { x: c.geometry.location.lng, y: c.geometry.location.lat },
      address: c.formatted_address,
    });
  };

  clearState = ({ location, address }) => {
    this.setState({
      valid: false,
      candidates: [],
      location: location || '',
      address: address || '',
    });
  };

  /**
   * Handle click on the map:
   * -> The user pin a position
   * -> We load possible address candidates
   */
  handleClickOnMap = (event) => {
    this.clearState({ location: event.latlng });
    this.loadFromPin(event.latlng);
  };

  /**
   * Update zoom and center when the user move on the map
   */
  updateZoom = (e) => {
    this.setState({ center: [e.center.lat, e.center.lng], zoom: e.zoom });
  };

  tempZoomOn = () => {};

  renderInputWithCandidates = () => {
    const { candidates, address, isLoading, valid } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item xs>
            <TextField
              id="address"
              label="Adresse"
              value={address}
              type="text"
              onChange={this.change}
              fullWidth
            />
          </Grid>
          {isLoading ? (
            <Grid item xs={1}>
              <CircularProgress size={20} />
            </Grid>
          ) : null}
          {valid ? (
            <Grid item xs={1}>
              <Grid
                container
                justify="center"
                direction="column"
                alignItems="center"
                style={{ height: '100%' }}
              >
                <IconDone color="primary" />
              </Grid>
            </Grid>
          ) : null}
        </Grid>
        <List dense>
          {candidates
            ? candidates.map((c) => (
                // eslint-disable-next-line
                <ListItem
                  button
                  key={c.formatted_address}
                  onMouseOver={() => this.tempZoomOn()}
                  onClick={() => this.selectCandidate(c)}
                >
                  <ListItemText>{c.formatted_address}</ListItemText>
                </ListItem>
                // eslint-disable-next-line
              ))
            : null}
        </List>
      </div>
    );
  };

  render() {
    const { location, address, center, zoom } = this.state;
    return (
      <div>
        {this.renderInputWithCandidates()}
        <Map
          id="cy-map-container"
          center={center}
          zoom={zoom}
          onClick={this.handleClickOnMap}
          onZoomAnim={this.updateZoom}
        >
          <TileLayer url={TILE_LAYER_URL} variant="light_all" />
          {location ? (
            <Marker
              position={location}
              icon={
                new Icon({
                  iconUrl: MARKER_ASSET,
                  iconSize: [50, 82],
                  iconAnchor: [25, 79],
                })
              }
            >
              <Popup>{address}</Popup>
            </Marker>
          ) : null}
        </Map>
      </div>
    );
  }
}

function selectEstablishmentFromLocations(candidates) {
  return _.uniqBy(
    candidates.filter((c) => {
      const { types } = c;
      return (
        types.includes('establishment') || types.includes('street_address')
      );
    }),
    'formatted_address',
  );
}

export default LocationInput;
