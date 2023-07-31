import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import type { CustomForm } from '../types';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { OptionCallback } from '../../../state/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Customform,
);
type OwnProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any, options?: OptionCallback) => void;
  customFormSelected: CustomForm;
};
type Props = OwnProps & WithTranslation;
export const CustomFormCreatedialog = (props: Props) => {
  const { t, customFormSelected } = props;
  const name = customFormSelected ? customFormSelected.name : '';
  const [customFormName, setCustomFormName] = React.useState(name);
  React.useEffect(() => {
    trackFormAdd(customFormSelected?.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    customFormSelected && setCustomFormName(customFormSelected.name);
  }, [customFormSelected]);
  const handleSubmit = () => {
    trackFormSubmitIntent(customFormSelected?.id);
    props.onSubmit(
      {
        ...(customFormSelected && customFormSelected),
        name: customFormName,
      },
      {
        onSuccess: () => trackFormSuccess(customFormSelected?.id),
      },
    );
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={props.open}
      onClose={props.handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">{t('customForm.title')}</DialogTitle>
      <DialogContent>
        <TextField
          value={customFormName}
          placeholder={t('customForm.name')}
          onChange={(ev) => setCustomFormName(ev.target.value)}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            trackFormCancel(customFormSelected?.id);
            props.handleClose();
          }}
          color="secondary"
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!customFormName}
          color="secondary"
        >
          {customFormSelected ? t('update') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default compose<any, OwnProps>(withTranslation('marketing'))(
  CustomFormCreatedialog,
);
