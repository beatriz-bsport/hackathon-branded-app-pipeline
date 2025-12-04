import React, { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

import {
  Button,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

// @ts-expect-error
import withConfirm from '#src/hocs/with-confirm.hoc';
import {
  CustomMobilePopup,
  CustomMobilePopupCreateOrEditData,
  MobilePopup,
} from '#src/libs/settings/types';
import CustomMobilePopupDialog from './CustomMobilePopupDialog.dialog';
import { OptionCallback } from '../../../state/types';

type Props = {
  loading: boolean;
  popups: MobilePopup[];
  createCustomMobilePopup: (
    data: CustomMobilePopupCreateOrEditData,
    options?: OptionCallback<void>,
  ) => void;
  updateCustomMobilePopup: (
    args_0: {
      id: string;
      data: CustomMobilePopup;
    },
    args_1?: OptionCallback<void>,
  ) => void;
  deleteCustomMobilePopup: (id: number, options?: OptionCallback<void>) => void;
};
const CustomMobilePopupSettings: React.FC<Props> = ({
  loading,
  popups,
  createCustomMobilePopup,
  updateCustomMobilePopup,
  deleteCustomMobilePopup,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['settings']);

  const [openPopupDialog, setOpenPopupDialog] = useState(false);
  const [editingPopup, setEditingPopup] = useState<CustomMobilePopup | null>(
    null,
  );

  const handleOpenPopupDialog = () => {
    setOpenPopupDialog(true);
  };

  const handleClosePopupDialog = () => {
    setOpenPopupDialog(false);
    setEditingPopup(null);
  };

  const onClickEditLink = (popup: CustomMobilePopup) => () => {
    setEditingPopup(popup);
    setOpenPopupDialog(true);
  };

  const handleSubmitLink = (param: {
    id: string;
    values: FormData;
    options: OptionCallback<void>;
  }) => {
    if (param.id) {
      updateCustomMobilePopup(
        // @ts-expect-error
        { id: param.id, data: param.values },
        {
          onSuccess: () => {
            param.options.onSuccess();
            setOpenPopupDialog(false);
            setEditingPopup(null);
          },
          onError: () => {
            param.options.onError();
            setOpenPopupDialog(false);
            setEditingPopup(null);
          },
        },
      );
      return;
    }
    // @ts-expect-error
    createCustomMobilePopup(param.values, {
      onSuccess: () => {
        param.options.onSuccess();
        setOpenPopupDialog(false);
        setEditingPopup(null);
      },
      onError: () => {
        param.options.onError();
        setOpenPopupDialog(false);
        setEditingPopup(null);
      },
    });
  };

  const handleDelete = (id: number) => () => {
    deleteCustomMobilePopup(id);
  };

  return (
    <div>
      <Typography className={classes.title}>
        {t('mobilePersonalization.popup.subtitle')}
      </Typography>
      <div className={classes.row}>
        <InfoIcon className={classes.info} />
        <div className={classes.helperText}>
          {t('mobilePersonalization.popup.helperText')}
        </div>
      </div>

      <Paper>
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell colSpan={10}>
                {t('mobilePersonalization.popup.name')}
              </TableCell>
              <TableCell colSpan={10}>
                {t('mobilePersonalization.popup.link')}
              </TableCell>
              <TableCell colSpan={10}>
                {t('mobilePersonalization.popup.image')}
              </TableCell>
              <TableCell colSpan={10}>
                {t('mobilePersonalization.popup.creationDate')}
              </TableCell>
              <TableCell colSpan={10}>
                {t('mobilePersonalization.popup.smartlist')}
              </TableCell>
              <TableCell className={classes.action}>
                {t('mobilePersonalization.popup.action')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              popups.map((popup: MobilePopup) => (
                <TableRow key={popup.id}>
                  <TableCell colSpan={10}>{popup.name}</TableCell>
                  <TableCell colSpan={10}>{popup.link}</TableCell>
                  <TableCell colSpan={10}>
                    <a href={popup.image} rel="noreferrer" target="_blank">
                      {t('mobilePersonalization.popup.see')}
                    </a>
                  </TableCell>
                  <TableCell colSpan={10}>
                    {popup.date_created
                      ? DateTime.fromISO(popup.date_created).toFormat('DDDD t')
                      : t('mobilePersonalization.popup.noCreationDate')}
                  </TableCell>
                  <TableCell colSpan={10}>
                    {popup.smartlist_name ??
                      t('mobilePersonalization.popup.noSmartlistName')}
                  </TableCell>
                  <TableCell className={classes.action}>
                    <IconButton
                      color="primary"
                      onClick={onClickEditLink(popup)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>

                    <DeleteWithConfirm
                      color="secondary"
                      onClick={handleDelete(popup.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {loading && <LinearProgress />}
      </Paper>
      <div className={clsx(classes.row, classes.buttons)}>
        <Button
          className={classes.leftButton}
          color="primary"
          onClick={handleOpenPopupDialog}
          variant="outlined"
        >
          {t('mobilePersonalization.popup.add')}
        </Button>
      </div>
      {/* CREATE POP-UP DIALOG */}
      {openPopupDialog && (
        <CustomMobilePopupDialog
          key={editingPopup?.id}
          open
          initial={editingPopup}
          onClose={handleClosePopupDialog}
          onSubmit={handleSubmitLink}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  helperText: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    marginLeft: theme.spacing(1),
    borderRadius: 4,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  info: {
    fill: theme.palette.grey[500],
  },
  leftButton: {
    marginRight: theme.spacing(2),
  },
  action: {
    width: 100,
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
}));

const DeleteWithConfirm = withConfirm(
  ({ onClick }: { onClick: () => void }) => (
    <IconButton onClick={onClick} size="small">
      <DeleteIcon />
    </IconButton>
  ),
  'onClick',
  {
    title: 'settings:mobilePersonalization.popup.deleteModal.title',
    cancel: 'settings:mobilePersonalization.popup.deleteModal.cancel',
    confirm: 'settings:mobilePersonalization.popup.deleteModal.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('settings:mobilePersonalization.popup.deleteModal.content')}</p>
    ),
    isDeletion: true,
  },
);

export default CustomMobilePopupSettings;
