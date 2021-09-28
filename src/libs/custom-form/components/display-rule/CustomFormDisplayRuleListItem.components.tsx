import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SnoozeIcon from '@material-ui/icons/Snooze';
import Grid from '@material-ui/core/Grid';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import ToolTip from '@material-ui/core/Tooltip';
import { CUSTOM_FORM_DISPLAY_ON_SIGN_UP } from '@bsport/common/lib/master-data/custom-form';
import { MaterialStyleType } from '../../../../utils/types';
import type { CustomFormDisplayRule } from '../../types';

type OwnProps = {
  customFormDisplayRule: CustomFormDisplayRule;
  onDelete: (diplay_rule_id: number) => void;
  onEdit: (diplay_rule: CustomFormDisplayRule) => void;
  withItemDivider?: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const CustomFormDisplayRuleListItem = (props: Props) => {
  const { t, classes, customFormDisplayRule, withItemDivider } = props;
  return (
    <ListItem key={customFormDisplayRule.id} divider={withItemDivider}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          {customFormDisplayRule.kind === CUSTOM_FORM_DISPLAY_ON_SIGN_UP ? (
            <div className={classes.kind}>
              <PersonAddIcon
                fontSize="small"
                color="secondary"
                className={classes.kindIcon}
              />
              <ListItemText
                primary={t('customForm.displayRule.forNewMember')}
              />
            </div>
          ) : (
            <div className={classes.kind}>
              <GroupIcon
                fontSize="small"
                color="secondary"
                className={classes.kindIcon}
              />
              <ListItemText
                primary={t('customForm.displayRule.forRegisteredMember', {
                  count: customFormDisplayRule.timedelta_day_before_display,
                })}
                secondaryTypographyProps={{ variant: 'caption' }}
                secondary={
                  customFormDisplayRule.force_display &&
                  t('customForm.displayRule.forcedDisplayMinimal')
                }
              />
            </div>
          )}
        </Grid>
      </Grid>
      {customFormDisplayRule.snoozable && (
        <ToolTip title={t('customForm.displayRule.snoozableMinimal')}>
          <IconButton disableFocusRipple disableRipple>
            <SnoozeIcon />
          </IconButton>
        </ToolTip>
      )}
      {props.onEdit && (
        <IconButton onClick={() => props.onEdit(customFormDisplayRule)}>
          <EditIcon color="primary" />
        </IconButton>
      )}

      {props.onDelete && (
        <IconButton onClick={() => props.onDelete(customFormDisplayRule.id)}>
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );
};
const styles = (theme: Theme) => ({
  kind: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  kindIcon: {
    marginRight: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormDisplayRuleListItem);
