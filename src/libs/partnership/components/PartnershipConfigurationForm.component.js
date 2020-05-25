// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { withFormik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { CheckboxField, Submit } from '../../../components/forms';

import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  establishmentList: Array<Establishment>,
};
export const PartnershipConfigurationForm = (props: Props) => {
  const { t, classes, establishmentList } = props;
  return (
    <Form>
      <CheckboxField label={t('parameters.enabled')} reverted name="disabled" />
      <div className={classes.establishmentSelector}>
        <FieldArray name="associated_establishment_ids">
          {({
            push,
            remove,
            form: {
              values: { associated_establishment_ids },
            },
          }) => (
            <div>
              <EstablishmentSelector
                closeMenuOnSelect
                placeholder={t('parameters.establishment')}
                establishments={establishmentList.filter(
                  (e) => !associated_establishment_ids.includes(e.id),
                )}
                selectedEstablishments={[]}
                selectOption={(e) => {
                  if (e && e.length && e[0].value) push(e[0].value);
                }}
              />
              {associated_establishment_ids.length === 0 ? (
                <Typography className={classes.allEstablishmentText}>
                  {t('parameters.allEstablishment')}
                </Typography>
              ) : null}
              {associated_establishment_ids.map((id, i) => {
                const establishment = props.establishmentList.find(
                  (e) => e.id === id,
                );
                if (establishment) {
                  return (
                    <EstablishmentListItem
                      key={`${id}-${i}`}
                      dense
                      establishment={establishment}
                      onClickDelete={() => remove(i)}
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
        </FieldArray>
      </div>
      <Submit>{t('actions.save')}</Submit>
    </Form>
  );
};

const styles = (theme) => ({
  establishmentSelector: {
    paddingBottom: theme.spacing(1),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#F4F4F4',
  },
  allEstablishmentText: {
    padding: theme.spacing(2),
  },
});

export const PartnershipSchema = Yup.object().shape({
  id: Yup.number().required(),
  associated_establishment_ids: Yup.array().of(Yup.number()),
});

export const PartnershipFormHoc = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial, establishmentList }) =>
    initial
      ? {
          ...initial,
          associated_establishment_ids: [
            ...initial.associated_establishment_ids
              .map((id) =>
                establishmentList.find((e) =>
                  e.associatedestablishment_set.includes(id),
                ),
              )
              .filter((e) => !!e)
              .map((e) => e.id),
          ],
        }
      : initial,
  validationSchema: PartnershipSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withTranslation(['partnership']),
  withStyles(styles),
  PartnershipFormHoc,
)(PartnershipConfigurationForm);
