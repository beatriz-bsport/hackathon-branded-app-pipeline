import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Form } from 'formik';
import Button from '@material-ui/core/Button';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
import { Submit } from '../../../components/forms';
import { Giftcard, ConsumerGiftcardPersonnalizationElements } from '../types';
import ConsumerGiftcardPreview from './ConsumerGiftcardPreview.component';

import ConsumerGiftcardForm, {
  ConsumerGiftcardFormFieldHOC,
} from './ConsumerGiftcardForm.component';

type Props = {
  giftcard: Giftcard;
  onCancel: () => void;
  companyCover: string;
  variant: 'consumer' | null;
  values: ConsumerGiftcardPersonnalizationElements;
  forceVertical?: boolean;
  giftcardBackgroundImageList: Array<String>;
  isManager: boolean;
  timezone: string;
};

const GridWrapper = {
  true: (p: any) => <Grid container>{p.children}</Grid>,
  false: (p: any) => <div {...p} />,
};
const GridFirstChildWrapper = {
  true: (p: any) => <Grid item xs={12} sm={12} md={4} {...p} />,
  false: (p: any) => <div>{p.children}</div>,
};

const GridSecondChildWrapper = {
  true: (p: any) => <Grid item xs={12} sm={12} md={8} {...p} />,
  false: (p: any) => <div>{p.children}</div>,
};

const ConsumerGiftcardFormWithPreview = React.memo((props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  const { values } = props;

  const C = GridWrapper[!props.forceVertical];
  const D1 = GridFirstChildWrapper[!props.forceVertical];
  const D2 = GridSecondChildWrapper[!props.forceVertical];
  return (
    <Form className={classes.container}>
      <C className={classes.verticalContainer}>
        <D1 className={classes.previewContainer}>
          <ConsumerGiftcardPreview
            companyCover={props.companyCover}
            consumerGiftcard={{
              name: values.name,
              message_is_from: values.message_is_from,
              message_is_for: values.message_is_for,
              message_content: values.message_content,
              background_image: values.background_image,
            }}
            giftcard={props.giftcard}
          />
        </D1>
        <D2 className={classes.innerContainer}>
          <Paper className={classes.formContainer}>
            <ConsumerGiftcardForm {...props} />
            <div className={classes.actions}>
              {props.onCancel && (
                <Button onClick={props.onCancel}>
                  {t('consumerGiftcard.form.actions.cancel')}
                </Button>
              )}
              <Submit
                style={props.variant === 'consumer' ? { width: '100%' } : null}
              >
                {props.variant === 'consumer' && (
                  <AddShoppingCartIcon className={classes.iconLeft} />
                )}
                {t('consumerGiftcard.form.actions.submit')}
              </Submit>
            </div>
          </Paper>
        </D2>
      </C>
    </Form>
  );
});

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
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
    },
    width: '100%',
  },
}));

export default ConsumerGiftcardFormFieldHOC(ConsumerGiftcardFormWithPreview);
