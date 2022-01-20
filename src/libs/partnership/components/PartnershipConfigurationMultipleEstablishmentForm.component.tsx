import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { withFormik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { CheckboxField, Submit } from '../../../components/forms';

import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

import { Establishment } from '../../establishment/types';
import { PartnershipCompany } from '../types';

type Props = {
  establishmentList: Array<Establishment>;
};
export const PartnershipConfigurationMultipleEstablishmentForm: React.FC<
  Props
> = (props) => {
  const { establishmentList } = props;
  const { t } = useTranslation(['partnership']);
  const classes = useStyles();

  return (
    <Form>
      <div style={{ display: 'none' }}>
        <CheckboxField
          label={t('parameters.enabled')}
          reverted
          name="disabled"
        />
      </div>
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
                selectOption={(e: Array<{ value: number; label: string }>) => {
                  if (e && e.length && e[0].value) push(e[0].value);
                }}
              />
              {associated_establishment_ids.length === 0 ? (
                <Typography className={classes.allEstablishmentText}>
                  {t('parameters.allEstablishment')}
                </Typography>
              ) : null}
              {associated_establishment_ids.map((id: number, i: number) => {
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

const useStyles = makeStyles((theme: Theme) => ({
  establishmentSelector: {
    paddingBottom: theme.spacing(1),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#F4F4F4',
  },
  allEstablishmentText: {
    padding: theme.spacing(2),
  },
}));

export const PartnershipSchema = Yup.object().shape({
  id: Yup.number().required(),
  associated_establishment_ids: Yup.array().of(Yup.number()),
});

export const PartnershipFormHoc = withFormik({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial, establishmentList }: { initial: PartnershipCompany, establishmentList: Array<Establishment>}) => {
    return initial
      ? {
          ...initial,
          override_establishment_pk: null,
          associated_establishment_ids: [
            ...initial.associated_establishment_ids
              .map((id: number) =>
                establishmentList.find((e) =>
                  e.associatedestablishment_set.includes(id),
                ),
              )
              .filter((e: Establishment) => !!e)
              .map((e: Establishment) => e.id),
          ],
        }
      : initial;
  },
  validationSchema: PartnershipSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(PartnershipFormHoc)(
  PartnershipConfigurationMultipleEstablishmentForm,
);
