import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { useFormikContext, withFormik } from 'formik';

import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

import { TriggerKind } from '#libs/sequential_marketing/constants';
import { getConnectedTriggerDefaultValues } from '#libs/sequential_marketing/components/graph/hooks/utils';
import { getTriggerKind } from '#libs/sequential_marketing/components/helpers/utils';
import { multipleTriggersValidationSchema } from './validationSchema';

import CollapsibleConnectedTriggerContent from './CollapsibleConnectedTriggerContent.component';
import MenuSelectorTextButton from '#components/menu/text';
import useConnectedTriggerChoices from './hooks/useConnectedTriggerChoices.hook';

type Props = {
  customColor: string;
  smartlists: Immutable.ImmutableArray<SmartList>;
  sourceId?: number;
  addTriggerLabel?: string;
  isEntrystep?: boolean;
  updateConnectedTriggerList: (value: ConnectedTrigger[]) => void;
  updateFormValidation: (isValid: boolean) => void;
};

type FormValues = {
  connectedTriggers: ConnectedTrigger[];
};

type HOCProps = Props & FormValues;

/**
 * Form component to create and edit multiple ConnectedTriggers.
 *
 * @param {string} customColor - Custom color for icons.
 * @param {Immutable.ImmutableArray<SmartList>} smartlists - All smartlists of the company.
 * @param {number} sourceId - The id of the sourcce step. If not provided, it means that the source is one of the "general outputs".
 * @param {string} addTriggerLabel - Label for the add trigger button.
 * @param {boolean} isEntrystep - Specifies if the step associated with the form is the entrystep or not.
 * @param {(value: ConnectedTrigger[]) => void} updateConnectedTriggerList - Updates the connected trigger list defined in a parent context.
 * @param {(isValid: boolean) => void} updateFormValidation - Updates the isValid state defined in a parent context. 
 *                                                            isValid is a boolean indicating whether the form is valid or not.
 *                                                            Used to disable submitButton if not valid.
= */
const MultipleConnectedTriggerForm: React.FC<Props> = ({
  customColor,
  smartlists,
  sourceId,
  addTriggerLabel,
  isEntrystep,
  updateConnectedTriggerList,
  updateFormValidation,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const [openItem, setOpenItem] = React.useState<number | null>(null);

  const [withoutCollapseAnimation, setWithoutCollapseAnimation] =
    React.useState(false);

  const { values, isValid } = useFormikContext<FormValues>();

  const handleAddTrigger = React.useCallback(
    (triggerKind: TriggerKind) => {
      updateConnectedTriggerList([
        ...values.connectedTriggers,
        getConnectedTriggerDefaultValues({
          triggerKind,
          sourceId,
        }),
      ]);
      setOpenItem(values.connectedTriggers.length);
    },
    [sourceId, updateConnectedTriggerList, values.connectedTriggers],
  );

  const handleDeleteTrigger = React.useCallback(
    (idx: number) => () => {
      setWithoutCollapseAnimation(true);
      updateConnectedTriggerList(
        values.connectedTriggers.filter((_, index) => index !== idx),
      );
      openItem === idx && setOpenItem(null);
      openItem > idx && setOpenItem((prev) => prev - 1);
    },
    [openItem, updateConnectedTriggerList, values.connectedTriggers],
  );

  const handleEditTrigger = React.useCallback(
    (idx: number) => () =>
      openItem === idx ? setOpenItem(null) : setOpenItem(idx),
    [openItem],
  );

  const handleUpdateTrigger = React.useCallback(
    (idx: number) => (trigger: ConnectedTrigger) => {
      updateConnectedTriggerList(
        values.connectedTriggers.map((connectedTrigger, index) =>
          index === idx ? trigger : connectedTrigger,
        ),
      );
    },
    [updateConnectedTriggerList, values.connectedTriggers],
  );

  const connectedTriggerActionList = useConnectedTriggerChoices({
    addConnectedTrigger: handleAddTrigger,
    connectedTriggersToExclude: isEntrystep ? [TriggerKind.ONLY_TIMEOUT] : [],
    customColor,
  });

  React.useEffect(() => {
    updateConnectedTriggerList(values.connectedTriggers);
    setWithoutCollapseAnimation(false);
  }, [updateConnectedTriggerList, values.connectedTriggers]);

  React.useEffect(() => {
    updateFormValidation(isValid);
  }, [isValid, updateFormValidation]);

  return (
    <div className={classes.container}>
      {!!values?.connectedTriggers?.length && (
        <div className={classes.content}>
          {values.connectedTriggers.map((connectedTrigger, index) => (
            <CollapsibleConnectedTriggerContent
              key={`ConnectedTrigger:${index}_${connectedTrigger.trigger_config.uuid}`}
              color={customColor}
              deleteTrigger={handleDeleteTrigger(index)}
              isLast={index === values.connectedTriggers.length - 1}
              isOpen={index === openItem}
              openOrCloseTrigger={handleEditTrigger(index)}
              smartlists={smartlists}
              trigger={connectedTrigger}
              triggerKind={getTriggerKind(connectedTrigger)}
              updateTrigger={handleUpdateTrigger(index)}
              withoutCollapseAnimation={withoutCollapseAnimation}
            />
          ))}
        </div>
      )}
      <div className={classes.addButton}>
        <MenuSelectorTextButton
          actionList={connectedTriggerActionList}
          customColor={customColor}
          isDisabled={values.connectedTriggers?.length >= 5}
          label={addTriggerLabel || `+ ${t('cadence.trigger.addTrigger')}`}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  content: {
    marginBottom: theme.spacing(4),
  },
  addButton: {
    display: 'flex',
  },
}));

const withFormikWrapper = withFormik<HOCProps, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: ({ connectedTriggers }) => ({ connectedTriggers }),
  handleSubmit: (_values, { setSubmitting }) => {
    setSubmitting(false);
  },
  validateOnMount: true,
  validationSchema: multipleTriggersValidationSchema,
});

export default React.memo(withFormikWrapper(MultipleConnectedTriggerForm));
