import React from 'react';
import Select from '@material-ui/core/Select';

import MenuItem from '@material-ui/core/MenuItem';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { MaterialStyleType } from '../../../utils/types';
import { AutoTagRule } from '../types';

const TAG_ON_JOIN_AND_UNTAG_ON_LEFT = 1;
const TAG_ON_JOIN_AND_KEEP_TAG = 2;
const TAG_ON_LEFT = 3;

type OwnProps = {
  disabled?: boolean;
  selected: AutoTagRule;
  onChange: (autotagRule: AutoTagRule) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class TagRuleSelector extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    const TAG_RULE_CHOICES = [
      {
        value: TAG_ON_JOIN_AND_UNTAG_ON_LEFT,
        label: (
          <div className={classes.flexLabelSelector}>
            <GroupIcon className={classes.insideIcon} />
            <Typography>
              {`${t('tag_rules.tag_on_join_and_untag_on_left')}`}
            </Typography>
          </div>
        ),
      },
      {
        value: TAG_ON_JOIN_AND_KEEP_TAG,
        label: (
          <div className={classes.flexLabelSelector}>
            <DoubleArrowIcon className={classes.joinIcon} />
            <Typography>{`${t('tag_rules.tag_on_join')}`}</Typography>
          </div>
        ),
      },
      {
        value: TAG_ON_LEFT,
        label: (
          <div className={classes.flexLabelSelector}>
            <DoubleArrowIcon className={classes.leavingIcon} />
            <Typography>{`${t('tag_rules.tag_on_left')}`}</Typography>
          </div>
        ),
      },
    ];

    return (
      <Select
        id="standard-select-currency"
        disabled={this.props.disabled}
        value={this.props.selected.kind}
        variant="outlined"
        label="Select"
        dense
        onChange={(event) =>
          this.props.onChange({
            ...this.props.selected,
            kind: event.target.value,
          })
        }
      >
        {TAG_RULE_CHOICES.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

const styles = (theme: Theme) => ({
  flexLabelSelector: {
    display: 'flex',
    flexDirectio: 'row',
    alignItems: 'center',
  },

  insideIcon: {
    color: '#3f51b5',
    marginRight: theme.spacing(1),
  },
  joinIcon: {
    color: '#00c853',
    marginRight: theme.spacing(1),
  },
  leavingIcon: {
    color: '#ff3d00',
    transform: 'rotate(180deg)',
    marginRight: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['smartList']),
)(TagRuleSelector);
