// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';

type Props = {
  t: TFunction,
  classes: Object,

  itemList: ?Array<any>,
  itemSelected: ?any,
  setItemSelected: (?any) => void,
  iconList: ?{[string]: any},
};

export class CustomChartRadio extends React.Component<Props> {
  renderItem = (item: any) => {
    const { t, classes, iconList, itemSelected } = this.props;
    const Icon = iconList[item];
    return (
      <Grid className={classes.fieldContainer}>
        <FormControlLabel
          value={item}
          control={
        <Radio
          checked={item === itemSelected}
        />
        }
          label={<Icon color="primary" className={classes.largeIcon} />}
          labelPlacement="top"
        />
        <FormHelperText>{t(`customChart.form.radio.${item}`)}</FormHelperText>
      </Grid>);
  };

  render() {
    const { itemList, itemSelected } = this.props;
    return (
      <div>
        <FormControl component="fieldset">
          <RadioGroup
            row
            name={itemSelected}
            value={itemSelected}
            onChange={(ev) =>
                this.props.setItemSelected(ev.target.value)
            }
          >
            {itemList.map((item) => this.renderItem(item))}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

const styles = (theme) => ({
  largeIcon: {
    fontSize: '3em',
  },
  fieldContainer: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
)(CustomChartRadio);
