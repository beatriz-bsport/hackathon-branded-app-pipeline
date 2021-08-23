import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Theme } from '@material-ui/core/styles';
import { Form } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Submit } from '../../../../components/forms';
import ConsumerFormFields, {
  ConsumerFormFieldsHOC,
} from './CustomForm.formik-hoc';
import { MaterialStyleType } from '../../../../utils/types';
import { CustomForm, CustomFormFieldAnswer } from '../../types';

type OwnProps = {
  asManager?: boolean;
  handleCancel?: () => void;
  isSubmitting?: boolean;
  initial?: CustomForm;
  onSubmit?: (data: CustomForm, options: any) => void;
  initialWithAnswer?: CustomFormFieldAnswer;
  refreshLoading?: boolean;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export function ConsumerFormView(props: Props) {
  const { t, isSubmitting, classes, asManager } = props;
  if (props.refreshLoading) {
    return <LinearProgress />;
  }
  if (
    props.initial &&
    props.initial.custom_form_field &&
    props.initial.custom_form_field.length === 0
  ) {
    return (
      <div className={classes.emptyContainer}>
        <div className={classes.column}>
          <InfoIcon className={classes.leftIcon} />
          <Typography variant="caption" align="center">
            {t('customForm.emptyCustomForm')}
          </Typography>
        </div>
      </div>
    );
  }
  return (
    <Paper className={classes.paperContainer}>
      <Form>
        <ConsumerFormFields {...props} />
        {!asManager && (
          <div className={classes.submit}>
            <Submit id="button_custom_form_save" disabled={isSubmitting}>
              {t('customForm.send')}
            </Submit>
          </div>
        )}
      </Form>
    </Paper>
  );
}

const styles = (theme: Theme) => ({
  paperContainer: {
    padding: theme.spacing(6),
  },
  submit: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  emptyContainer: {
    padding: theme.spacing(10),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
  ConsumerFormFieldsHOC,
)(ConsumerFormView);
