// @flow
import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

type Props = {
  t: TFunction,
  classes: Object,
  compatiblePassByService: any,
  onSubmit: (data: any) => void,
  onCancel: () => void,
};

export const PrivateSlotCompatibleServiceForm = (props: Props) => {
  const { compatiblePassByService, t, classes } = props;
  const slots = (
    (compatiblePassByService || {}).private_service || { slots: [] }
  ).slots.filter((s) => !!s && s.avalable);
  const [unselectedSlots, setUnselectedSlots] = React.useState(
    (compatiblePassByService || {}).excluded_slot_ids || [],
  );
  const handleChange = (slotId: number, checked: boolean) => {
    const new_array = unselectedSlots.filter((item) => item !== slotId);
    if (!checked) {
      setUnselectedSlots([...new_array, slotId]);
    } else {
      setUnselectedSlots(new_array);
    }
  };
  const handleSubmit = () => {
    props.onSubmit({ excluded_slot_ids: unselectedSlots });
  };
  const checkChange = () => {
    if (compatiblePassByService) {
      return (
        unselectedSlots.length ===
        compatiblePassByService.excluded_slot_ids.length
      );
    }
    return true;
  };
  return (
    <div className={classes.contain}>
      <FormGroup className={classes.checkboxContain}>
        {!!slots && slots.length === 0 && (
          <div className={classes.row}>
            <WarningIcon coilor="textSecondary" />
            <Typography variant="caption" color="textSecondary">
              {t('privateServiceCompatibility.excludedSlots.isEmpty')}
            </Typography>
          </div>
        )}
        {!!slots &&
          !!slots.length &&
          slots.map((slot) => (
            <FormControlLabel
              key={slot.id}
              label={slot.name}
              control={
                <Checkbox
                  checked={
                    !(
                      unselectedSlots &&
                      unselectedSlots.length &&
                      unselectedSlots.filter((s) => s === slot.id).length
                    )
                  }
                  onChange={(event) =>
                    handleChange(slot.id, event.target.checked)
                  }
                />
              }
            />
          ))}
      </FormGroup>
      <Typography variant="body2" className={classes.inputContain}>
        {t('privateServiceCompatibility.excludedSlots.helperText')}
      </Typography>
      <div className={classes.buttonContainer}>
        <Button onClick={props.onCancel}>
          {t('privateServiceCompatibility.excludedSlots.cancel')}
        </Button>
        <Button disabled={checkChange()} onClick={handleSubmit} color="primary">
          {t('privateServiceCompatibility.excludedSlots.submit')}
        </Button>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  contain: {
    maxWidth: 300,
  },
  checkboxContain: {
    marginLeft: theme.spacing(2),
  },
  inputContain: {
    marginTop: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateSlotCompatibleServiceForm);
