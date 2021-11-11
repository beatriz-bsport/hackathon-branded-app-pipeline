// @flow

import _ from 'lodash';
import { Icon } from 'leaflet';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import IconDone from '@material-ui/icons/Done';
import SearchIcon from '@material-ui/icons/Search';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import InputAdornment from '@material-ui/core/InputAdornment';
import type { TFunction } from 'react-i18next';
import Config from '../../config';

// prettier-ignore
const TILE_LAYER_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';
const CENTER = [48.86, 2.33];
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const API_KEY = Config.REACT_APP_GOOGLE_MAPS_API_KEY;
const MARKER_ASSET = require('./marker-icon-2x.png');

type Props = {
  t: TFunction,
  value: Object,
  onChange: (Object) => void,
  required?: boolean,
};

type State = {
  address: string,
  address_line_1: string,
  address_line_2: string,
  generated_address: string,
  city: string,
  zipcode: string,
  country: string,
  candidates: Array<any>,
  center: Array<number>,
  geometry: Object<number>,
  valid: boolean,
  isLoading: boolean,
  zoom: number,
};

export class LocationInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.value) {
      this.state = {
        ...props.value,
        candidates: [],
        center: [props.value.geometry.x, props.value.geometry.y],
        zoom: 12,
        valid: true,
        isLoading: false,
        generated_address: '',
      };
    } else {
      this.state = {
        address: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        zipcode: '',
        country: '',
        candidates: [],
        center: CENTER,
        zoom: 12,
        valid: false,
        isLoading: false,
        geometry: { x: 0, y: 0 },
        generated_address: '',
      };
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
        this.setState({
          geometry: { x: location.lat, y: location.lng },
          candidates,
        });
      }
    }
  };

  /**
   * Edit the address in the input
   */
  change = (event: Object) => {
    const newAddress = event.target.value;

    this.clearState({ generated_address: newAddress });
    this.loadReversed(newAddress);
  };

  changeAddressField = (id: string, value: any) => {
    this.setState({ [id]: value }, () => this.props.onChange(this.state));
  };

  /**
   * Select a candidate from the list of address
   */
  handleFormatingCandidateAddressToState = (c) => {
    const address_line_1 = `${
      c.address_components.find((comp) => comp.types.includes('street_number'))
        ? c.address_components.find((comp) =>
            comp.types.includes('street_number'),
          ).short_name
        : ''
    } ${
      c.address_components.find((comp) => comp.types.includes('route'))
        ? c.address_components.find((comp) => comp.types.includes('route'))
            .short_name
        : ''
    }`;
    return {
      generated_address: c.formatted_address,
      street_number: c.address_components.find((comp) =>
        comp.types.includes('street_number'),
      )
        ? c.address_components.find((comp) =>
            comp.types.includes('street_number'),
          ).short_name
        : '',
      route: c.address_components.find((comp) => comp.types.includes('route'))
        ? c.address_components.find((comp) => comp.types.includes('route'))
            .short_name
        : '',
      address_line_1,
      address_line_2: '',
      city: c.address_components.find((comp) => comp.types.includes('locality'))
        ? c.address_components.find((comp) => comp.types.includes('locality'))
            .short_name
        : '',
      country: c.address_components.find((comp) =>
        comp.types.includes('country'),
      )
        ? c.address_components.find((comp) => comp.types.includes('country'))
            .long_name
        : '',
      zipcode: c.address_components.find((comp) =>
        comp.types.includes('postal_code'),
      )
        ? c.address_components.find((comp) =>
            comp.types.includes('postal_code'),
          ).short_name
        : '',
      geometry: { x: c.geometry.location.lat, y: c.geometry.location.lng },
    };
  };

  selectCandidate = (c) => {
    const { street_number, route, ...InputToState } =
      this.handleFormatingCandidateAddressToState(c);
    const { zoom } = this.state;
    this.setState(
      {
        center: [c.geometry.location.lat, c.geometry.location.lng],
        candidates: [],
        zoom: Math.max(zoom, 12),
        valid: true,
        ...InputToState,
      },
      () => this.props.onChange(InputToState),
    );
  };

  clearState = ({
    address_line_1,
    address_line_2,
    city,
    zipcode,
    country,
    generated_address,
  }) => {
    this.setState({
      valid: false,
      generated_address: generated_address || '',
      candidates: [],
      address_line_1: address_line_1 || '',
      address_line_2: address_line_2 || '',
      city: city || '',
      zipcode: zipcode || '',
      country: country || '',
    });
  };

  /**
   * Handle click on the map:
   * -> The user pin a position
   * -> We load possible address candidates
   */
  handleClickOnMap = (event) => {
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
    const {
      candidates,
      generated_address,
      address_line_1,
      address_line_2,
      city,
      zipcode,
      country,
      isLoading,
      valid,
      geometry,
    } = this.state;
    const { t } = this.props;
    return (
      <fieldset>
        <legend> {t('establishment:location.address')}</legend>
        <Grid container>
          <Grid item xs>
            <TextField
              id="address_generate"
              label={t('establishment:location.search_address')}
              value={generated_address}
              type="text"
              onChange={this.change}
              required={!geometry.x || !geometry.y}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isLoading ? <CircularProgress size={20} /> : null}
                    {!isLoading && valid ? <IconDone color="primary" /> : null}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <List dense>
          <Paper>
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
          </Paper>
        </List>
        <Grid item xs>
          <TextField
            id="address_line_1"
            value={address_line_1}
            type="text"
            onChange={(e) =>
              this.changeAddressField('address_line_1', e.target.value)
            }
            required={this.props.required}
            disabled={!geometry.x || !geometry.y}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormHelperText>
                    {t('establishment:location.address_line_1')}
                  </FormHelperText>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="address_line_2"
            value={address_line_2}
            type="text"
            onChange={(e) =>
              this.changeAddressField('address_line_2', e.target.value)
            }
            disabled={!geometry.x || !geometry.y}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormHelperText>
                    {t('establishment:location.address_line_2')}
                  </FormHelperText>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="city"
            value={city}
            type="text"
            onChange={(e) => this.changeAddressField('city', e.target.value)}
            required={this.props.required}
            disabled={!geometry.x || !geometry.y}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormHelperText>
                    {t('establishment:location.city')}
                  </FormHelperText>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="zipcode"
            value={zipcode}
            type="text"
            onChange={(e) => this.changeAddressField('zipcode', e.target.value)}
            disabled={!geometry.x || !geometry.y}
            required={this.props.required}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormHelperText>
                    {t('establishment:location.zip_code')}
                  </FormHelperText>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="country"
            value={country}
            type="text"
            onChange={(e) => this.changeAddressField('country', e.target.value)}
            disabled={!geometry.x || !geometry.y}
            required={this.props.required}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormHelperText>
                    {t('establishment:location.country')}
                  </FormHelperText>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </fieldset>
    );
  };

  render() {
    const { geometry, address_line_1, address_line_2, center, zoom } =
      this.state;
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
          {geometry ? (
            <Marker
              position={[geometry.x, geometry.y]}
              icon={
                new Icon({
                  iconUrl: MARKER_ASSET,
                  iconSize: [50, 82],
                  iconAnchor: [25, 79],
                })
              }
            >
              <Popup>{address_line_1.concat(',', address_line_2)}</Popup>
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
