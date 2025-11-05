import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Form } from 'formik';
import Button from '@material-ui/core/Button';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
// @ts-expect-error Import Component from JS file
import { Submit } from '#src/components/forms';

import ConsumerGiftcardPreview from '../ConsumerGiftcardPreview.component';

import { ConsumerGiftcardForm } from './ConsumerGiftcardForm.component';
import { ConsumerGiftcardFormHOC } from './ConsumerGiftcardFormHOC';
import type { ConsumerGiftcardFormWithPreviewProps } from './types';
import { GIFTCARD_TYPES } from '../../constants';

const ConsumerGiftcardFormWithPreview = React.memo(
  (props: ConsumerGiftcardFormWithPreviewProps) => {
    const { t } = useTranslation(['giftcard']);
    const classes = useStyles();
    const { values, forceVertical } = props;

    const isHorizontal = !forceVertical;

    const previewContent = (
      <ConsumerGiftcardPreview
        companyCover={props.companyCover}
        consumerGiftcard={{
          name: values.name,
          message_is_from: values.message_is_from,
          message_is_for: values.message_is_for,
          message_content: values.message_content,
          background_image: values.background_image,
          price:
            props.giftcard?.card_type === GIFTCARD_TYPES.CUSTOM
              ? values.price
              : null,
        }}
        giftcard={props.giftcard}
      />
    );

    const formContent = (
      <Paper className={classes.formContainer}>
        <ConsumerGiftcardForm {...props} />
        <div className={classes.actions}>
          {props.onCancel && (
            <Button onClick={props.onCancel}>
              {t('consumerGiftcard.form.actions.cancel')}
            </Button>
          )}
          <Submit style={props.consumerVariant ? { width: '100%' } : null}>
            {props.consumerVariant && (
              <AddShoppingCartIcon className={classes.iconLeft} />
            )}
            {t('consumerGiftcard.form.actions.submit')}
          </Submit>
        </div>
      </Paper>
    );

    return (
      <Form className={classes.container}>
        {isHorizontal ? (
          <Grid container>
            <Grid
              item
              className={classes.previewContainer}
              md={4}
              sm={12}
              xs={12}
            >
              {previewContent}
            </Grid>
            <Grid
              item
              className={classes.innerContainer}
              md={8}
              sm={12}
              xs={12}
            >
              {formContent}
            </Grid>
          </Grid>
        ) : (
          <div className={classes.verticalContainer}>
            <div className={classes.center}>{previewContent}</div>
            <div>{formContent}</div>
          </div>
        )}
      </Form>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  previewContainer: {
    padding: theme.spacing(1.5),
  },
  innerContainer: {
    width: '100%',
    padding: theme.spacing(1.5),
  },
  formContainer: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(2),
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  multilineInput: {
    marginTop: theme.spacing(4),
  },
  description: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  verticalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    '&>*': {
      marginBottom: theme.spacing(2),
      width: '100%',
    },
    width: '100%',
  },
}));

export default ConsumerGiftcardFormHOC(ConsumerGiftcardFormWithPreview);
