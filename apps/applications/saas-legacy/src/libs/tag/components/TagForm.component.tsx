import React from 'react';
import { compose } from 'recompose';
import { withFormik, Form, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, withTheme } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';

import type { Tag, TagGroupAPI } from '#src/libs/tag/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import {
  TextField,
  Actions,
  Submit,
  ColorField,
  IconField,
  // @ts-expect-error
} from '#src/components/forms';

import { MaterialStyleType } from '../../../utils/types';
import type { OptionCallback } from '../../../state/types';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Tag,
);
type OwnProps = {
  onCancel: () => void;
  initial: Tag<TagGroupAPI>;
} & FormikProps<FormValues>;

type FormProps = {
  initial: Tag<TagGroupAPI>;
  theme: Theme;
  onCancel: () => void;
  onSubmit: (data: FormValues, option: OptionCallback) => void;
};

type FormValues = {
  color: string;
  name: string;
  icon: string;
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

export const TagForm: React.FC<Props> = ({
  classes,
  isSubmitting,
  onCancel,
  initial,
  dirty,
}) => {
  React.useEffect(() => {
    trackFormAdd(initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { t } = useTranslation('tag');
  const handleOnClickCancel = React.useCallback(() => {
    trackFormCancel(initial?.id);
    onCancel();
  }, [initial?.id, onCancel]);
  const handleOnClickSubmit = React.useCallback(() => {
    trackFormSubmitIntent(initial?.id);
  }, [initial?.id]);
  const disableSubmitButton = isSubmitting || !dirty;

  return (
    <Form>
      <TextField
        fullWidth
        required
        label={t('form.tag.name')}
        name="name"
        variant="outlined"
      />
      <Grid container className={classes.gridContainer} spacing={2}>
        <Grid item xs={6}>
          <ColorField
            defaultCompanyThemeColor
            label={t('form.tag.color')}
            name="color"
          />
        </Grid>
        <Grid item xs={6}>
          <IconField name="icon" />
        </Grid>
      </Grid>
      <div className={classes.infoContainer}>
        <InfoOutlinedIcon className={classes.iconLeft} />
        <Typography>{t('form.tag.info')}</Typography>
      </div>
      <Actions>
        <Button
          color="secondary"
          disabled={isSubmitting}
          onClick={handleOnClickCancel}
        >
          {t('form.tag.delete.cancel')}
        </Button>
        <Submit disabled={disableSubmitButton} onClick={handleOnClickSubmit}>
          {t('form.tag.submit')}
        </Submit>
      </Actions>
    </Form>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    gridContainer: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#E8E8E8',
      padding: theme.spacing(2),
      borderRadius: 8,
      border: '1px solid #DEDEDE',
    },
    iconLeft: {
      alignSelf: 'center',
      marginRight: theme.spacing(2),
    },
  });

export default compose<any, Props>(
  withStyles(styles),
  withTheme,
  withFormik<FormProps, FormValues>({
    enableReinitialize: true,
    mapPropsToValues: ({ initial, theme }) =>
      initial
        ? {
            ...initial,
            color:
              initial.color === '' ? theme.palette.primary.main : initial.color,
          }
        : {
            name: '',
            color: theme.palette.primary.main,
            icon: '',
          },
    handleSubmit: (
      values,
      { props: { onSubmit, onCancel, initial }, setSubmitting },
    ) => {
      const data = {
        ...values,
      };
      onSubmit(data, {
        onSuccess: () => {
          setSubmitting(false);
          trackFormSuccess(initial?.id);
          onCancel();
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
  React.memo,
)(TagForm);
