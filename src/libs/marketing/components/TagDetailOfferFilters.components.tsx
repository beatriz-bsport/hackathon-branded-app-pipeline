import React from 'react';
import memoize from 'memoize-one';
import { DateTime } from 'luxon';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { TFunction } from 'i18next';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import {
  AlertError,
  DateField,
  Actions,
  defaultHandleSubmit,
  // @ts-expect-error
} from '#components/forms';
import { TagAuthorizationFilter } from '../../../pages/marketing/MarketingTagManagement.page';

const tagAuthorizationOptions = memoize((t: TFunction) => [
  { value: '0', label: t('tag:management.offerDetail.filters.options.all') },
  {
    value: '1',
    label: t('tag:management.offerDetail.filters.options.onlyWhite'),
  },
  {
    value: '2',
    label: t('tag:management.offerDetail.filters.options.onlyBlack'),
  },
]);

const OfferDetailFilterSchema = Yup.object().shape({
  dateStart: Yup.date().required('required'),
  dateEnd: Yup.date()
    .required('required')
    .test(
      'is-after-start',
      'errors.end_before_start',
      function checkIsAfterStart(dateEnd) {
        const { dateStart } = this.parent;

        // @ts-expect-error
        return DateTime.fromISO(dateStart) <= DateTime.fromISO(dateEnd);
      },
    ),
});

export function TagDetailOffersHeaderForm() {
  const { t } = useTranslation(['translation', 'tag']);
  return (
    <Form>
      <Grid container direction="row" spacing={1}>
        <Grid item md={4} xs={12}>
          <DateField fullWidth label={t('common.from')} name="dateStart" />
          <AlertError name="dateStart" />
        </Grid>
        <Grid item md={4} xs={12}>
          <DateField fullWidth label={t('common.until')} name="dateEnd" />
          <AlertError name="dateEnd" />
        </Grid>
        <Grid item md={12}>
          <MaterialUiSingleSelectorField
            isMulti={false}
            name="tagAuthorizationFilter"
            // @ts-expect-error
            options={tagAuthorizationOptions(t)}
            placeholder={t('form.compability.selectPack')}
            title={
              <Typography>
                {t('tag:management.offerDetail.filters.selectorTitle')}
              </Typography>
            }
          />
        </Grid>
        <Grid item md={12}>
          <Actions>
            <Button color="primary" type="submit" variant="outlined">
              {t('common.filter')}
            </Button>
          </Actions>
        </Grid>
      </Grid>
    </Form>
  );
}

export default compose<any, any>(
  withFormik({
    mapPropsToValues: ({
      config,
    }: {
      config: {
        dateStart: DateTime;
        dateEnd: DateTime;
        tagAuthorizationFilter: TagAuthorizationFilter;
      };
    }) => {
      return {
        dateStart: config.dateStart,
        dateEnd: config.dateEnd,
        tagAuthorizationFilter: config.tagAuthorizationFilter.toString(),
      };
    },
    validationSchema: OfferDetailFilterSchema,
    handleSubmit: defaultHandleSubmit,
    enableReinitialize: true,
  }),
)(TagDetailOffersHeaderForm);
