// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';

import { ButtonBase, Collapse } from '@material-ui/core';

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
  const [expanded, setExpanded] = React.useState(false);
  const resourceListAllwaysDisplayed = resourceList.slice(0, 7);
  const resourceListToExpand = resourceList.slice(7);
  const showExpandIcon = resourceListToExpand.length > 0;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          checked={allAreSelected}
          indeterminate={allAreSelected === null}
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
        <Typography className={classes.title} variant="subtitle2">
          {t(`privateService:resource.datatype.${datatype}`)}
        </Typography>
      </div>
      <div className={classes.resourceListWrapper}>
        <div className={classes.resourceList}>
          {resourceListAllwaysDisplayed.map((resourceData) => {
            const isSelected = !!resourceSelectedListIds.includes(
              resourceData.resource_identifier,
            );
            return (
              <ResourceItem
                key={resourceData.resource_id}
                isSelected={isSelected}
                onEditResourceConfiguration={(resource) => {
                  if (
                    !onEditResourceConfiguration &&
                    !!onSelectResource &&
                    !!onUnselectResource
                  ) {
                    if (!isSelected)
                      onSelectResource(resourceData.resource_identifier);
                    if (isSelected)
                      onUnselectResource(resourceData.resource_identifier);
                  } else {
                    onEditResourceConfiguration({ data: resource, datatype });
                  }
                  /* eslint-enable */
                }}
                onSelectResource={onSelectResource}
                onUnselectResource={onUnselectResource}
                resource={resourceData}
              />
            );
          })}
        </div>
        <Collapse className={classes.resourceList} in={expanded}>
          <div className={classes.resourceList}>
            {resourceListToExpand.map((resourceData) => {
              const isSelected = !!resourceSelectedListIds.includes(
                resourceData.resource_identifier,
              );
              return (
                <ResourceItem
                  key={resourceData.resource_id}
                  isSelected={isSelected}
                  onEditResourceConfiguration={(resource) => {
                    if (
                      !onEditResourceConfiguration &&
                      !!onSelectResource &&
                      !!onUnselectResource
                    ) {
                      if (!isSelected)
                        onSelectResource(resourceData.resource_identifier);
                      if (isSelected)
                        onUnselectResource(resourceData.resource_identifier);
                    } else {
                      onEditResourceConfiguration({ data: resource, datatype });
                    }
                    /* eslint-enable */
                  }}
                  onSelectResource={onSelectResource}
                  onUnselectResource={onUnselectResource}
                  resource={resourceData}
                />
              );
            })}
          </div>
        </Collapse>
      </div>
      {showExpandIcon && (
        <ButtonBase className={classes.expand} onClick={handleExpandClick}>
          <Typography variant="subtitle2">
            {expanded ? t('common:seeLess') : t('common:seeMore')}
          </Typography>
        </ButtonBase>
      )}
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'auto',
    flexWrap: 'wrap',
    rowGap: theme.spacing(1) / 2,
  },
  resourceListWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1) / 2,
  },
  title: {
    marginBottom: theme.spacing(1) / 2,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  expand: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService', 'common']),
  withStyles(styles),
)(ResourceGroup);
