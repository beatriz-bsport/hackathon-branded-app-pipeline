import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Dialog, Typography } from '@material-ui/core';
import { OptionCallback } from '../../../../state/types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { PerformanceTrackingProgram } from '#libs/performance-tracking/types';
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
      <Dialog open={isDialogChooseProgramOpen}>
        <div className={classes.dialog}>
          <Typography variant="h5">{t('program.selectProgram')}</Typography>
          <MaterialUISelector
            isMenuListPaddingDisabled
            placeholder={t('program.selectProgram')}
            itemRenderer={(itemProps) => {
              return (
                <ProgramMenuItem
                  isInSelector
                  isDisabled={itemProps.isDisabled}
                  isSelected={itemProps.isSelected}
                  program={programList.find(
                    (program) => program.id === itemProps.data.value,
                  )}
                />
              );
            }}
            options={programList?.map((program) => ({
              value: program.id,
              label: program.name,
            }))}
            onChange={(option: { value: number; label: string }) =>
              setProgramToAddToMember(option.value)
            }
          />

          <div className={classes.action}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsDialogChooseProgramOpen(false)}
            >
              {t('form.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                createMemberProgram(programToAddToMember);
                setIsDialogChooseProgramOpen(false);
              }}
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
