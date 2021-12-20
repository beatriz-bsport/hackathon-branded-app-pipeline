import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { IconButton, MenuItem, Typography } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { PerformanceTrackingProgram } from '#libs/performance-tracking/types';

import MuiIcon from '#components/MuiIcon.component';
import GenericMuiDialog from '#components/genericDialog/GenericMuiDIalog';

type OwnProps = {
  program: PerformanceTrackingProgram;
  onDelete?: (program: PerformanceTrackingProgram) => void;
  onEdit?: (program: PerformanceTrackingProgram) => void;
  isDisabled?: boolean;
  isSelected?: boolean;
  isInSelector?: boolean;
  onClickOnItem?: (program: PerformanceTrackingProgram) => void;
  isLinkedToMemberProgram?: boolean;
};
type Props = OwnProps & WithTranslation;
export const ProgramMenuItem = (props: Props) => {
  const {
    t,
    onEdit,
    onDelete,
    onClickOnItem,
    program,
    isSelected,
    isDisabled,
    isInSelector,
    isLinkedToMemberProgram,
  } = props;
  const [isOpenGenericMuiDialog, setIsOpenGenericMuiDialog] =
    useState<boolean>(false);
  const classes = useStyles({ color: program?.color, isInSelector });

  return (
    <>
      <MenuItem
        disabled={isDisabled}
        selected={isSelected}
        className={classes.listitem}
        key={`${program?.id}`}
        dense
        divider
        onClick={() => onClickOnItem && onClickOnItem(program)}
      >
        <div className={classes.icon}>
          <MuiIcon icon={program?.icon} />
        </div>
        <div className={classes.listItemLeft}>
          <Typography className={classes.programName}>
            {program?.name}
          </Typography>
        </div>
        <div className={classes.listItemRight}>
          {onEdit ? (
            <IconButton
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                onEdit(program);
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
          ) : null}
          {onDelete ? (
            <IconButton
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                if (isInSelector) {
                  onDelete(program);
                } else {
                  setIsOpenGenericMuiDialog(true);
                }
              }}
            >
              <Delete color="secondary" />
            </IconButton>
          ) : null}
        </div>
      </MenuItem>
      <GenericMuiDialog
        open={isOpenGenericMuiDialog}
        title={
          isLinkedToMemberProgram
            ? t('memberProgram.deleteHeader')
            : t('program.deleteHeader')
        }
        content={
          isLinkedToMemberProgram
            ? t('memberProgram.deleteContent')
            : t('program.deleteContent')
        }
        confirmText={t('form.delete')}
        onCancel={() => setIsOpenGenericMuiDialog(false)}
        onConfirm={() => {
          onDelete(program);
          setIsOpenGenericMuiDialog(false);
        }}
      />
    </>
  );
};
const useStyles = makeStyles<Theme, { color: string; isInSelector: boolean }>(
  (theme) => ({
    paper: {
      width: '100%',
    },
    listitem: (props) => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: props.isInSelector ? theme.spacing(6) : theme.spacing(8),
    }),
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
      gap: theme.spacing(1),
    },
    icon: (props) => ({
      width: theme.spacing(3),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      color: props.color,
      marginRight: theme.spacing(2),
    }),
    buttonBase: {
      width: '100%',
    },

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
  }),
);
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramMenuItem,
);
