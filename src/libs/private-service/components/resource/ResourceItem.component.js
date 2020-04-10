// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import VisibilityOnIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ButtonBase from '@material-ui/core/ButtonBase';

import Typography from '@material-ui/core/Typography';

type Props = {
  resource: Resource,
  isSelected: boolean,
  onSelectResource: (resourceIdentifier: string) => void,
  onUnselectResource: (resourceIdentifier: string) => void,
  onEditResourceConfiguration: (Resource) => void,
  classes: Object,
};
export const ResourceItem = (props: Props) => {
  const {
    resource,
    isSelected,
    onSelectResource,
    onUnselectResource,
    onEditResourceConfiguration,
    classes,
  } = props;
  const { name, color, resource_identifier } = resource;
  return (
    <ButtonBase
      onClick={() => onEditResourceConfiguration(resource)}
      className={classes.resourceContainer}
    >
      <div
        style={{
          width: 16,
          height: 16,
          backgroundColor: color || '#DCF3D8',
        }}
      />
      <Typography className={classes.resourceName}>{name}</Typography>
      {!!onSelectResource && !!onUnselectResource ? (
        isSelected ? (
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
        )
      ) : null}
    </ButtonBase>
  );
};

const styles = (theme) => ({
  resourceContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: theme.spacing.unit * 2,
    alignItems: 'center',
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    marginRight: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  resourceName: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
});

export default compose(withStyles(styles))(ResourceItem);
