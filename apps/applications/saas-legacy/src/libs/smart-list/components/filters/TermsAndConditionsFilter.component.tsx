import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  filter_data: any;
  onChange: (dict: any) => void;
  isNew: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class TermsAndConditionsFilter extends Component<Props> {
  componentDidMount() {
    if (this.props.isNew) {
      this.props.onChange({
        value: true,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        <Select
          defaultValue
          className={classes.input}
           
          onChange={(ev) => onChange({ value: ev.target.value })}
          value={filter_data.value}
        >
          { }
          {/* @ts-expect-error */}
          <MenuItem key="true" value>
            {t(`filters.${filter_data.filter_identifier}.true`)}
          </MenuItem>
          {/* @ts-expect-error */}
          <MenuItem key="false" value={false}>
            {t(`filters.${filter_data.filter_identifier}.false`)}
          </MenuItem>
        </Select>
        {t(`filters.${filter_data.filter_identifier}.first`)}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    input: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(TermsAndConditionsFilter);
