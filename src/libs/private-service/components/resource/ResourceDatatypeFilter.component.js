// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CategoryIcon from '@material-ui/icons/Category';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  classes: Object,
  t: TFunction,
  anchorEl: ?HTMLElement,
  setAnchorEl: (e: ?HTMLElement) => void,
  resourcesByDatatype: Array<ResourceGroupType>,
  onResourceDatatypeFilterChange: (
    resourceGroupTypeList: ?Array<ResourceGroupType>,
  ) => void,
};

export const ResourceDatatypeFilter = (props: Props) => {
  return (
    <div>
      <Button
        color="primary"
        variant="outlined"
        onClick={(ev) => props.setAnchorEl(ev.currentTarget)}
      >
        <CategoryIcon className={props.classes.leftIcon} />
        <Hidden smDown>{props.t('resource.groupBy')}</Hidden>
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
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('anchorEl', 'setAnchorEl', null),
)(ResourceDatatypeFilter);
