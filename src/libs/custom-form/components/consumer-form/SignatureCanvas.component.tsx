import React from 'react';
import './styles.css';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme, useTheme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SignaturePad from 'react-signature-canvas';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  open: boolean;
  closeCanvas: () => void;
  setTrimmedDataURL: (DataUrl: string) => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const SignatureCanvas = (props: Props) => {
  const { t, classes, open, setTrimmedDataURL } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const signCanvas = React.useRef({});
  const clear = () => signCanvas.current.clear();
  const save = () => {
    setTrimmedDataURL(
      signCanvas.current.getTrimmedCanvas().toDataURL('image/png'),
    );
    props.closeCanvas();
  };
  return (
    <Dialog open={open} fullScreen={fullScreen} fullWidth maxWidth="md">
      <DialogTitle>
        {t('customForm.customFormField.modal.signature.addSignature')}
      </DialogTitle>
      <DialogContentText className={classes.dialogText}>
        {t('customForm.customFormField.modal.signature.addSignatureHelper')}
      </DialogContentText>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.clearContainer}>
          <Button onClick={clear} color="secondary">
            {t('customForm.customFormField.modal.signature.clear')}
          </Button>
        </div>

        <SignaturePad
          ref={signCanvas}
          canvasProps={{ className: 'signatureCanvas' }}
        />
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button onClick={props.closeCanvas} color="secondary">
          {t('customForm.cancel')}
        </Button>
        <Button onClick={save} color="primary">
          {t('customForm.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const styles = (theme: Theme) => ({
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dialogText: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    marginBottom: 0,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 0,
  },
  signatureCanvas: {
    border: '1px solid',
    width: '100%',
  },
  clearContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(SignatureCanvas);
