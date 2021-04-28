// @flow
import React from 'react';
import uniq from 'lodash/uniq';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import { compose, withStateHandlers, withHandlers } from 'recompose';

import ResourceGroup from './ResourceGroup.component';

type Props = {
  classes: Object,
  resourceSelectedListIds: Array<string>,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (Resource) => void,
  resourceAvailable: Array<ResourceGroupType>,
};

type PropsSelector = {
  classes: Object,
  resourceSelectedListIds: Array<string>,
  onSelectResource: (string) => void,
  onUnselectResource: (string) => void,
  onEditResourceConfiguration: (Resource) => void,
  resourceAvailable: Array<ResourceGroupType>,
  collapse: boolean,
  toogleExand: () => void,
  expanded: boolean,
  loading: boolean,
};

const ResourceSelectorInner = (props: Props) => (
  <div className={props.classes.container}>
    {props.resourceAvailable.map(({ datatype, data }) => (
      <div className={props.classes.row}>
        <ResourceGroup
          datatype={datatype}
          resourceList={data}
          resourceSelectedListIds={props.resourceSelectedListIds}
          key={datatype}
          onSelectResource={props.onSelectResource}
          onUnselectResource={props.onUnselectResource}
          onEditResourceConfiguration={props.onEditResourceConfiguration}
        />
      </div>
    ))}
  </div>
);

export const ResourceSelector = (props: PropsSelector) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  if (props.collapse) {
    return (
      <div className={classes.ressourceSelector}>
        <div className={classes.collapseHeader}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              props.toogleExand();
            }}
          >
            {props.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <ButtonBase onClick={props.toogleExand} disabledRipple>
            <Typography>{t('resource.selector.title')}</Typography>
          </ButtonBase>
        </div>
        <Collapse in={props.expanded}>
          {props.loading ? (
            <CircularProgress />
          ) : (
            <div className={classes.expandedInnerContainer}>
              <ResourceSelectorInner classes={classes} {...props} />
            </div>
          )}
        </Collapse>
      </div>
    );
  }
  return <ResourceSelectorInner classes={classes} {...props} />;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    width: '100%',
  },
  ressourceSelector: {
    overflowX: 'auto',
  },
  row: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  collapseHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
  expandedInnerContainer: {
    borderLeft: '3px solid black',
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(2),
    width: '100%',
  },
}));

export default compose(
  withStateHandlers(
    { expanded: false },
    {
      toogleExand: ({ expanded }) => () => ({ expanded: !expanded }),
    },
  ),
  withHandlers({
    onUnselectResource: ({ setResourceFiltered, resourceSelectedListIds }) => (
      resource_identifier,
    ) => {
      if (Array.isArray(resource_identifier)) {
        setResourceFiltered(
          resourceSelectedListIds.filter(
            (i) => !resource_identifier.includes(i),
          ),
        );
      } else {
        setResourceFiltered(
          resourceSelectedListIds.filter((i) => i !== resource_identifier),
        );
      }
    },
    onSelectResource: ({ setResourceFiltered, resourceSelectedListIds }) => (
      resource_identifier,
    ) => {
      if (Array.isArray(resource_identifier)) {
        setResourceFiltered(
          uniq([...resourceSelectedListIds, ...resource_identifier]),
        );
      } else {
        setResourceFiltered([...resourceSelectedListIds, resource_identifier]);
      }
    },
  }),
)(ResourceSelector);
