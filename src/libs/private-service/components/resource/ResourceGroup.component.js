// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
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
  let allAreSelected = null;
  if (
    resourceList.reduce(
      (acc, v) =>
        acc && resourceSelectedListIds.includes(v.resource_identifier),
      true,
    )
  ) {
    allAreSelected = true;
  }
  if (
    !resourceList.reduce(
      (acc, v) =>
        acc || resourceSelectedListIds.includes(v.resource_identifier),
      false,
    )
  ) {
    allAreSelected = false;
  }
  return (
    <div className={classes.resourceGroupContainer}>
      <div className={classes.header}>
        <Checkbox
          indeterminate={allAreSelected === null}
          checked={allAreSelected}
          onChange={(ev) => {
            if (ev.target.checked) {
              onSelectResource(resourceList.map((r) => r.resource_identifier));
            } else {
              onUnselectResource(
                resourceList.map((r) => r.resource_identifier),
              );
            }
          }}
        />
        <Typography variant="subtitle2" className={classes.title}>
          {t(`resource.datatype.${datatype}`)}
        </Typography>
      </div>
      <div className={classes.resourceList}>
        {resourceList.map((resourceData) => {
          const isSelected = !!resourceSelectedListIds.includes(
            resourceData.resource_identifier,
          );
          return (
            <ResourceItem
              onSelectResource={onSelectResource}
              onUnselectResource={onUnselectResource}
              onEditResourceConfiguration={(resource) => {
                if (
                  !onEditResourceConfiguration &&
                  !!onSelectResource &&
                  !!onUnselectResource
                ) {
                  /* eslint-disable */
                  if (!isSelected)
                    onSelectResource(resourceData.resource_identifier);
                  if (isSelected)
                    onUnselectResource(resourceData.resource_identifier);
                } else {
                  onEditResourceConfiguration({ data: resource, datatype });
                }
                /* eslint-enable */
              }}
              isSelected={isSelected}
              key={resourceData.resource_id}
              resource={resourceData}
            />
          );
        })}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    marginBottom: theme.spacing(1) / 2,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(ResourceGroup);
