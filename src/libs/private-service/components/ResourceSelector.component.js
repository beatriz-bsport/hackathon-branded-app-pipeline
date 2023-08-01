// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';

import VisibilityOnIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ButtonBase from '@material-ui/core/ButtonBase';

import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';

const ResourceItem = ({
  resource,
  isSelected,
  onSelectResource,
  onUnselectResource,
  onEditResourceConfiguration,
  classes,
}: {
  resource: {
    id: number,
    color: string,
    name: string,
    resource_identifier: string,
  },
  isSelected: boolean,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (ResourceData) => void,
  classes: Object,
}) => {
  const { name, color, resource_identifier } = resource;
  return (
    <ButtonBase
      className={classes.resourceContainer}
      onClick={() => onEditResourceConfiguration(resource)}
    >
      <div
        style={{
          width: 16,
          height: 16,
          backgroundColor: color || '#DCF3D8',
        }}
      />
      <Typography className={classes.resourceName}>{name}</Typography>
      {isSelected ? (
        <ButtonBase
          onClick={(ev) => {
            ev.stopPropagation();
            onUnselectResource(resource_identifier);
          }}
        >
          <VisibilityOnIcon />
        </ButtonBase>
      ) : (
        <ButtonBase
          onClick={(ev) => {
            ev.stopPropagation();
            onSelectResource(resource_identifier);
          }}
        >
          <VisibilityOffIcon />
        </ButtonBase>
      )}
    </ButtonBase>
  );
};

const ResourceGroup = ({
  classes,
  t,
  datatype,
  resourceList,
  onSelectResource,
  onUnselectResource,
  onEditResourceConfiguration,
  resourceSelectedListIds,
}: {
  classes: Object,
  t: TFunction,
  datatype: string,
  resourceList: Array<ResourceData>,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (ResourceData) => void,
  resourceSelectedListIds: Array<string>,
}) => {
  return (
    <div className={classes.resourceGroupContainer}>
      <Typography className={classes.title} variant="subtitle2">
        {t(`resource.datatype.${datatype}`)}
      </Typography>
      <div className={classes.resourceList}>
        {resourceList.map((resourceData) => (
          <ResourceItem
            key={resourceData.id}
            classes={classes}
            isSelected={
              !!resourceSelectedListIds.includes(
                resourceData.resource_identifier,
              )
            }
            onEditResourceConfiguration={(resource) =>
              onEditResourceConfiguration({ data: resource, datatype })
            }
            onSelectResource={onSelectResource}
            onUnselectResource={onUnselectResource}
            resource={resourceData}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

type Props = {
  t: TFunction,
  classes: Object,
  resourceAvailable: Array<ResourceData>,
  resourceSelectedListIds: Array<string>,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (ResourceData) => void,
};

export const ResourceSelector = (props: Props) => {
  return (
    <div className={props.classes.container}>
      {props.resourceAvailable.map(({ datatype, data }) => (
        <ResourceGroup
          key={datatype}
          classes={props.classes}
          datatype={datatype}
          onEditResourceConfiguration={props.onEditResourceConfiguration}
          onSelectResource={props.onSelectResource}
          onUnselectResource={props.onUnselectResource}
          resourceList={data}
          resourceSelectedListIds={props.resourceSelectedListIds}
          t={props.t}
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
  resourceContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: theme.spacing(2),
    alignItems: 'center',
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    marginRight: theme.spacing(1),
    padding: theme.spacing(1) / 2,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  resourceList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  resourceName: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(1) / 2,
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withHandlers({
    onUnselectResource:
      ({ setResourceFiltered, resourceSelectedListIds }) =>
      (resource_identifier) => {
        setResourceFiltered(
          resourceSelectedListIds.filter((i) => i !== resource_identifier),
        );
      },
    onSelectResource:
      ({ setResourceFiltered, resourceSelectedListIds }) =>
      (resource_identifier) => {
        setResourceFiltered([...resourceSelectedListIds, resource_identifier]);
      },
  }),
)(ResourceSelector);
