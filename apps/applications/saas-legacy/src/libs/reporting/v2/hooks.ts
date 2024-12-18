import React from 'react';
import debounce from 'lodash/debounce';
import { checkIsReportNameUsedAPI } from '#src/libs/reporting/v2/api';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

export const useCheckIsNameAlreadyUsed = (
  fieldName: string,
  category: ReportCategoryEnum,
  reportId?: number,
) => {
  const [isNameChecking, setIsNameChecking] = React.useState(false);
  const { setFieldTouched, setFieldValue, setFieldError } = useFormikContext();
  const { t } = useTranslation('reporting');

  // useMemo instead of useCallback to get around ESLint warning
  // https://stackoverflow.com/questions/61785903/problems-with-debounce-in-useeffect
  const checkIsNameAlreadyUsed = React.useMemo(
    () =>
      debounce(async (name: string) => {
        if (!name?.length) {
          setIsNameChecking(false);
          return;
        }
        const { data } = await checkIsReportNameUsedAPI({
          name,
          category,
          ...(reportId && { reportIdToIgnore: reportId }),
        });

        if (data?.is_used) {
          setFieldError(fieldName, t('reportCreateModal.nameAlreadyUsed'));
        }
        setIsNameChecking(false);
      }, 500),
    [setFieldError, t, fieldName, reportId, category],
  );

  const handleOnChange = React.useCallback(
    (event) => {
      setIsNameChecking(true);
      setFieldTouched(fieldName, true, false); // necessary for ErrorMessage from formik
      setFieldValue(fieldName, event.target.value, true);
      checkIsNameAlreadyUsed(event.target.value);
    },
    [setFieldTouched, setFieldValue, checkIsNameAlreadyUsed, fieldName],
  );

  return { isNameChecking, handleOnChange };
};
