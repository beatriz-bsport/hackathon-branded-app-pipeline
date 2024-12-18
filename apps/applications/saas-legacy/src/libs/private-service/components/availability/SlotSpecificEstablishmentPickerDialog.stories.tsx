import React from 'react';

import SlotSpecificEstablishmentPickerDialog, {
  Props,
} from './SlotSpecificEstablishmentDialog.component';

const CustomTemplate = (args: Props) => (
  <SlotSpecificEstablishmentPickerDialog {...args} />
);

export const Dialog = CustomTemplate.bind({});

Dialog.args = {
  establishments: [
    {
      id: 3587,
      title: 'Salle 1',
      cover: null,
      location: {
        address: '32 Av. de Beaujeu, 78990 Élancourt, France',
        address_line_1: '32 Av. de Beaujeu',
        address_line_2: '',
        zipcode: '78990',
        city: 'Élancourt',
        state: 'Île-de-France',
        country: 'France',
        country_code: '',
        geometry: 'SRID=4326;POINT (48.7717421 1.9677815)',
        latitude: 48.7717421,
        longitude: 1.9677815,
        geocoded_data: {
          types: ['street_address'],
          geometry: {
            location: {
              lat: 48.7717421,
              lng: 1.9677815,
            },
            viewport: {
              northeast: {
                lat: 48.7730801802915,
                lng: 1.969140630291502,
              },
              southwest: {
                lat: 48.7703822197085,
                lng: 1.966442669708498,
              },
            },
            location_type: 'ROOFTOP',
          },
          place_id: 'ChIJcU6sx5qD5kcR4d6Rk5iuF4Q',
          plus_code: {
            global_code: '8FW3QXC9+M4',
            compound_code: 'QXC9+M4 Élancourt, France',
          },
          formatted_address: '32 Av. de Beaujeu, 78990 Élancourt, France',
          address_components: [
            {
              types: ['street_number'],
              long_name: '32',
              short_name: '32',
            },
            {
              types: ['route'],
              long_name: 'Avenue de Beaujeu',
              short_name: 'Av. de Beaujeu',
            },
            {
              types: ['locality', 'political'],
              long_name: 'Élancourt',
              short_name: 'Élancourt',
            },
            {
              types: ['administrative_area_level_2', 'political'],
              long_name: 'Yvelines',
              short_name: 'Yvelines',
            },
            {
              types: ['administrative_area_level_1', 'political'],
              long_name: 'Île-de-France',
              short_name: 'IDF',
            },
            {
              types: ['country', 'political'],
              long_name: 'France',
              short_name: 'FR',
            },
            {
              types: ['postal_code'],
              long_name: '78990',
              short_name: '78990',
            },
          ],
        },
      },
      specific_info: 'coucou',
      easy_access: {
        id: 3688,
        lines: ['LIGNE N', 'LIGNE U'],
        name: 'La Verrière',
      },
      associatedestablishment_set: [3452],
      related_company: 614,
      tzname: 'Europe/London',
      practical_info: '',
      capacity: 30,
      disabled: false,
      has_next_slots: false,
      establishment_billing_group_id: null,
      associated_establishent_id: 3452,
    },
    {
      id: 3588,
      title: 'Salle 2',
      cover: null,
      location: {
        address: '32 Av. de Beaujeu, 69400 Arnas, France',
        address_line_1: '32 Av. de Beaujeu',
        address_line_2: '',
        zipcode: '69400',
        city: 'Arnas',
        state: 'Auvergne-Rhône-Alpes',
        country: 'France',
        country_code: '',
        geometry: 'SRID=4326;POINT (46.0079416 4.7255799)',
        latitude: 46.0079416,
        longitude: 4.7255799,
        geocoded_data: {
          types: ['street_address'],
          geometry: {
            location: {
              lat: 46.0079416,
              lng: 4.7255799,
            },
            viewport: {
              northeast: {
                lat: 46.00929058029149,
                lng: 4.726928880291502,
              },
              southwest: {
                lat: 46.0065926197085,
                lng: 4.724230919708497,
              },
            },
            location_type: 'RANGE_INTERPOLATED',
          },
          place_id:
            'EiYzMiBBdi4gZGUgQmVhdWpldSwgNjk0MDAgQXJuYXMsIEZyYW5jZSIwEi4KFAoSCc3ixGHDhPRHEfLmCLbE5NdMECAqFAoSCXGfXBfDhPRHEUwfNtWCWfFi',
          formatted_address: '32 Av. de Beaujeu, 69400 Arnas, France',
          address_components: [
            {
              types: ['street_number'],
              long_name: '32',
              short_name: '32',
            },
            {
              types: ['route'],
              long_name: 'Avenue de Beaujeu',
              short_name: 'Av. de Beaujeu',
            },
            {
              types: ['locality', 'political'],
              long_name: 'Arnas',
              short_name: 'Arnas',
            },
            {
              types: ['administrative_area_level_2', 'political'],
              long_name: 'Rhône',
              short_name: 'Rhône',
            },
            {
              types: ['administrative_area_level_1', 'political'],
              long_name: 'Auvergne-Rhône-Alpes',
              short_name: 'Auvergne-Rhône-Alpes',
            },
            {
              types: ['country', 'political'],
              long_name: 'France',
              short_name: 'FR',
            },
            {
              types: ['postal_code'],
              long_name: '69400',
              short_name: '69400',
            },
          ],
        },
      },
      specific_info: 'jdlks',
      easy_access: {
        id: 4359,
        lines: ['L'],
        name: 'Lyon',
      },
      associatedestablishment_set: [3453],
      related_company: 614,
      tzname: 'Europe/London',
      practical_info: '',
      capacity: 30,
      disabled: false,
      has_next_slots: false,
      establishment_billing_group_id: null,
      associated_establishent_id: 3453,
    },
    {
      id: 3586,
      title: 'Spot Schedu',
      cover: null,
      location: {
        address: '32 Av. de Beaujeu, 78990 Élancourt, France',
        address_line_1: '32 Av. de Beaujeu',
        address_line_2: '',
        zipcode: '78990',
        city: 'Élancourt',
        state: 'Île-de-France',
        country: 'France',
        country_code: '',
        geometry: 'SRID=4326;POINT (48.7717421 1.9677815)',
        latitude: 48.7717421,
        longitude: 1.9677815,
        geocoded_data: {},
      },
      specific_info: 'ling',
      easy_access: {
        id: 3688,
        lines: ['LIGNE N', 'LIGNE U'],
        name: 'La Verrière',
      },
      associatedestablishment_set: [3451],
      related_company: 614,
      tzname: 'Europe/London',
      practical_info: '',
      capacity: 30,
      disabled: false,
      has_next_slots: true,
      establishment_billing_group_id: 32,
      associated_establishent_id: 3451,
    },
  ],
};

export default {
  title: 'Library/private-service/SlotSpecificEstablishmentPickerDialog',
  component: SlotSpecificEstablishmentPickerDialog,
  parameters: {
    docs: {
      page: null,
    },
  },
};
