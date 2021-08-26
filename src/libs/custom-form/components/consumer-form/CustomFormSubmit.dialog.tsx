import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  open: boolean;
  goToUserSpace: () => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const CustomFormSubmitDialog = (props: Props) => {
  const { t, classes, open } = props;
  return (
    <Dialog open={open}>
      <DialogTitle>
        <div className={classes.title}>
          <Typography>{t('customForm.submit.dialog.title')}</Typography>
          <div className={classes.doneIconContainer}>
            <DoneIcon className={classes.doneIcon} />
          </div>
        </div>
      </DialogTitle>
      <DialogContent>{t('customForm.submit.dialog.content')}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={props.goToUserSpace}
        >
          {t('customForm.submit.dialog.confirmButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const styles = (theme: Theme) => ({
  title: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneIcon: {
    color: 'green',
  },
  doneIconContainer: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormSubmitDialog);
