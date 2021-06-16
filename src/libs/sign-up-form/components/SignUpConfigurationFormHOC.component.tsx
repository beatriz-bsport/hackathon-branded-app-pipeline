import React from 'react';
import { withFormik, FieldArray, connect as formikConnect } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'redux';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckBox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import type { PollField, SignUpFormConfig } from '../types';

type OwnProps = {
  onSubmit: (signUpConfiguration: SignUpFormConfig) => void;
  setFieldValue: (identifier: string) => void;
};
type Props = OwnProps & WithTranslation & SignUpFormConfig;

export const FieldFormikCallBack = formikConnect((props) => {
  const { setFieldValue } = props;
  React.useEffect(() => {
    if (!props.formik.values.poll_fields[props.index].show_on_edition) {
      setFieldValue(`poll_fields.${props.index}.editable_on_edition`, false);
    }
    if (!props.formik.values.poll_fields[props.index].show_on_creation) {
      setFieldValue(`poll_fields.${props.index}.mandatory_on_creation`, false);
    }
    if (props.formik.values.poll_fields[props.index].mandatory_on_creation) {
      setFieldValue(`poll_fields.${props.index}.show_on_edition`, true);
      setFieldValue(`poll_fields.${props.index}.editable_on_edition`, true);
    }
  }, [props.formik.values, props.index]);

  return null;
});

export function SignUpConfigurationFields(props: Props) {
  const { t, setFieldValue } = props;
  return (
    <>
      <FieldArray name="field_array">
        {({
          form: {
            values: { poll_fields },
          },
        }) => (
          <TableContainer>
            <Table>
              {!!poll_fields && poll_fields.length > 0 && (
                <>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2} />
                      <TableCell colSpan={2} align="center" size="small">
                        {t('signUpForm.account_creation')}
                      </TableCell>
                      <TableCell colSpan={2} align="center" size="small">
                        {t('signUpForm.account_modification')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t('signUpForm.field_identifier')}</TableCell>
                      <TableCell>{t('signUpForm.label')}</TableCell>{' '}
                      <TableCell align="center" size="small">
                        {t('signUpForm.show')}
                      </TableCell>
                      <TableCell align="center" size="small">
                        {t('signUpForm.required')}
                      </TableCell>
                      <TableCell align="center" size="small">
                        {t('signUpForm.show')}
                      </TableCell>
                      <TableCell align="center" size="small">
                        {t('signUpForm.editable')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {poll_fields
                      .filter((field: PollField) => {
                        if (field.field_identifier === 'waiver') {
                          return props.theme.waiver !== '';
                        }
                        return true;
                      })
                      .map((field: PollField, i: number) => (
                        <>
                          <TableRow key={i}>
                            <FieldFormikCallBack {...props} index={i} />
                            <TableCell>
                              {t(`signUpForm.fields.${field.field_identifier}`)}
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="text"
                                variant="outlined"
                                name={`poll_fields.${i}.label`}
                                value={field.label}
                                onChange={(ev) => {
                                  setFieldValue(
                                    `poll_fields.${i}.label`,
                                    ev.target.value,
                                  );
                                }}
                                placeholder={t(
                                  `signUpForm.fields.${field.field_identifier}`,
                                )}
                              />
                            </TableCell>
                            <TableCell align="center" size="small">
                              <CheckBox
                                id={`checkbox_show_on_creation${field.field_identifier}`}
                                name={`poll_fields.${i}.show_on_creation`}
                                checked={field.show_on_creation}
                                disabled={field.is_always_shown}
                                onClick={() => {
                                  setFieldValue(
                                    `poll_fields.${i}.show_on_creation`,
                                    !props.values.poll_fields[i]
                                      .show_on_creation,
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell align="center" size="small">
                              <CheckBox
                                id={`checkbox_required_on_creation${field.field_identifier}`}
                                name={`poll_fields.${i}.mandatory_on_creation`}
                                checked={field.mandatory_on_creation}
                                disabled={
                                  field.is_always_required ||
                                  !field.show_on_creation
                                }
                                onClick={() => {
                                  setFieldValue(
                                    `poll_fields.${i}.mandatory_on_creation`,
                                    !props.values.poll_fields[i]
                                      .mandatory_on_creation,
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell align="center" size="small">
                              <CheckBox
                                id={`checkbox_show_on_modification${field.field_identifier}`}
                                name={`poll_fields.${i}.show_on_edition`}
                                checked={field.show_on_edition}
                                disabled={
                                  field.is_always_shown &&
                                  field.is_always_required
                                }
                                onClick={() => {
                                  setFieldValue(
                                    `poll_fields.${i}.show_on_edition`,
                                    !props.values.poll_fields[i]
                                      .show_on_edition,
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell align="center" size="small">
                              <CheckBox
                                id={`checkbox_required_on_creation${field.field_identifier}`}
                                name={`poll_fields.${i}.editable_on_edition`}
                                checked={field.editable_on_edition}
                                disabled={
                                  field.is_always_required ||
                                  !field.show_on_edition
                                }
                                onClick={() => {
                                  setFieldValue(
                                    `poll_fields.${i}.editable_on_edition`,
                                    !props.values.poll_fields[i]
                                      .editable_on_edition,
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                  </TableBody>
                </>
              )}
            </Table>
          </TableContainer>
        )}
      </FieldArray>
    </>
  );
}
export const SignUpConfigurationFormHoc = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return initial;
    }
    return {};
  },
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values.id, values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withTranslation(['theme']),
)(SignUpConfigurationFields);
