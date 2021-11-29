// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';

import { ButtonBase, Typography } from '@material-ui/core';
import classNames from 'classnames';

type Props = {
  t: TFunction,
  classes: Object,

  itemList: ?Array<any>,
  itemSelected: ?any,
  setItemSelected: (item: ?any) => void,
  iconList: ?{ [string]: any },
};

export class CustomChartRadio extends React.Component<Props> {
  renderItem = (item: any) => {
    const { t, classes, iconList, itemSelected } = this.props;
    const Icon = iconList[item];
    const containerClass = classNames({
      [classes.item]: true,
      [classes.selected]: itemSelected === item,
    });

    return (
      <ButtonBase
        key={item}
        className={containerClass}
        onClick={() => this.props.setItemSelected(item)}
      >
        <Icon color="inherit" />
        <Typography>{t(`customChart.form.radio.${item}`)}</Typography>
      </ButtonBase>
    );
  };

  render() {
    const { itemList, classes } = this.props;

    return (
      <div className={classes.container}>
        {itemList.map((item) => this.renderItem(item))}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: theme.spacing(-1),
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    width: 150,
    height: 100,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
)(CustomChartRadio);
