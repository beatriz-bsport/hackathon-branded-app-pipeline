// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CategoryIcon from '@material-ui/icons/Category';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  classes: Object,
  t: TFunction,
  anchorEl: ?HTMLElement,
  setAnchorEl: (?HTMLElement) => void,
  resourcesByDatatype: Array<ResourceGroupType>,
  onResourceDatatypeFilterChange: (?Array<ResourceGroupType>) => void,
};

export const ResourceDatatypeFilter = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <Button
        variant="contained"
        color="primary"
        onClick={(ev) => props.setAnchorEl(ev.currentTarget)}
      >
        <CategoryIcon className={props.classes.leftIcon} />
        {props.t('resource.groupBy')}
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={props.anchorEl}
        open={!!props.anchorEl}
        onClose={() => props.setAnchorEl(null)}
        TransitionComponent={Fade}
      >
        {props.resourcesByDatatype.map(({ datatype, items }) => (
          <MenuItem
            key={datatype}
            onClick={() => {
              props.onResourceDatatypeFilterChange(datatype, items);
              props.setAnchorEl(null);
            }}
          >
            {props.t(`resource.datatype.${datatype}`)}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            props.onResourceDatatypeFilterChange(null, []);
            props.setAnchorEl(null);
          }}
        >
          {props.t('resource.unGroup')}
        </MenuItem>
      </Menu>
    </div>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  container: {
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState('anchorEl', 'setAnchorEl', null),
)(ResourceDatatypeFilter);
