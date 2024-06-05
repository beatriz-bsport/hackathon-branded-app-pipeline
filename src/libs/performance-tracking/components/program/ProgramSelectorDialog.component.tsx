import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Dialog, Typography } from '@material-ui/core';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
import { OptionCallback } from '../../../../state/types';
import ProgramMenuItem from './ProgramMenuItem.component';

type OwnProps = {
  programList: Array<PerformanceTrackingProgram>;
  isDialogChooseProgramOpen: boolean;
  setIsDialogChooseProgramOpen: (bool: boolean) => void;
  createMemberProgram: (
    programToAddToMember: number,
    option?: OptionCallback,
  ) => void;
};
type Props = OwnProps & WithTranslation;
export const ProgramSelectorDialog = (props: Props) => {
  const [programToAddToMember, setProgramToAddToMember] = useState(null);
  const {
    t,
    programList,
    isDialogChooseProgramOpen,
    setIsDialogChooseProgramOpen,
    createMemberProgram,
  } = props;
  const classes = useStyles();
  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={isDialogChooseProgramOpen}>
        <div className={classes.dialog}>
          <Typography className={classes.title} variant="h6">
            {t('program.selectProgram')}
          </Typography>

          <MaterialUISelector
            isMenuListPaddingDisabled
            itemRenderer={(itemProps) => {
              return (
                <ProgramMenuItem
                  isInSelector
                  isDisabled={itemProps.isDisabled}
                  isSelected={itemProps.isSelected}
                  program={programList?.find(
                    (program) => program.id === itemProps.data.value,
                  )}
                />
              );
            }}
            onChange={(option: { value: number; label: string }) =>
              setProgramToAddToMember(option.value)
            }
            options={programList?.map((program) => ({
              value: program.id,
              label: program.name,
            }))}
            placeholder={t('program.selectProgram')}
          />

          <div className={classes.action}>
            <Button onClick={() => setIsDialogChooseProgramOpen(false)}>
              {t('form.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                createMemberProgram(programToAddToMember);
                setIsDialogChooseProgramOpen(false);
              }}
              variant="contained"
            >
              {t('form.add')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  title: {
    fontWeight: 500,
  },
  dialog: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramSelectorDialog,
);
