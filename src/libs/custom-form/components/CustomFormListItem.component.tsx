import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import type { CustomForm } from '../types';
import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
} from '../utils';

type Props = {
  customform: CustomForm;
  onClick?: (item: any) => void;
  onClickEdit?: (id: number) => void;
  onClickDelete?: (id: number) => void;
  selected: boolean;
  onClickDuplicate?: (id: number) => void;
  onRestore?: (id: number) => void;
};

type DialogProps = {
  open: boolean;
  onClickDelete: () => void;
  onClickCancel: () => void;
};
const dialogUseStyles = makeStyles((theme) => ({
  deleteDialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
}));
const DeleteDialog = (props: DialogProps) => {
  const classes = dialogUseStyles();
  const { t } = useTranslation(['marketing']);
  const { open, onClickDelete, onClickCancel } = props;
  return (
    <Dialog open={open} disableBackdropClick>
      <DialogTitle>
        <div className={classes.title}>
          <Typography>{t('customForm.modal.delete.title')}</Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('marketing:customForm.modal.delete.content')}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.deleteDialogActions}>
        <Button color="secondary" onClick={onClickCancel}>
          {t('customForm.modal.delete.cancel')}
        </Button>
        <Button color="primary" onClick={onClickDelete}>
          {t('customForm.modal.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CustomFormListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['marketing']);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  return (
    <>
      <ListItem
        divider
        button
        selected={props.selected}
        onClick={(e) => {
          e.stopPropagation();
          props.onClick(props.customform.id);
        }}
        className={classes.listitem}
      >
        <Grid container>
          <Grid item xs={3} className={classes.nameItem}>
            <div>
              <Typography component="span">{props.customform.name}</Typography>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.questionItem}>
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
          <Grid item xs={3} className={classes.actionItem}>
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
                  onClick: () => setDeleteDialogOpen(true),
                  color: 'secondary',
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
      <DeleteDialog
        open={deleteDialogOpen}
        onClickDelete={() => props.onClickDelete(props.customform.id)}
        onClickCancel={() => setDeleteDialogOpen(false)}
      />
    </>
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
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

export default CustomFormListItem;
