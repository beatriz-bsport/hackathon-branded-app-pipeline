// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import Checkbox from '@material-ui/core/Checkbox';
import NumericInput from '../../../../components/input/NumericInput.component';
import MetaActivitySelector from '../../../meta-activity/components/MetaActivitySelector.component';

type Props = {
  filter_data: any,
  t: TFunction,
  meta_activities: Array<any>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class MetaActivityFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({
        meta_activity: null,
        value: null,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, meta_activities } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <div className={classes.selector}>
          <MetaActivitySelector
            metaActivities={meta_activities}
            selectedMetaActivities={filter_data.meta_activity}
            selectOption={(ev) => {
              onChange({ meta_activity: ev.map((pp) => pp.value) });
            }}
          />
        </div>
        <Button
          onClick={() => {
            if (
              filter_data.meta_activity &&
              meta_activities.length === filter_data.meta_activity.length
            ) {
              onChange({ meta_activity: [] });
            } else {
              onChange({ meta_activity: meta_activities.map((pp) => pp.id) });
            }
          }}
        >
          <Checkbox
            checked={
              filter_data.meta_activity && meta_activities.length > 0
                ? meta_activities.length === filter_data.meta_activity.length
                : false
            }
            tabIndex={-1}
            disableRipple
          />
          Tous
        </Button>
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <NumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.target.value })}
          required
        />
        {t(`filters.${filter_data.filter_identifier}.third`)}
      </div>
    );
  }
}

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  selector: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 200,
    maxWidth: '500px',
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(MetaActivityFilter);
