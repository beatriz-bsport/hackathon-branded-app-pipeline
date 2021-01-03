// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ListItemIcon from '@material-ui/core/ListItemIcon';

type Props = {
  t: TFunction,
  classes: Object,
  menuAnchor: ?HTMLElement,
  setMenuAnchor: (?HTMLElement) => void,

  itemList: ?Array<any>,
  itemSelected: ?any,
  setItemSelected: (?string) => void,
  iconList: ?any,
};

export class CustomChartSelector extends React.Component<Props> {
  renderItemList = (item: string) => {
    const Icon = this.props.iconList[item];
    return (
      <List
        disablePadding
        key={item}
        subheader={
          <ListItem
            disableGutters
            button
            dense
            className={this.props.classes.listItem}
            onClick={() => {
              this.props.setItemSelected(item);
              this.props.setMenuAnchor(null);
            }}
          >
            {Icon ? (
              <ListItemIcon>
                <Icon color="primary" />
              </ListItemIcon>
            ) : null}
            <Typography variant="inherit">
              {this.props.t(`customChart.form.selector.${item}`)}
            </Typography>
          </ListItem>
        }
      />
    );
  };

  render() {
    const { t, classes, itemList, itemSelected } = this.props;
    return (
      <div className={classes.container}>
        <ButtonBase
          onClick={(ev) => this.props.setMenuAnchor(ev.currentTarget)}
          className={classes.button}
        >
          <SearchIcon className={classes.leftIcon} />
          {!itemList ? (
            <CircularProgress />
          ) : (
            <>
              {itemSelected ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="body" color="textSecondary" align="left">
                    {t(`customChart.form.selector.${itemSelected}`)}
                  </Typography>
                </div>
              ) : (
                <Typography color="textSecondary">
                  {t('customChart.form.selector.object.placeholder')}
                </Typography>
              )}
            </>
          )}
        </ButtonBase>
        <Typography color="textSecondary" variant="caption">
          {t('customChart.form.selector.object.helperText')}
        </Typography>
        <Menu
          open={!!this.props.menuAnchor}
          anchorEl={this.props.menuAnchor}
          onClose={() => this.props.setMenuAnchor(null)}
        >
          {itemList && itemList.length ? (
            itemList.map((item) => this.renderItemList(item))
          ) : (
            <ListItem dense>
              {this.props.t('customChart.form.selector.object.isEmpty')}
            </ListItem>
          )}
        </Menu>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  button: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(1),
    minWidth: 300,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: '#E8E8E8',
    },
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
  withState('menuAnchor', 'setMenuAnchor', null),
)(CustomChartSelector);
