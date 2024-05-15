import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  createStyles,
  IconButton,
  Switch,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DateTime } from 'luxon';
import { MaterialStyleType } from '../../../../utils/types';
import CalendarPicker from '../CalendarPicker.component';
import { DATE_EXACT } from '../constants';
import ToolTip from '#components/Tooltip.component';

type OwnProps = {
  filter_data: any;
  onChange: (dict: any) => void;
  isNew: boolean;
  setNotNullableData: (data: Array<string>) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const ANY_NOTE = 0;
const MEDICAL_NOTE = 1;
const NON_MEDICAL_NOTE = 2;

export class NotesFilter extends Component<Props> {
  componentDidMount() {
    this.props.setNotNullableData(['note_condition']);
    if (this.props.isNew) {
      this.props.onChange({
        note_condition: ANY_NOTE,
        date_filter_active: false,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        duration: -5,
        duration_second: -10,
        date_filter_type: DATE_EXACT,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          required
          className={classes.input}
          defaultValue={ANY_NOTE}
          onChange={(ev) => onChange({ note_condition: ev.target.value })}
          value={filter_data.note_condition}
        >
          <MenuItem key="any" value={ANY_NOTE}>
            {t(`filters.${filter_data.filter_identifier}.medicalOrNot`)}
          </MenuItem>
          <MenuItem key="medical" value={MEDICAL_NOTE}>
            {t(`filters.${filter_data.filter_identifier}.medical`)}
          </MenuItem>
          <MenuItem key="nonMedical" value={NON_MEDICAL_NOTE}>
            {t(`filters.${filter_data.filter_identifier}.nonMedical`)}
          </MenuItem>
        </Select>
        <ToolTip
          aria-label="info"
          title={
            <Typography variant="subtitle2">
              {t(`filters.${filter_data?.filter_identifier}.info`)}
            </Typography>
          }
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </ToolTip>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.date_filter_active}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.date_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.date.first`,
            )}
            <CalendarPicker
              // @ts-expect-error
              blockValidateOnClickAway
              filter_data={filter_data}
              onChange={onChange}
            />
          </div>
        </div>
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
    inlineContainer: { display: 'flex', alignItems: 'center' },
    disabled: {
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
      background: '#f1f1f1',
      borderRadius: '7px',
      paddingLeft: theme.spacing(1),
    },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(NotesFilter);
