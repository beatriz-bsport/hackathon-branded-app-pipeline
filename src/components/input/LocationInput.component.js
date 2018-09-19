// @flow

import _ from 'lodash';
import { Icon } from 'leaflet';
import React, { Component } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const TILE_LAYER_URL =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';
const CENTER = [48.86, 2.33];
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

type Props = {
  value: Object,
  onChange: (Object) => void,
};

type State = {
  id: ?number,
  address: string,
};

export class LocationInput extends Component<Props, State> {
  state = {
    id: null,
    address: '',
    candidate: null,
    center: CENTER,
    zoom: 12,
  };

  constructor(props: Props) {
    super(props);

    Object.keys(props.value || {}).forEach((key) => {
      this.state[key] = props.value[key];
    });
  }

  loadReversed = _.debounce(async (searchText) => {
    const address = encodeURIComponent(searchText);
    const response = await fetch(
      `${BASE_URL}?address=${address}&key=${API_KEY}`,
    );

    if (response.status === 200) {
      const json = await response.json();
      if (json.status === 'OK') {
        this.setState({ candidates: json.results });
      }
    }
  }, 800);

  loadFromPin = async (location) => {
    const latlng = encodeURIComponent(`${location.lat},${location.lng}`);
    const response = await fetch(`${BASE_URL}?latlng=${latlng}&key=${API_KEY}`);

    if (response.status === 200) {
      const json = await response.json();
      if (json.status === 'OK') {
        const candidates = selectEstablishmentFromLocations(json.results);
        this.setState({ candidates });
      }
    }
  };

  change = (event: Object) => {
    const newAddress = event.target.value;
    this.clearState({ address: newAddress });

    this.loadReversed(newAddress);
  };

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
      location: { x: c.geometry.location.lat, y: c.geometry.location.lng },
      address: c.formatted_address,
    });
  };

  clearState = ({ location, address }) => {
    this.setState({
      valid: false,
      candidates: [],
      candidate: [],
      location,
      address,
    });
  };

  handleClickOnMap = (event) => {
    this.clearState({ location: event.latlng });
    this.loadFromPin(event.latlng);
  };

  updateZoom = (e) => {
    this.setState({ center: [e.center.lat, e.center.lng], zoom: e.zoom });
  };

  tempZoomOn = (c) => {};

  renderInputWithCandidates = () => {
    const { candidates, address } = this.state;
    return (
      <div>
        <TextField
          id="address"
          label="Adresse"
          value={address}
          type="text"
          onChange={this.change}
          fullWidth
        />
        <List dense>
          {candidates
            ? candidates.map((c) => (
                <ListItem
                  button
                  key={c.formatted_address}
                  onMouseOver={() => this.tempZoomOn(c)}
                  onClick={() => this.selectCandidate(c)}
                >
                  <ListItemText>{c.formatted_address}</ListItemText>
                </ListItem>
              ))
            : null}
        </List>
      </div>
    );
  };

  render() {
    const { candidates, location, address, center, zoom } = this.state;
    return (
      <div>
        {this.renderInputWithCandidates()}
        <Map
          center={center}
          zoom={zoom}
          onClick={this.handleClickOnMap}
          onZoomAnim={this.updateZoom}
        >
          <TileLayer url={TILE_LAYER_URL} variant="light_all" />
          {location ? (
            <Marker
              position={center}
              icon={
                new Icon({
                  iconUrl: require('../../marker-icon-2x.png'),
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
