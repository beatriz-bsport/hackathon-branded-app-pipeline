import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Paper, Typography } from '@material-ui/core';

import {
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';

import MuiIcon from '#components/MuiIcon.component';
import GenericMuiDialog from '#components/genericDialog/GenericMuiDIalog';
import TypographyMultilineComponent from '#components/TypographyMultiline.component';

type OwnProps = {
  program: PerformanceTrackingProgram<PerformanceTrackingMetric>;
  onDelete: (program: PerformanceTrackingProgram) => void;
  onEdit: (program: PerformanceTrackingProgram) => void;
};
type Props = OwnProps & WithTranslation;
export const ProgramCard = (props: Props) => {
  const { t, program, onEdit, onDelete } = props;
  const classes = useStyles({ color: program?.color });
  const [isOpenGenericMuiDialog, setIsOpenGenericMuiDialog] = useState(false);
  return (
    <>
      <Paper square className={classes.paperItem}>
        <div className={classes.nameAndDefault}>
          <div className={classes.textAndIcon}>
            <div className={classes.icon}>
              <MuiIcon icon={program?.icon} />
            </div>

            <Typography className={classes.programName}>
              {program?.name}
            </Typography>
          </div>
          <Typography className={classes.default}>
            {program?.is_default ? t('program.default') : null}
          </Typography>
        </div>
        {program.description && (
          <div className={classes.multiline}>
            <TypographyMultilineComponent>
              {program.description}
            </TypographyMultilineComponent>
          </div>
        )}
        <div className={classes.action}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onEdit(program)}
          >
            {t('program.form.modify')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsOpenGenericMuiDialog(true)}
          >
            {t('program.form.delete')}
          </Button>
        </div>
      </Paper>
      <GenericMuiDialog
        open={isOpenGenericMuiDialog}
        title={t('program.deleteHeader')}
        content={t('program.deleteContent')}
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
const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  multiline: {
    marginTop: '-1em',
    marginBottom: '-1em',
  },
  nameAndDefault: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  default: {
    color: '#757575',
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
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
  textAndIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  paperItem: (props) => ({
    width: '100%',
    borderLeft: `3px solid`,
    borderColor: props.color,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  }),
  programName: {
    color: '#000000',
    fontWeight: 500,
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramCard,
);
