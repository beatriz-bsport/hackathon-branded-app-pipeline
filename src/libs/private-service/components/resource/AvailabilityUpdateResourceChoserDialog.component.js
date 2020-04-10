// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RadioButton from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ResourceItem from './ResourceItem.component';

type Props = {
  t: TFunction,
};

export const AvailabilityUpdatResourceChoserDialog = (props: Props) => {
  const { t, classes } = props;
  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {t('availabilitySlot.form.resourceSelector.title')}
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t('availabilitySlot.form.resourceSelector.label')}
          </FormLabel>
          <RadioGroup
            aria-label="resource-identifier"
            name="resource-identifier"
            value={props.selectedResourceIdentifier}
            onChange={(ev) => {
              props.setSelectedResourceIdentifier(ev.target.value);
            }}
          >
            {props.resourceAvailable.map(({ datatype, data }) =>
              data.map((resourceData) => (
                <div
                  className={classes.radioGroup}
                  key={resourceData.resource_identifier}
                >
                  <RadioButton
                    onChange={(ev) =>
                      props.setSelectedResourceIdentifier(ev.target.value)
                    }
                    value={resourceData.resource_identifier}
                    checked={
                      resourceData.resource_identifier ===
                      props.selectedResourceIdentifier
                    }
                  />

                  <ResourceItem
                    onEditResourceConfiguration={() => {
                      props.setSelectedResourceIdentifier(
                        resourceData.resource_identifier,
                      );
                    }}
                    resource={resourceData}
                  />
                </div>
              )),
            )}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('availabilitySlot.form.resourceSelector.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={!props.selectedResourceIdentifier}
          onClick={() => {
            const [k, v] = props.selectedResourceIdentifier.split(':');
            props.onSubmit({ [k]: v });
          }}
        >
          {t('availabilitySlot.form.resourceSelector.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = () => ({
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState(
    'selectedResourceIdentifier',
    'setSelectedResourceIdentifier',
    null,
  ),
)(AvailabilityUpdatResourceChoserDialog);
