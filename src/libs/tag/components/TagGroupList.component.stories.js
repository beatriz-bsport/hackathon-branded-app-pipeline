import React from 'react';

import { object, array } from '@storybook/addon-knobs';

import { storiesOf } from '../../../stories';

import TagGroupList from './TagGroupList.component'

storiesOf('Tag-Management/TagGroupList', module).add('default', () => {
  const tagGroupList = array('tagGroupList', [
      object('Tag Group 1', {
        id: 1,
        name: 'Tag Group 1',
        tags: [
          {
            id: 0,
            name: 'Tag 1',
            group: 1,
          },
          {
            id: 1,
            name: 'Tag 2',
            group: 1,
          },
          {
            id: 2,
            name: 'Tag 3',
            group: 1,
          }
        ]
      }),
      object('Tag Group 2', {
        id: 2,
        name: 'Tag Group 2',
        tags: [
          {
            id: 3,
            name: 'Tag 4',
            group: 2,
          },
          {
            id: 4,
            name: 'Tag 5',
            group: 2,
          },
          {
            id: 5,
            name: 'Tag 6',
            group: 2,
          }
        ]
      })
  ]);
  return <TagGroupList tagGroupList={tagGroupList} />;
});
