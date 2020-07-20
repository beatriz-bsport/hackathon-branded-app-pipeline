// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import MetaActivityListItem from './MetaActivityListItem.component';

import type { MetaActivity } from '../types';

type Props = {
  metaActivities: Array<MetaActivity>,
  goToEdit: (metaActivityId: number) => void,
  goToDetail: (id: number) => void,
  makeActivityCopy: (
    id: number,
    suffix: string,
    options?: OptionCallback,
  ) => void,
  deleteMetaActivity: (metaActivityId: number) => void,
  restoreMetaActivity?: (metaActivityId: number) => Promise<>,
};

export default function MetaActivityList(props: Props) {
  const { metaActivities, goToEdit, goToDetail } = props;
  return (
    <Paper>
      <List disablePadding>
        {metaActivities.map((ma) => (
          <MetaActivityListItem
            divider
            key={ma.id}
            metaActivity={ma}
            goToEdit={goToEdit}
            onClick={ma.customer_enabled ? () => goToDetail(ma.id) : null}
            onClickCopy={props.makeActivityCopy}
            deleteMetaActivity={() => props.deleteMetaActivity(ma.id)}
            restoreMetaActivity={() => props.restoreMetaActivity(ma.id)}
          />
        ))}
      </List>
    </Paper>
  );
}
