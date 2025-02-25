import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import { ErrorMessage, useFormikContext } from 'formik';
import SeamlessImmutable from 'seamless-immutable';
import {
  MaterialUiSingleSelectorField,
  SwitchField,
} from '#src/libs/custom-form/components/GenericFormik.input';
import { SmartList } from '#src/libs/smart-list/types';
import { CommunicationSentGroupConfigFormValues } from '#src/libs/communication/types';

type Props = {
  index: number;
  companyName: string;
  companyId: number;
  smartLists: SeamlessImmutable.ImmutableArray<SmartList>;
  toggleDisabled: boolean;
};

export const CommunicationSentGroupConfigSmartlistSelectionRow: React.FC<
  Props
> = ({ index, companyName, companyId, smartLists, toggleDisabled }) => {
  const { t } = useTranslation('campaign');
  const classes = useStyle();

  const { values, setFieldValue } =
    useFormikContext<CommunicationSentGroupConfigFormValues>();

  const options = useMemo(() => {
    const filteredOptions = (smartLists ?? [])
      .filter((smartList) => smartList.company === companyId)
      .map((smartList) => ({
        label: smartList.name,
        value: smartList.id,
      }));
    // using spread operator to make options mutable since that's what MaterialUiSingleSelectorField need
    return [...filteredOptions];
  }, [smartLists, companyId]);

  const handleSwitchFieldOnChange = React.useCallback(() => {
    setFieldValue(
      `companiesWithSmartLists.${index}.toggleSend`,
      !values.companiesWithSmartLists[index].toggleSend,
      false,
    );
    if (values.companiesWithSmartLists[index].toggleSend) {
      setFieldValue(
        `companiesWithSmartLists.${index}.smartListId`,
        null,
        false,
      );
    }
  }, [values.companiesWithSmartLists, index, setFieldValue]);

  return (
    <div className={classes.row}>
      <div className={classes.companyNameAndToggle}>
        <SwitchField
          label={companyName}
          name={`companiesWithSmartLists.${index}.toggleSend`}
          onChange={handleSwitchFieldOnChange}
        />
      </div>
      <div className={classes.selector}>
        <MaterialUiSingleSelectorField
          inScrollBar
          withoutNullValues
          isDisabled={toggleDisabled}
          name={`companiesWithSmartLists.${index}.smartListId`}
          options={options}
          placeholder={t('smartListOption')}
        />
        <ErrorMessage name={`companiesWithSmartLists.${index}.smartListId`}>
          {(error_msg) => (
            <Typography color="error" variant="caption">
              {t(`${error_msg}`)}
            </Typography>
          )}
        </ErrorMessage>
      </div>
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  row: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  companyNameAndToggle: {
    display: 'flex',
    width: '200px',
  },
  selector: {
    minWidth: '400px',
  },
}));

export default React.memo(CommunicationSentGroupConfigSmartlistSelectionRow);
