// @ts-nocheck
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import HTMLPreview from './HTMLPreview.component';
import { ResolvedGenericTags } from '#libs/email-editor/types';

export type OwnProps = {
  html?: any;
  loading?: boolean;
  onClose: () => void;
  open: boolean;
  title?: string;
  buttonText?: string;
  resolvedGenericTags?: ResolvedGenericTags;
};

const HTMLPreviewDialog = (props: OwnProps) => {
  const classes = useStyles();
  const { t } = useTranslation('common');
  return (
    <GenericResponsiveDialog open={props.open} onClose={props.onClose}>
      <>
        <DialogContent className={classes.content}>
          <HTMLPreview
            title={props.title}
            html={props.html}
            loading={props.loading}
            scrolling
            inDialog
            resolvedGenericTags={props.resolvedGenericTags}
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.buttonClose} onClick={props.onClose}>
            {props.buttonText || t('close')}
          </Button>
        </DialogActions>
      </>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonClose: {
    color: theme.palette.text.secondary,
  },
  content: {
    display: 'flex',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      height: '90%',
    },
  },
}));

export default HTMLPreviewDialog;
