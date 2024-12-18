import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { ALLOWED_COUNTRIES_FOR_STATES_LONG_NAMES } from '../../libs/establishment/constants';
import type { GeocodingResult } from './types';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { Icon, LeafletMouseEvent, ZoomAnimEvent } from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Config from '../../config';

const TILE_LAYER_URL: string =
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.png';
const BASE_URL: string = 'https://maps.googleapis.com/maps/api/geocode/json';

const API_KEY = Config.REACT_APP_GOOGLE_MAPS_API_KEY;
const MARKER_ASSET = require('./marker-icon-2x.png');

type GeometryCoordinates = {
  x: number;
  y: number;
};

type AddressState = {
  address_line_1: string;
  address_line_2: string;
  generated_address: string;
  state: string;
  city: string;
  zipcode: string;
  country: string;
  country_code: string;
  candidates?: GeocodingResult[];
  geometry: GeometryCoordinates;
  valid?: boolean;
  isLoading?: boolean;
};

type LocationInputProps = {
  value: AddressState;
  onChange: (value: AddressState) => void;
  required?: boolean;
};

type CandidatesInputProps = {
  state: string;
  required?: boolean;
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  selectCandidate: (c: GeocodingResult) => void;
  changeAddressField: (event: ChangeEvent<HTMLInputElement>) => void;
} & AddressState;

const initialState: AddressState = {
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  country_code: '',
  candidates: [],
  valid: false,
  isLoading: false,
  geometry: { x: 0, y: 0 },
  generated_address: '',
};

