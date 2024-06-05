import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import MetaActivityListItem from './MetaActivityListItem.component';
import { OptionCallback } from '../../../state/types';

import type { MetaActivity } from '../types';

type Props = {
  metaActivities: Array<MetaActivity>;
  goToEdit: (metaActivityId: number) => void;
  goToDetail: (metaActivityId: number) => void;
  makeActivityCopy: (
    id: number,
    suffix: string,
    options?: OptionCallback,
  ) => void;
  deleteMetaActivity: (metaActivityId: number) => void;
  restoreMetaActivity?: (metaActivityId: number) => void;
  isWorkshop: boolean;
};

export default function MetaActivityList(props: Props) {
  const { metaActivities, goToEdit, goToDetail, isWorkshop } = props;

  const permissionPartialKey = isWorkshop ? 'workshop' : 'activity';

  return (
    <Paper>
      <List disablePadding>
        <ObjectLevelPermissionProviderComponent
          requiredPermission={[
            `management.${permissionPartialKey}.allowed_actions.edit`,
            `management.${permissionPartialKey}.allowed_actions.delete`,
          ]}
        >
          {([hasEditPermission, hasDeletePermission]: boolean[]) => (
            <>
              {metaActivities.map((ma) => (
                <MetaActivityListItem
                  key={ma.id}
                  divider
                  deleteMetaActivity={
                    hasDeletePermission
                      ? () => props.deleteMetaActivity(ma.id)
                      : null
                  }
                  goToEdit={hasEditPermission ? goToEdit : null}
                  metaActivity={ma}
                  onClick={ma.customer_enabled ? () => goToDetail(ma.id) : null}
                  onClickCopy={
                    hasEditPermission ? props.makeActivityCopy : null
                  }
                  restoreMetaActivity={() => props.restoreMetaActivity(ma.id)}
                />
              ))}
            </>
          )}
        </ObjectLevelPermissionProviderComponent>
      </List>
    </Paper>
  );
}
