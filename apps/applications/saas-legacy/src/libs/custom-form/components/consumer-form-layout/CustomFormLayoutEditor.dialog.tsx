import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import Dialog from '@material-ui/core/Dialog';
import DialogContextText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { MaterialStyleType } from '../../../../utils/types';
import type { CustomForm, ResponsiveLayouts } from '../../types';
import CustomFormLayout from './CustomFormLayout.form';

type OwnProps = {
  open: boolean;
  initial: CustomForm;
  waiver?: string;
  general_terms_and_conditions?: string;
  saveLayouts: (layout: ResponsiveLayouts) => void;
  closeEditor: () => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof useStyles>> &
  WithTranslation;
export const CustomFormLayoutEditor = (props: Props) => {
  const { t, saveLayouts } = props;
  const [maxWidth, setMaxWidth] = React.useState<number>(385);
  const [layouts, setLayouts] = React.useState(
    Object.keys(props.initial?.layout || {})?.length !== 4
      ? null
      : props.initial?.layout,
  );
  const classes = useStyles(maxWidth);
  const handleWidthChange = React.useCallback(
    (width: number) => {
      saveLayouts(layouts);
      setMaxWidth(width);
    },
    [layouts, saveLayouts],
  );
  return (
    <Dialog fullWidth classes={{ paper: classes.paper }} open={props.open}>
      <div className={classes.dialogTitle}>
        <Typography variant="h5">{t('customForm.editLayoutTitle')} </Typography>
      </div>
      <DialogContextText>
        <div className={classes.formChangeContainer}>
          <InfoOutlinedIcon className={classes.changeWarning} />
          <Typography className={classes.changeWarning} variant="caption">
            {t('customForm.editLayoutSubtitle')}
          </Typography>
        </div>
      </DialogContextText>
      <div className={classes.container}>
        {/* @ts-expect-error */}
        <CustomFormLayout
          asManager
          defaultEditMode
          editable
          general_terms_and_conditions={props.general_terms_and_conditions}
          initial={props.initial}
          layouts={props.initial?.layout}
          maxHeight="65%"
          onLayoutChange={(allLayouts: ResponsiveLayouts) =>
            setLayouts(allLayouts)
          }
          saveLayouts={() => saveLayouts(layouts)}
          setOutterContainerWidth={handleWidthChange}
          waiver={props.waiver}
        />
      </div>
      <DialogActions className={classes.dialogActions}>
        <Button
          color="primary"
          onClick={() => {
            saveLayouts(layouts);
            props.closeEditor();
          }}
          variant="outlined"
        >
          {t('customForm.layout.saveAndExit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const useStyles = makeStyles((theme) => ({
  paper: {
    // @ts-expect-error
    minWidth: (maxWidth) => `${maxWidth + 50}px`,
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255,255, 255, 0.9)',
    height: '90vh',
    '& > .MuiPaper-root': {
      backgroundColor: 'transparent',
    },
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  formContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  formChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  formNoChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${green[600]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  noChangeWarning: {
    color: green[600],
    marginRight: theme.spacing(1),
  },
  dialogTitle: {
    paddingBottom: theme.spacing(2),
  },
  dialogActions: {
    paddingTop: theme.spacing(2),
    marginTop: 'auto',
  },
}));
export default compose<any, OwnProps>(withTranslation('marketing'))(
  CustomFormLayoutEditor,
);
