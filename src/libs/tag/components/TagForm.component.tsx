import React from 'react';
import { compose } from 'recompose';

import { withFormik, Form } from 'formik';

import { withTranslation, WithTranslation } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, withTheme } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import {
  TextField,
  Actions,
  Submit,
  ColorField,
  IconField,
} from '../../../components/forms';
import { MaterialStyleType } from '../../../utils/types';
import { Tag, TagGroupAPI } from '../types';

type OwnProps = {
  isSubmitting: boolean;
  onCancel: () => void;
};

type FormProps = {
  initial: Tag<TagGroupAPI>;
  theme: Theme;
  onCancel: () => void;
  onSubmit: (data: FormValues, option: Options) => void;
};

type Options = {
  onSuccess: () => void;
  onError: () => void;
};

type FormValues = {
  color: string;
  name: string;
  icon: string;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export function TagForm(props: Props) {
  const { classes, t, isSubmitting, onCancel } = props;
  return (
    <Form>
      <TextField
        name="name"
        label={t('form.tag.name')}
        required
        fullWidth
        variant="outlined"
      />
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs={6}>
          <ColorField
            label={t('form.tag.color')}
            name="color"
            defaultCompanyThemeColor
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
        <Button color="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t('form.tag.delete.cancel')}
        </Button>
        <Submit disabled={isSubmitting}>{t('form.tag.submit')}</Submit>
      </Actions>
    </Form>
  );
}

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
  withTranslation('tag'),
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
      { props: { onSubmit, onCancel }, setSubmitting },
    ) => {
      const data = {
        ...values,
      };
      onSubmit(data, {
        onSuccess: () => {
          setSubmitting(false);
          onCancel();
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(TagForm);
