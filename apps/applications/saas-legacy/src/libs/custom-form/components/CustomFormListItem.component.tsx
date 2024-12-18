import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid, { GridSize } from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Chip from '@material-ui/core/Chip';
import {
  CUSTOM_FORM_DISPLAY_ON_CONNECTION,
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
} from '@bsport/common/lib/master-data/custom-form.js';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import type { CustomForm } from '../types';

type Props = {
  customform: CustomForm;
  onClick?: (item: any) => void;
  onClickEdit?: (id: number) => void;
  onClickDelete?: (id: number) => void;
  selected?: boolean;
  onClickDuplicate?: (id: number) => void;
  onRestore?: (id: number) => void;
  withDisplayRule?: boolean;
  divider?: boolean;
  stopPropagation?: boolean;
  gridItemXs?: GridSize;
  showQuestionCount?: boolean;
};

export const CustomFormListItem = (props: Props) => {
  const {
    withDisplayRule,
    divider,
    stopPropagation,
    gridItemXs,
    showQuestionCount,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation(['marketing']);
  const customFormName = () => {
    if (props.customform.is_signup) {
      return t('customForm.signupFormTitle');
    }
    if (props.customform.is_member_form) {
      return t('customForm.memberFormTitle');
    }
    return props.customform.name;
  };
  return (
    <ListItem
      // @ts-expect-error
      button={!!props.onClick}
      className={classes.listitem}
      divider={divider}
      onClick={(e) => {
        stopPropagation && e.stopPropagation();
        props.onClick && props.onClick(props.customform.id);
      }}
      selected={props.selected}
    >
      <Grid container>
        <Grid item className={classes.nameItem} xs={gridItemXs ?? 3}>
          <div>
            <Typography component="span">{customFormName()}</Typography>
          </div>
        </Grid>
        {showQuestionCount && (
          <Grid
            item
            className={classes.questionItem}
            xs={withDisplayRule ? 3 : 6}
          >
            <Typography component="span">
              {
                props.customform?.custom_form_field.filter(
                  (field) =>
                    !field.disabled &&
                    ![
                      CUSTOM_FORM_FIELD_TITLE_OPTION,
                      CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
                    ].includes(field.kind),
                ).length
              }
            </Typography>
          </Grid>
        )}

        {props.withDisplayRule && (
          <Grid item className={classes.displayRuleItem} xs={3}>
            {props.customform.display_rules.map((rule) => (
              <Chip
                key={rule?.id}
                className={classes.chip}
                color="primary"
                label={
                  rule.kind === CUSTOM_FORM_DISPLAY_ON_CONNECTION
                    ? t('customForm.displayRule.forRegisteredMember', {
                        count: rule.timedelta_day_before_display,
                      })
                    : t('customForm.displayRule.forNewMember')
                }
              />
            ))}
          </Grid>
        )}
        <Grid
          item
          className={
            props.withDisplayRule
              ? classes.actionItemMarginRight
              : classes.actionItem
          }
          xs={3}
        >
          <ListItemResponsiveAction
            actions={[
              props.onClickEdit && {
                icon: ArrowForwardIcon,
                label: t('edit'),
                color: 'primary',
                onClick: () => props.onClickEdit(props.customform.id),
              },
              props.onClickDuplicate && {
                icon: FileCopyIcon,
                label: t('duplicate'),
                color: 'primary',
                onClick: () => props.onClickDuplicate(props.customform.id),
              },
              props.onClickDelete && {
                icon: DeleteIcon,
                onClick: () => props.onClickDelete(props.customform.id),
                color: 'secondary',
                label: t('delete'),
              },
              props.onRestore && {
                icon: RestoreFromTrashIcon,
                label: t('restore'),
                color: 'primary',
                onClick: () => props.onRestore(props.customform.id),
              },
            ]}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    fontSize: 11,
  },
  listitem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: { display: 'flex' },
  nameItem: {
    display: 'flex',
    alignItems: 'center',
  },
  questionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayRuleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionItemMarginRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(5),
  },
  chip: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

export default React.memo(CustomFormListItem);
