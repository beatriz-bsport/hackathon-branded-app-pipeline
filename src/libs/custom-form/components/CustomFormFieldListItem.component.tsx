import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { makeStyles } from '@material-ui/core/styles';
import { SortableHandle } from 'react-sortable-hoc';
import withConfirm from '../../../hocs/with-confirm.hoc';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import FieldIcon from './FieldIcon.component';
import { TextField, CheckboxField } from '../../../components/forms';
import type { CustomFormField } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
} from '../utils';

const DragHandle = SortableHandle(() => <DragHandleIcon color="action" />);

type OwnProps = {
  customFormField: CustomFormField;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClick?: (cunstomFormId: number) => void;
  onClickRequired?: () => void;
  onClickRestore?: () => void;
  onClickDuplicate?: () => void;
  handleBlur: (str: string) => void;
  index: number;
  customFormFieldType: string;
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

export const CustomFormFieldListItem = (props: Props) => {
  const { t } = props;
  const classes = useStyles();
  return (
    <ListItem
      divider
      onClick={() => props.onClick && props.onClick(props.customFormField.id)}
      className={classes.listitem}
    >
      <ListItemIcon className={classes.type}>
        <DragHandle fontSize="small" />
        <div className={classes.marginLeft}>
          <FieldIcon field_id={props.customFormField.kind} fontSize="small" />
        </div>
      </ListItemIcon>

      <TextField
        name={`${props.customFormFieldType}.${props.index}.label`}
        id="label"
        variant="outlined"
        label={t('customForm.label')}
        onBlur={props.handleBlur}
        required
        className={classes.label}
      />
      <div className={classes.mandatory}>
        <CheckboxField
          name={`${props.customFormFieldType}.${props.index}.mandatory`}
          onClick={() => props.onClickRequired && props.onClickRequired()}
          disabled={
            props.customFormField.kind === CUSTOM_FORM_FIELD_TITLE_OPTION ||
            props.customFormField.kind === CUSTOM_FORM_FIELD_PARAGRAPH_OPTION
          }
        />
      </div>
      <div className={classes.actions}>
        <ListItemResponsiveAction
          actions={[
            props.onClickDuplicate && {
              icon: FileCopyIcon,
              label: t('duplicate'),
              color: 'primary',
              onClick: () => props.onClickDuplicate(),
            },
            props.onClickEdit && {
              icon: EditIcon,
              label: t('edit'),
              color: 'primary',
              onClick: props.onClickEdit,
            },
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
          ]}
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
    marginLeft: theme.spacing(6),
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
  actions: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
  },
  marginLeft: {
    marginLeft: theme.spacing(5),
  },
}));
export default compose<any, OwnProps>(withTranslation(['marketing']))(
  CustomFormFieldListItem,
);
