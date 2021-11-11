import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import ToolTip from '@material-ui/core/Tooltip';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { makeStyles } from '@material-ui/core/styles';
import { SortableHandle } from 'react-sortable-hoc';
import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
} from '@bsport/common/lib/master-data/custom-form';
import withConfirm from '../../../hocs/with-confirm.hoc';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import FieldIcon from './FieldIcon.component';
import { CheckboxField } from '../../../components/forms';
import { TextField } from './GenericFormik.input';
import type { CustomFormField } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import {
  CUSTOM_FORM_FIELDS_OPTIONS,
  CUSTOM_FORM_IMMUTABLE_SIGNUP_FIELDS,
  ALL_CUSTOM_FORM_SIGNUP_KIND_LIST,
  get_custom_form_sign_question_label,
} from '../utils';

const DragHandle = SortableHandle(() => <DragHandleIcon color="action" />);

type OwnProps = {
  customFormField: CustomFormField;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClick?: (cunstomFormId: number) => void;
  onClickRequired?: () => void;
  onClickEditable?: () => void;
  onClickRestore?: () => void;
  onClickDuplicate?: () => void;
  index: number;
  customFormFieldType: string;
  isSignUpForm?: boolean;
  isMemberForm?: boolean;
  isLayoutActive?: boolean;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof useStyles>>;
const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton
    onClick={(ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      props.onClick();
    }}
  >
    <DeleteIcon />
  </IconButton>
);

const ButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'marketing:customForm.customFormField.modal.disable.title',
  cancel: 'marketing:customForm.customFormField.modal.disable.cancel',
  confirm: 'marketing:customForm.customFormField.modal.disable.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('marketing:customForm.customFormField.modal.disable.content')}</p>
  ),
});
const CUSTOM_FORM_SIGNUP_FIELD_DEFAULT_LABEL_DICT =
  get_custom_form_sign_question_label();
export const CustomFormFieldListItem = (props: Props) => {
  const { t } = props;
  const classes = useStyles();
  const customFormFieldLabel =
    CUSTOM_FORM_FIELDS_OPTIONS.find(
      (option: { label: string; value: number }) =>
        option.value === props.customFormField.kind,
    )?.label || '';
  const signupQuestionLabel =
    props.customFormField.label ||
    t(
      `customForm.field.${
        CUSTOM_FORM_SIGNUP_FIELD_DEFAULT_LABEL_DICT[
          props.customFormField?.signup_question_kind
        ]
      }`,
    );

  const immutableSignAndMemberField =
    (props.isSignUpForm || props.isMemberForm) &&
    props.customFormField.signup_question_kind &&
    CUSTOM_FORM_IMMUTABLE_SIGNUP_FIELDS.includes(
      props.customFormField.signup_question_kind,
    );
  const unEditable =
    (props.isSignUpForm || props.isMemberForm) &&
    props.customFormField.signup_question_kind &&
    ALL_CUSTOM_FORM_SIGNUP_KIND_LIST.includes(
      props.customFormField.signup_question_kind,
    );
  return (
    <ListItem
      divider
      onClick={() => props.onClick && props.onClick(props.customFormField.id)}
      className={classes.listitem}
    >
      <ToolTip
        title={
          signupQuestionLabel
            ? `${t(
                `customForm.field.${customFormFieldLabel}`,
              )} : ${signupQuestionLabel}`
            : ''
        }
      >
        <ListItemIcon className={classes.type}>
          {!props.isLayoutActive && <DragHandle />}
          <div className={classes.marginLeft}>
            <FieldIcon field_id={props.customFormField.kind} fontSize="small" />
          </div>
        </ListItemIcon>
      </ToolTip>
      <div className={classes.label}>
        <TextField
          name={`${props.customFormFieldType}.${props.index}.label`}
          id="label"
          variant="outlined"
          label={
            props.customFormField?.signup_question_kind
              ? t(
                  `customForm.field.${
                    CUSTOM_FORM_SIGNUP_FIELD_DEFAULT_LABEL_DICT[
                      props.customFormField?.signup_question_kind
                    ]
                  }`,
                )
              : t('customForm.label')
          }
          required={!props.customFormField.signup_question_kind}
          disabled={
            props.customFormField.signup_question_kind ===
            CUSTOM_FORM_FIELD_SIGN_UP_PHOTO
          }
          className={classes.label}
        />
      </div>

      {!props.customFormField?.disabled && !props.isMemberForm && (
        <div className={classes.mandatory}>
          <CheckboxField
            name={`${props.customFormFieldType}.${props.index}.mandatory`}
            onClick={() => props.onClickRequired && props.onClickRequired()}
            disabled={
              props.customFormField.kind === CUSTOM_FORM_FIELD_TITLE_OPTION ||
              props.customFormField.kind ===
                CUSTOM_FORM_FIELD_PARAGRAPH_OPTION ||
              props.customFormField.signup_question_kind ===
                CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS ||
              props.customFormField.signup_question_kind ===
                CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL ||
              props.customFormField.signup_question_kind ===
                CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS ||
              immutableSignAndMemberField
            }
          />
        </div>
      )}
      {props.isMemberForm && !props.customFormField.disabled && (
        <div className={classes.editable}>
          <ToolTip
            title={
              props.customFormField.mandatory
                ? t('customForm.field.isMandatoryOnSignUp')
                : ''
            }
          >
            <div>
              <CheckboxField
                name={`${props.customFormFieldType}.${props.index}.editable`}
                onClick={() => props.onClickEditable && props.onClickEditable()}
                disabled={
                  props.customFormField.kind ===
                    CUSTOM_FORM_FIELD_TITLE_OPTION ||
                  props.customFormField.kind ===
                    CUSTOM_FORM_FIELD_PARAGRAPH_OPTION ||
                  immutableSignAndMemberField ||
                  props.customFormField.mandatory
                }
              />
            </div>
          </ToolTip>
        </div>
      )}
      <div className={classes.actions}>
        <ListItemResponsiveAction
          actions={
            immutableSignAndMemberField
              ? []
              : [
                  props.onClickDuplicate && {
                    icon: FileCopyIcon,
                    label: t('duplicate'),
                    color: 'primary',
                    onClick: () => props.onClickDuplicate(),
                  },
                  !unEditable &&
                    props.onClickEdit && {
                      icon: EditIcon,
                      label: t('edit'),
                      color: 'primary',
                      onClick: props.onClickEdit,
                    },
                  ((props.isMemberForm && !props.customFormField.mandatory) ||
                    !props.isMemberForm) &&
                    props.onClickDelete && {
                      iconButtonComponent: ButtonWithConfirm,
                      onClick: () => props.onClickDelete(),
                      color: 'secondary',
                      fontSize: 'small',
                    },
                  props.onClickRestore && {
                    icon: RestoreFromTrashIcon,
                    label: t('restore'),
                    color: 'primary',
                    onClick: () => props.onClickRestore(),
                  },
                ]
          }
        />
      </div>
    </ListItem>
  );
};
const useStyles = makeStyles((theme) => ({
  listitem: {
    display: 'flex',
    flexDirection: 'row',
  },
  type: {
    marginRight: theme.spacing(4),
  },
  label: {
    width: '60%',
  },
  mandatory: {
    width: '10%',
    paddingLeft: theme.spacing(6),
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
  editable: {
    width: '10%',
    paddingLeft: theme.spacing(6),
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
  actions: {
    width: '20%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(1),
  },
  marginLeft: {
    marginLeft: theme.spacing(5),
  },
}));
export default compose<any, OwnProps>(withTranslation(['marketing']))(
  CustomFormFieldListItem,
);
