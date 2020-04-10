// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ResourceItem from './ResourceItem.component';

type Props = {
  classes: Object,
  t: TFunction,
  datatype: string,
  resourceList: Array<Resource>,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (Resource) => void,
  resourceSelectedListIds: Array<string>,
};

const ResourceGroup = (props: Props) => {
  const {
    classes,
    t,
    datatype,
    resourceList,
    onSelectResource,
    onUnselectResource,
    onEditResourceConfiguration,
    resourceSelectedListIds,
  } = props;
  return (
    <div className={classes.resourceGroupContainer}>
      <Typography variant="subtitle2" className={classes.title}>
        {t(`resource.datatype.${datatype}`)}
      </Typography>
      <div className={classes.resourceList}>
        {resourceList.map((resourceData) => (
            <ResourceItem
              onSelectResource={onSelectResource}
              onUnselectResource={onUnselectResource}
              onEditResourceConfiguration={(resource) =>
                onEditResourceConfiguration({ data: resource, datatype })
              }
              isSelected={
                !!resourceSelectedListIds.includes(
                  resourceData.resource_identifier,
                )
              }
              key={resourceData.resource_id}
              resource={resourceData}
            />
        ))}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  resourceList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: theme.spacing.unit / 2,
    marginTop: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(ResourceGroup);
