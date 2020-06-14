// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class UserHasPasswordFilter extends Component<Props> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({ value: true });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <Switch
            className={classes.input}
            value={filter_data.value}
            onChange={(ev) => onChange({ value: ev.target.checked })}
          />
          <Typography>
            {t(`filters.${filter_data.filter_identifier}.explain`)}
          </Typography>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      maringRight: theme.spacing(1),
    },
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(UserHasPasswordFilter);
