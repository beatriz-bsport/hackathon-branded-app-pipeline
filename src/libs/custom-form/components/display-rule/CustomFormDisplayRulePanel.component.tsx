import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import InfoIcon from '@material-ui/icons/Info';
import orange from '@material-ui/core/colors/orange';
import { MaterialStyleType } from '../../../../utils/types';
import type { CustomForm, CustomFormDisplayRule } from '../../types';
import CustomFormDisplayRuleListItem from './CustomFormDisplayRuleListItem.components';

type OwnProps = {
  customForm: CustomForm;
  onDeleteDisplayRule?: (display_rule_id: number) => void;
  onEditDisplayRule?: (display_rule: CustomFormDisplayRule) => void;
  onAddRule?: () => void;
  withItemDivider?: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const CustomFormDisplayRulePanel = (props: Props) => {
  const { t, classes, customForm, withItemDivider } = props;
  if (!customForm) {
    return null;
  }
  return (
    <>
      <div className={classes.header}>
        <Typography variant="h6">
          {t('customForm.displayRule.header')}
        </Typography>
      </div>
      <Paper>
        {customForm &&
        customForm.display_rules &&
        customForm.display_rules.length === 0 ? (
          <div className={classes.textAndIconOutter}>
            <div className={classes.textAndIconInner}>
              <InfoIcon className={classes.leftIcon} fontSize="small" />
              <Typography variant="caption">
                {props.customForm?.is_member_form || props.customForm?.is_signup
                  ? t('customForm.displayRule.forbiddenForSignup')
                  : t('customForm.displayRule.empty')}
              </Typography>
            </div>
          </div>
        ) : (
          <List dense disablePadding>
            <div>
              {customForm.display_rules?.map(
                (displayRule: CustomFormDisplayRule) => (
                  <CustomFormDisplayRuleListItem
                    key={displayRule?.id}
                    customFormDisplayRule={displayRule}
                    onDelete={props.onDeleteDisplayRule}
                    onEdit={props.onEditDisplayRule}
                    withItemDivider={withItemDivider}
                  />
                ),
              )}
            </div>
          </List>
        )}
        {props.onAddRule ? (
          <div className={classes.addButton}>
            <Button
              onClick={props.onAddRule}
              variant="text"
              color="primary"
              disabled={
                props.customForm?.custom_form_field?.length === 0 ||
                props.customForm?.disabled ||
                props.customForm?.is_member_form ||
                props.customForm?.is_signup
              }
            >
              <AddIcon color="inherit" className={classes.addIcon} />
              {t('customForm.displayRule.addNewDisplayRule')}
            </Button>
          </div>
        ) : null}
      </Paper>
    </>
  );
};
const styles = (theme: Theme) => ({
  textAndIconOutter: {
    padding: theme.spacing(2),
  },
  textAndIconInner: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: orange[50],
    borderRadius: theme.spacing(0.5),
    border: `2px solid ${orange[500]}`,
    padding: theme.spacing(0.5),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
    color: orange[500],
  },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    padding: theme.spacing(1),
  },
  header: {
    paddingBottom: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormDisplayRulePanel);
