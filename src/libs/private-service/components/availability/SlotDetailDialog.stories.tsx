import React from 'react';

import SlotDetailDialog, { Props } from './SlotDetailDialog.component';
import DEFAULT_PROFILE_PICTURE_URL from '../../../../assets/constants';

const CustomTemplate = (args: Props) => <SlotDetailDialog {...args} />;

export const Dialog = CustomTemplate.bind({});

Dialog.args = {
  detailByResourceType: {
    associated_coach: [
      {
        resourceType: 'associated_coach',
        name: 'Uncle Ben',
        photo: DEFAULT_PROFILE_PICTURE_URL,
        slots: [
          {
            date_start: '2022-09-06T08:30:00+01:00',
            date_end: '2022-09-06T13:00:00+01:00',
            restriction_on_associated_establishments: [
              'Etablissement 1',
              'Etablissement 2',
            ],
          },
          {
            date_start: '2022-09-06T14:30:00+01:00',
            date_end: '2022-09-06T15:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T17:30:00+01:00',
            date_end: '2022-09-06T19:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
        ],
      },
      {
        resourceType: 'associated_coach',
        name: 'Matt Pokora',
        photo: DEFAULT_PROFILE_PICTURE_URL,
        slots: [
          {
            date_start: '2022-09-06T08:30:00+01:00',
            date_end: '2022-09-06T13:00:00+01:00',
            restriction_on_associated_establishments: [
              'Etablissement 1',
              'Etablissement 2',
            ],
          },
          {
            date_start: '2022-09-06T14:30:00+01:00',
            date_end: '2022-09-06T15:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T17:30:00+01:00',
            date_end: '2022-09-06T19:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
        ],
      },
    ],
    associated_establishment: [
      {
        resourceType: 'associated_establishemnt',
        name: 'Un établissement respectable',
        photo: DEFAULT_PROFILE_PICTURE_URL,
        slots: [
          {
            date_start: '2022-09-06T08:30:00+01:00',
            date_end: '2022-09-06T13:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T14:30:00+01:00',
            date_end: '2022-09-06T15:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T17:30:00+01:00',
            date_end: '2022-09-06T19:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
        ],
      },
      {
        resourceType: 'associated_establishemnt',
        name: 'Un second établissement tout aussi respectable',
        photo: DEFAULT_PROFILE_PICTURE_URL,
        slots: [
          {
            date_start: '2022-09-06T08:30:00+01:00',
            date_end: '2022-09-06T13:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T14:30:00+01:00',
            date_end: '2022-09-06T15:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T17:30:00+01:00',
            date_end: '2022-09-06T19:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
        ],
      },
    ],
    private_service: [
      {
        resourceType: 'private_service',
        name: 'Séance massage à Gare du Nord',
        photo: DEFAULT_PROFILE_PICTURE_URL,
        slots: [
          {
            date_start: '2022-09-06T08:30:00+01:00',
            date_end: '2022-09-06T13:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T14:30:00+01:00',
            date_end: '2022-09-06T15:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T17:30:00+01:00',
            date_end: '2022-09-06T19:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
        ],
      },
      {
        resourceType: 'private_service',
        name: 'Séance massage à Jaurès',
        photo: DEFAULT_PROFILE_PICTURE_URL,
        slots: [
          {
            date_start: '2022-09-06T08:30:00+01:00',
            date_end: '2022-09-06T13:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T14:30:00+01:00',
            date_end: '2022-09-06T15:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
          {
            date_start: '2022-09-06T17:30:00+01:00',
            date_end: '2022-09-06T19:00:00+01:00',
            restriction_on_associated_establishments: [],
          },
        ],
      },
    ],
  },
};

export default {
  title: 'Library/private-service/SlotDetailDialog',
  component: SlotDetailDialog,
  parameters: {
    docs: {
      page: null,
    },
  },
};
