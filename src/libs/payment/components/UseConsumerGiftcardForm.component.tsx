// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, FormikProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { INVOICE_TYPE_REGULAR } from '@bsport/common/lib/master-data/invoice-type';

import Radio from '@material-ui/core/Radio';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import type { OptionCallback } from '../../../state/types';
import { PriceField } from '../../../components/forms';
import type { ConsumerGiftcard, Giftcard } from '#libs/giftcard/types';
import type { Invoice } from '#libs/invoice/types';
import type { Member } from '#libs/member/types';
import ConsumerGiftcardListItem from '#libs/giftcard/components/ConsumerGiftcardListItem.component';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type OwnProps = {
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>;
  invoice: Invoice<Member>;
  outlinedIconVariant?: boolean;
  disabled?: boolean;
};

type Props = OwnProps &
  FormikProps<{
    amount: number;
    invoice_amount_due: number;
    giftcard_selected: number;
    giftcard_available_amount: number;
  }>;
const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .nullable(false)
    .test(
      'Test Amount Lesser than Credits',
      'invoice:applyGiftcard.form.errors.errorAmount',
      function CheckAmout(item) {
        return (
          this.parent.invoice_amount_due >= item &&
          item > 0 &&
          this.parent.giftcard_available_amount >= item
        );
      },
    ),
  invoice_amount_due: Yup.number().nullable(false),
  giftcard_selected: Yup.number().nullable(false),
  giftcard_available_amount: Yup.number().nullable(false),
});
export const UseConsumerGiftcardForm: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [editablePrice, setEditablePrice] = React.useState<boolean>(false);
  const { t } = useTranslation('invoice');
  const classes = useStyles();
  const initializeavailableAmount = () => {
    const cgc = props.consumerGiftcardList[0];
    const availableAmout = parseFloat(
      (
        parseFloat(cgc.giftcard?.price) - parseFloat(cgc.consumed_amount_gifted)
      ).toFixed(2),
    );
    return availableAmout;
  };
  const initializeAmount = () => {
    const availableAmout = initializeavailableAmount();
    const invoice_amount_due =
      (props.invoice?.amount_due_cts - props.invoice?.amount_paid_cts) / 100;
    if (invoice_amount_due > availableAmout) {
      return availableAmout;
    }
    return invoice_amount_due;
  };
  const ButtonStyled = (outlinedIconVariant?: boolean) => {
    if (outlinedIconVariant) {
      return (
        <Button
          onClick={() => setOpen(true)}
          variant="outlined"
          color="secondary"
          disabled={props.disabled}
        >
          <CardGiftcardIcon className={classes.leftIcon} />
          {t('applyGiftcard.giftcard')}
        </Button>
      );
    }
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="secondary"
        disabled={props.disabled}
      >
        {t('applyGiftcard.actions.apply')}
      </Button>
    );
  };
  return (
    <>
      {props.applyGiftcardOnInvoice &&
        props.consumerGiftcardList?.length !== 0 &&
        props.invoice.invoice_type === INVOICE_TYPE_REGULAR &&
        !props.invoice.plannedinvoice &&
        ButtonStyled(props.outlinedIconVariant)}
      {props.applyGiftcardOnInvoice && open && (
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            amount: initializeAmount(),
            invoice_amount_due:
              (props.invoice?.amount_due_cts - props.invoice?.amount_paid_cts) /
              100,
            giftcard_selected: props.consumerGiftcardList[0]?.id,
            giftcard_available_amount: initializeavailableAmount(),
          }}
          onSubmit={(values, actions) => {
            return props.applyGiftcardOnInvoice(
              props.invoice.uuid,
              values.giftcard_selected,
              values.amount,
              {
                onSuccess: () => {
                  setOpen(false);
                  actions.setSubmitting(false);
                },
                onError: () => {
                  actions.setSubmitting(false);
                },
              },
            );
          }}
        >
          {({
            setFieldValue,
            values,
            isSubmitting,
            handleSubmit,
            validateField,
            setFieldTouched,
            touched,
            errors,
          }) => {
            const handleSelection = (cgc: ConsumerGiftcard) => {
              if (values.giftcard_selected === cgc.id) {
                return;
              }
              setFieldValue('giftcard_selected', cgc.id);
              const availableAmout = parseFloat(
                (
                  parseFloat(cgc.giftcard?.price) -
                  parseFloat(cgc.consumed_amount_gifted)
                ).toFixed(2),
              );
              setFieldValue('giftcard_available_amount', availableAmout);
              if (values.invoice_amount_due > availableAmout) {
                setFieldValue('amount', availableAmout);
              } else {
                setFieldValue('amount', values.invoice_amount_due);
              }
            };
            return (
              <Form>
                <Dialog open={open} fullWidth maxWidth="md">
                  <div className={classes.dialogContent}>
                    <div className={classes.header}>
                      <Typography variant="h6">
                        {t('applyGiftcard.form.amountToPay')}
                      </Typography>
                    </div>
                    <div className={classes.greyContainer}>
                      {editablePrice ? (
                        <>
                          <PriceField name="amount" />
                          <IconButton
                            onClick={async () => {
                              await setFieldTouched('amount');
                              await validateField('amount');
                              if (touched.amount && errors.amount) {
                                return;
                              }
                              setEditablePrice(false);
                            }}
                            color="primary"
                          >
                            <SaveIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6">
                            {getCurrencyDisplayWithPrice(values.amount)}
                          </Typography>
                          <IconButton
                            onClick={() => setEditablePrice(true)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                    <ErrorMessage name="amount">
                      {(error_msg) => (
                        <Typography variant="caption" color="error">
                          {t(`${error_msg}`)}
                        </Typography>
                      )}
                    </ErrorMessage>
                    <div className={classes.header2}>
                      <Typography variant="h6">
                        {t('applyGiftcard.form.usedGiftcard')}
                      </Typography>
                    </div>
                    {props.consumerGiftcardList?.map((cgc) => (
                      <div
                        className={
                          values.giftcard_selected === cgc.id
                            ? classes.selectedGiftCard
                            : ''
                        }
                      >
                        <div className={classes.radioRow}>
                          <Radio
                            checked={values.giftcard_selected === cgc.id}
                            onClick={() => handleSelection(cgc)}
                            className={classes.radio}
                          />
                          <ConsumerGiftcardListItem
                            key={cgc.id}
                            consumerGiftcard={cgc}
                            giftcard={cgc.giftcard}
                            showAsRecipient
                            showSender
                            memberReceiver={props.invoice.member}
                            memberSender={cgc.src_member}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogActions className={classes.actions}>
                    <Button
                      disabled={props.disabled || isSubmitting}
                      variant="text"
                      onClick={() => setOpen(false)}
                    >
                      {t('applyGiftcard.actions.cancel')}
                    </Button>
                    <Button
                      disabled={props.disabled || isSubmitting}
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmit()}
                    >
                      {t('applyGiftcard.actions.confirm')}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing(2),
  },
  header2: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  dialogContent: {
    padding: theme.spacing(2),
  },

  outterButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  greyContainer: {
    backgroundColor: grey[100],
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  selectedGiftCard: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: grey[100],
  },
  radioRow: {
    display: 'flex',
    alignItems: 'center',
  },
  radio: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  actions: {
    paddingRight: theme.spacing(2),
  },
}));
export default UseConsumerGiftcardForm;
