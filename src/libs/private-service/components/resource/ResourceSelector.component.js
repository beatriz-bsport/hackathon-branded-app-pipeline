// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';

import ResourceGroup from './ResourceGroup.component';

type Props = {
  classes: Object,
  resourceSelectedListIds: Array<string>,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (Resource) => void,
  resourceAvailable: Array<ResourceGroupType>,
};

export const ResourceSelector = (props: Props) => {
  return (
    <div className={props.classes.container}>
      {props.resourceAvailable.map(({ datatype, data }) => (
        <ResourceGroup
          datatype={datatype}
          resourceList={data}
          resourceSelectedListIds={props.resourceSelectedListIds}
          key={datatype}
          onSelectResource={props.onSelectResource}
          onUnselectResource={props.onUnselectResource}
          onEditResourceConfiguration={props.onEditResourceConfiguration}
        />
      ))}
    </div>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

export default compose(
  withStyles(styles),
  withHandlers({
    onUnselectResource: ({ setResourceFiltered, resourceSelectedListIds }) => (
      resource_identifier,
    ) => {
      setResourceFiltered(
        resourceSelectedListIds.filter((i) => i !== resource_identifier),
      );
    },
    onSelectResource: ({ setResourceFiltered, resourceSelectedListIds }) => (
      resource_identifier,
    ) => {
      setResourceFiltered([...resourceSelectedListIds, resource_identifier]);
    },
  }),
)(ResourceSelector);
