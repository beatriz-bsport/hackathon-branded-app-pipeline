// @flow
import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik } from 'formik';

import { TextField } from '../../../../components/forms';

type Props = {
  t: TFunction,
  classes: Object,
};
export const PrivateServiceGroupForm = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <TextField
        variant="outlined"
        label={props.t('serviceGroup.form.name.label')}
        name="name"
      />
    </div>
  );
};

export const PrivateServiceGroupSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export const PrivateServiceGroupFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) return initial;
    return {
      name: '',
    };
  },
  validationSchema: PrivateServiceGroupSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['privateService']),
)(PrivateServiceGroupForm);