const CandidatesInput: React.FC<CandidatesInputProps> = ({
  candidates,
  generated_address,
  address_line_1,
  address_line_2,
  state,
  city,
  zipcode,
  country,
  country_code,
  isLoading,
  valid,
  geometry,
  required,
  change,
  selectCandidate,
  changeAddressField,
}) => {
  const { t } = useTranslation();

  return (
    <fieldset>
      <legend> {t('establishment:location.address')}</legend>
      <Grid container>
        <Grid item xs>
          <TextField
            fullWidth
            id="address_generate"
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
            label={t('establishment:location.search_address')}
            onChange={change}
            required={!geometry?.x || !geometry?.y}
            type="text"
            value={generated_address}
            variant="outlined"
          />
        </Grid>
      </Grid>
      <List dense>
        <Paper>
          {candidates
            ? candidates.map((c) => (
                <ListItem
                  key={c.formatted_address}
                  button
                  onClick={() => selectCandidate(c)}
                >
                  <ListItemText>{c.formatted_address}</ListItemText>
                </ListItem>
              ))
            : null}
        </Paper>
      </List>
      <Grid item xs>
        <TextField
          fullWidth
          disabled={!geometry.x || !geometry.y}
          id="address_line_1"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormHelperText>
                  {t('establishment:location.address_line_1')}
                </FormHelperText>
              </InputAdornment>
            ),
          }}
          onChange={changeAddressField}
          required={required}
          type="text"
          value={address_line_1}
        />
        <TextField
          fullWidth
          disabled={!geometry.x || !geometry.y}
          id="address_line_2"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormHelperText>
                  {t('establishment:location.address_line_2')}
                </FormHelperText>
              </InputAdornment>
            ),
          }}
          onChange={changeAddressField}
          type="text"
          value={address_line_2}
        />
        {(ALLOWED_COUNTRIES_FOR_STATES_LONG_NAMES.includes(country) ||
          ['US', 'CA'].includes(country_code)) && (
          <TextField
            fullWidth
            disabled={!geometry.x || !geometry.y}
            id="state"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormHelperText>
                    {t('establishment:location.state')}
                  </FormHelperText>
                </InputAdornment>
              ),
            }}
            onChange={changeAddressField}
            required={required}
            type="text"
            value={state}
          />
        )}
        <TextField
          fullWidth
          disabled={!geometry.x || !geometry.y}
          id="city"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormHelperText>
                  {t('establishment:location.city')}
                </FormHelperText>
              </InputAdornment>
            ),
          }}
          onChange={changeAddressField}
          required={required}
          type="text"
          value={city}
        />
        <TextField
          fullWidth
          disabled={!geometry.x || !geometry.y}
          id="zipcode"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormHelperText>
                  {t('establishment:location.zip_code')}
                </FormHelperText>
              </InputAdornment>
            ),
          }}
          onChange={changeAddressField}
          required={required}
          type="text"
          value={zipcode}
        />
        <TextField
          fullWidth
          disabled={!geometry.x || !geometry.y}
          id="country"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FormHelperText>
                  {t('establishment:location.country')}
                </FormHelperText>
              </InputAdornment>
            ),
          }}
          onChange={changeAddressField}
          required={required}
          type="text"
          value={country}
        />
      </Grid>
    </fieldset>
  );
};

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const baseAddress: AddressState = value
    ? {
        ...value,
        candidates: [],
        valid: true,
        isLoading: false,
        generated_address: '',
      }
    : initialState;
  const [selectedAddress, setSelectedAddress] =
    useState<AddressState>(baseAddress);
  const previousSelectedAddress = useRef<AddressState>(baseAddress);
  const [zoom, setZoom] = useState<number>(12);
  const [center, setCenter] = useState<[number, number]>(
    value && value.geometry
      ? [value.geometry.x, value.geometry.y]
      : [48.86, 2.33],
  );

  useEffect(() => {
    if (previousSelectedAddress.current !== selectedAddress) {
      onChange(selectedAddress);
      previousSelectedAddress.current = selectedAddress;
    }
  }, [selectedAddress, previousSelectedAddress, onChange]);

  const loadReversed = debounce(async (searchText: string) => {
    const searchAddress = encodeURIComponent(searchText);
    setSelectedAddress((prevState) => ({ ...prevState, isLoading: true }));
    const response = await fetch(
      `${BASE_URL}?address=${searchAddress}&key=${API_KEY}`,
    );
    setSelectedAddress((prevState) => ({ ...prevState, isLoading: false }));

    if (response.status === 200) {
      const json = await response.json();
      if (json.status === 'OK') {
        setSelectedAddress((prevState) => ({
          ...prevState,
          candidates: json.results,
        }));
      }
    }
  }, 800);

  const loadFromPin = async (location: { lat: number; lng: number }) => {
    const latlng = encodeURIComponent(`${location.lat},${location.lng}`);
    setSelectedAddress((prevState) => ({ ...prevState, isLoading: true }));
    const response = await fetch(`${BASE_URL}?latlng=${latlng}&key=${API_KEY}`);

    setSelectedAddress((prevState) => ({ ...prevState, isLoading: false }));
    if (response.status === 200) {
      const json = await response.json();
      if (json.status === 'OK') {
        const candidates = selectEstablishmentFromLocations(json.results);
        setSelectedAddress((prevState) => ({
          ...prevState,
          geometry: { x: location.lat, y: location.lng },
          candidates,
        }));
      }
    }
  };

  const handleFormatingCandidateAddressToState = useCallback(
    (c: GeocodingResult): AddressState => {
      const getComponent = (type: string) =>
        c.address_components.find((comp) => comp.types.includes(type))
          ?.short_name || '';

      const address_line_1 = `${getComponent('street_number')} ${getComponent(
        'route',
      )}`;

      return {
        generated_address: c.formatted_address,
        address_line_1,
        address_line_2: '',
        state:
          c.address_components.find((comp) =>
            comp.types.includes('administrative_area_level_1'),
          )?.long_name || '',
        city: getComponent('locality'),
        country:
          c.address_components.find((comp) => comp.types.includes('country'))
            ?.long_name || '',
        country_code: getComponent('country'),
        zipcode: getComponent('postal_code'),
        geometry: { x: c.geometry.location.lat, y: c.geometry.location.lng },
      };
    },
    [],
  );

  const selectCandidate = useCallback(
    (c: GeocodingResult) => {
      const InputToState = handleFormatingCandidateAddressToState(c);

      setSelectedAddress((prevState) => ({
        ...prevState,
        candidates: [],
        valid: true,
        ...InputToState,
      }));
      setCenter([c.geometry.location.lat, c.geometry.location.lng]);
      setZoom(Math.max(zoom, 12));
      onChange(InputToState);
    },
    [
      onChange,
      handleFormatingCandidateAddressToState,
      zoom,
      setZoom,
      setCenter,
    ],
  );

  const clearState = useCallback(
    ({
      address_line_1,
      address_line_2,
      state,
      city,
      zipcode,
      country,
      generated_address,
    }) => {
      setSelectedAddress((prevState) => ({
        ...prevState,
        valid: false,
        generated_address: generated_address || '',
        candidates: [],
        address_line_1: address_line_1 || '',
        address_line_2: address_line_2 || '',
        state: state || '',
        city: city || '',
        zipcode: zipcode || '',
        country: country || '',
      }));
    },
    [],
  );

  const handleClickOnMap = useCallback((event: LeafletMouseEvent) => {
    loadFromPin(event.latlng);
  }, []);

  const updateZoom = useCallback(
    (e: ZoomAnimEvent) => {
      setCenter([e.center.lat, e.center.lng]);
      setZoom(e.zoom);
    },
    [setZoom, setCenter],
  );

  const change = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newAddress = event.target.value;
      clearState({ generated_address: newAddress });
      loadReversed(newAddress);
    },
    [loadReversed, clearState],
  );

  const changeAddressField = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const id = event.target.id;
      const newValue = event.target.value;
      setSelectedAddress((prevState) => ({ ...prevState, [id]: newValue }));
      onChange({ ...selectedAddress, [id]: newValue });
    },
    [onChange, selectedAddress],
  );

  return (
    <div>
      <CandidatesInput
        address_line_1={selectedAddress.address_line_1}
        address_line_2={selectedAddress.address_line_2}
        candidates={selectedAddress.candidates}
        change={change}
        changeAddressField={changeAddressField}
        city={selectedAddress.city}
        country={selectedAddress.country}
        country_code={selectedAddress.country_code}
        generated_address={selectedAddress.generated_address}
        geometry={selectedAddress.geometry}
        isLoading={selectedAddress.isLoading}
        required={required}
        selectCandidate={selectCandidate}
        state={selectedAddress.state}
        valid={selectedAddress.valid}
        zipcode={selectedAddress.zipcode}
      />
      <Map
        center={center}
        id="cy-map-container"
        onClick={handleClickOnMap}
        onZoomAnim={updateZoom}
        zoom={zoom}
      >
        <TileLayer url={TILE_LAYER_URL} variant="light_all" />
        {selectedAddress.geometry ? (
          <Marker
            icon={
              new Icon({
                iconUrl: MARKER_ASSET,
                iconSize: [50, 82],
                iconAnchor: [25, 79],
              })
            }
            position={[selectedAddress.geometry.x, selectedAddress.geometry.y]}
          >
            <Popup>
              {selectedAddress.address_line_1.concat(
                ',',
                selectedAddress.address_line_2,
              )}
            </Popup>
          </Marker>
        ) : null}
      </Map>
    </div>
  );
};

function selectEstablishmentFromLocations(candidates: GeocodingResult[]) {
  return uniqBy(
    candidates.filter((c) => {
      const { types } = c;
      return (
        types.includes('establishment') || types.includes('street_address')
      );
    }),
    'formatted_address',
  );
}

export default React.memo(LocationInput);
