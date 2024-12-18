import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { IconButton, ListItem, Paper, Typography } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { RestoreFromTrash } from '@material-ui/icons';
import { PerformanceTrackingProgram } from '#src/libs/performance-tracking/types';

import MuiIcon from '#src/components/MuiIcon.component';
import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';

type OwnProps = {
  program: PerformanceTrackingProgram;
  onDelete?: (program: PerformanceTrackingProgram) => void;
  onEdit?: (program: PerformanceTrackingProgram) => void;
  onRestore?: (program: PerformanceTrackingProgram) => void;
};
type Props = OwnProps & WithTranslation;
export const ProgramListItem = (props: Props) => {
  const { t, program, onEdit, onDelete, onRestore } = props;

  const classes = useStyles({ color: program?.color });

  const [isOpenGenericMuiDialog, setIsOpenGenericMuiDialog] =
    useState<boolean>(false);

  return (
    <>
      <Paper className={classes.paper}>
        <ListItem key={`${program?.id}`} divider className={classes.listitem}>
          <div className={classes.icon}>
            <MuiIcon icon={program?.icon} />
          </div>
          <div className={classes.listItemLeft}>
            <Typography className={classes.programName}>
              {program?.name}
            </Typography>
          </div>
          <div className={classes.listItemRight}>
            {onRestore ? (
              <IconButton
                onClick={() => {
                  onRestore(program);
                }}
              >
                <RestoreFromTrash color="secondary" />
              </IconButton>
            ) : null}
            {onEdit ? (
              <IconButton
                onClick={() => {
                  onEdit(program);
                }}
              >
                <EditIcon color="primary" />
              </IconButton>
            ) : null}
            {onDelete ? (
              <IconButton
                onClick={() => {
                  setIsOpenGenericMuiDialog(true);
                }}
              >
                <Delete color="secondary" />
              </IconButton>
            ) : null}
          </div>
        </ListItem>
      </Paper>

      <GenericMuiDialog
        confirmText={t('form.delete')}
        content={t('program.deleteContent')}
        onCancel={() => setIsOpenGenericMuiDialog(false)}
        onConfirm={() => {
          onDelete(program);
          setIsOpenGenericMuiDialog(false);
        }}
        open={isOpenGenericMuiDialog}
        title={t('program.deleteHeader')}
      />
    </>
  );
};
const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  paper: {
    width: '100%',
  },
  listitem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.spacing(8),
  },
  listItemLeft: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
  },
  listItemRight: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  icon: (props) => ({
    width: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: props.color,
    marginRight: theme.spacing(2),
  }),

  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },

  programName: {
    color: '#000000',
    fontWeight: 500,
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramListItem,
);
