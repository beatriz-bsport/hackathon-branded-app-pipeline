// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import Selector from '../MultiSelector.component';

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
        <Selector
          helperText={t('multiSelector.metaActivities.helperText')}
          helperSelectedText={t(
            'multiSelector.metaActivities.helperSelectedText',
          )}
          primaryTextIdentifier="name"
          textFieldPlaceholder={t(
            'multiSelector.metaActivities.textFieldPlaceholder',
          )}
          items={meta_activities}
          selectedItems={filter_data.meta_activity}
          onChange={(items) => {
            if (
              filter_data.meta_activity &&
              !(
                items.length === filter_data.meta_activity.length &&
                [...items].sort().every((value, index) => {
                  return value === [...filter_data.meta_activity].sort()[index];
                })
              )
            ) {
              onChange({ meta_activity: items });
            }
            if (!filter_data.meta_activity && items.length > 0) {
              onChange({ meta_activity: items });
            }
          }}
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <DelayedNumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.target.value })}
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
