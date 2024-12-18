import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, FormikProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';

import Radio from '@material-ui/core/Radio';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import { ListItemText, TextField } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import type { ConsumerGiftcard, Giftcard } from '#src/libs/giftcard/types';
import type { Invoice } from '#src/libs/invoice/types';
import type { Member } from '#src/libs/member/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
// @ts-expect-error
import { PriceField } from '../../../components/forms';
import type { OptionCallback } from '../../../state/types';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { formatAsDate } from '#src/utils/datetime';
import { Add as AddIcon } from '@material-ui/icons';
import { getAttributeByPrintableCodeLoading } from '#src/libs/giftcard/selectors';
import { RootState } from '#src/reducers';

type OwnProps = {
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
  handleAttributeByPrintableCode: (
    code: string,
    options?: OptionCallback<ConsumerGiftcard>,
  ) => void;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>;
  invoice: Invoice<Member>;
  outlinedIconVariant?: boolean;
  disabled?: boolean;
};

type FormikValues = {
  amount: number;
  invoice_amount_due: number;
  giftcard_selected: number;
  giftcard_available_amount: number;
  new_giftcard_code: string;
};

type Props = OwnProps & FormikProps<FormikValues>;
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
  const [showAddGiftcardForm, setShowAddGiftcardForm] =
    React.useState<boolean>(false);
  const [addGiftcardError, setAddGiftcardError] = React.useState<Error | null>(
    null,
  );
  const isLoading = useSelector((state: RootState) =>
    getAttributeByPrintableCodeLoading(state),
  );
  const { t } = useTranslation(['invoice', 'common']);
  const classes = useStyles();
  const initializeavailableAmount = () => {
    const cgc = props.consumerGiftcardList[0];
    const availableAmout = parseFloat(
      (
        parseFloat(cgc?.price_bought ?? '0') -
        parseFloat(cgc?.consumed_amount_gifted ?? '0')
      ).toFixed(2),
    );
    return availableAmout;
  };
  const isShowAddGiftcardForm =
    (props.consumerGiftcardList ?? []).length === 0 || showAddGiftcardForm;
  /** contains at least one available gift card for payment */
  const hasAvailableGiftcard = (props.consumerGiftcardList ?? []).length > 0;
  const initializeAmount = () => {
    const availableAmout = initializeavailableAmount();
    const invoice_amount_due =
      (props.invoice?.amount_due_cts - props.invoice?.amount_paid_cts) / 100;
    if (invoice_amount_due > availableAmout) {
      return availableAmout;
    }
    return invoice_amount_due;
  };
  const getGiftcardExpirationDate = useCallback(
    (expirationDate: string) => formatAsDate(expirationDate),
    [],
  );
  const handleCancel = useCallback(() => {
    setOpen(false);
    setShowAddGiftcardForm(false);
    setAddGiftcardError(null);
  }, []);
  const handleShowAddGiftcardForm = useCallback(
    () => setShowAddGiftcardForm(true),
    [],
  );

  const ButtonStyled = (outlinedIconVariant?: boolean) => {
    if (outlinedIconVariant) {
      return (
        <Button
          color="secondary"
          disabled={props.disabled}
          onClick={() => setOpen(true)}
          variant="outlined"
        >
          <CardGiftcardIcon className={classes.leftIcon} />
          {t('applyGiftcard.giftcard')}
        </Button>
      );
    }
    return (
      <Button
        color="secondary"
        disabled={props.disabled}
        onClick={() => setOpen(true)}
        variant="contained"
      >
        {t('applyGiftcard.actions.apply')}
      </Button>
    );
  };
  return (
    <>
      {ButtonStyled(props.outlinedIconVariant)}
      {props.applyGiftcardOnInvoice && open && (
        <Formik<FormikValues>
          enableReinitialize
          initialValues={{
            amount: initializeAmount(),
            invoice_amount_due:
              (props.invoice?.amount_due_cts - props.invoice?.amount_paid_cts) /
              100,
            giftcard_selected: props.consumerGiftcardList[0]?.id,
            giftcard_available_amount: initializeavailableAmount(),
            new_giftcard_code: '',
          }}
          onSubmit={(values, actions) => {
            return props.applyGiftcardOnInvoice(
              props.invoice.uuid,
              values.giftcard_selected,
              values.amount,
              {
                onSuccess: () => {
                  setShowAddGiftcardForm(false);
                  setOpen(false);
                  actions.setSubmitting(false);
                },
                onError: () => {
                  actions.setSubmitting(false);
                },
              },
            );
          }}
          validationSchema={validationSchema}
        >
          {({
            setFieldValue,
            values,
            isSubmitting,
            handleSubmit,
            handleChange,
          }) => {
            const handleSelection = (cgc: ConsumerGiftcard) => {
              if (values.giftcard_selected === cgc?.id) {
                return;
              }
              setFieldValue('giftcard_selected', cgc?.id);
              const availableAmout = parseFloat(
                (
                  parseFloat(cgc?.price_bought ?? '0') -
                  parseFloat(cgc?.consumed_amount_gifted ?? '0')
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
                <GenericResponsiveDialog maxWidth="sm" open={open}>
                  {isSubmitting && <LinearProgress color="primary" />}
                  <div className={classes.dialogContent}>
                    <div className={classes.header}>
                      <Typography variant="h6">
                        {t('applyGiftcard.form.title')}
                      </Typography>
                    </div>
                    {hasAvailableGiftcard && (
                      <div className={classes.fullWidth}>
                        <PriceField
                          className={classes.fullWidth}
                          label={t('applyGiftcard.form.giftcardCode')}
                          name="amount"
                        />
                      </div>
                    )}
                    {hasAvailableGiftcard && (
                      <ErrorMessage name="amount">
                        {(error_msg) => (
                          <Typography color="error" variant="caption">
                            {t(`${error_msg}`)}
                          </Typography>
                        )}
                      </ErrorMessage>
                    )}
                    {hasAvailableGiftcard && (
                      <div className={classes.header2}>
                        <Typography variant="subtitle1">
                          {t('applyGiftcard.form.availableGiftcards')}
                        </Typography>
                      </div>
                    )}
                    {hasAvailableGiftcard &&
                      props.consumerGiftcardList?.map((cgc) => (
                        <div
                          key={cgc?.id}
                          className={
                            values.giftcard_selected === cgc?.id
                              ? classes.selectedGiftCard
                              : classes.giftcardContainer
                          }
                        >
                          <ButtonBase
                            // @ts-expect-error
                            onClick={() => handleSelection(cgc)}
                            style={{ width: '100%' }}
                          >
                            <div className={classes.radioRow}>
                              <Radio
                                checked={values.giftcard_selected === cgc?.id}
                                className={classes.radio}
                                // @ts-expect-error
                                onClick={() => handleSelection(cgc)}
                              />
                              <ListItemText
                                className={classes.alignTextLeft}
                                primary={cgc?.name}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      color="primary"
                                      component="span"
                                      variant="body2"
                                    >
                                      {`${getCurrencyDisplayWithPrice(
                                        parseFloat(cgc?.price_bought ?? '0') -
                                          parseFloat(
                                            cgc?.consumed_amount_gifted ?? '0',
                                          ),
                                      )}/${getCurrencyDisplayWithPrice(
                                        parseFloat(cgc?.price_bought ?? '0'),
                                      )}`}
                                    </Typography>
                                    {!!cgc?.expiration_date &&
                                      ` - ${t('applyGiftcard.form.expiresOn', {
                                        date: getGiftcardExpirationDate(
                                          cgc?.expiration_date,
                                        ),
                                      })}`}
                                  </React.Fragment>
                                }
                              />
                            </div>
                          </ButtonBase>
                        </div>
                      ))}
                    {!isShowAddGiftcardForm && (
                      <Button
                        color="primary"
                        onClick={handleShowAddGiftcardForm}
                        startIcon={<AddIcon />}
                      >
                        {t('invoice:applyGiftcard.form.addGiftcard')}
                      </Button>
                    )}
                    {isShowAddGiftcardForm &&
                      !!props.handleAttributeByPrintableCode && (
                        <div className={classes.addGiftcardContainer}>
                          <TextField
                            fullWidth
                            disabled={isLoading}
                            error={!!addGiftcardError}
                            helperText={
                              !!addGiftcardError &&
                              t('invoice:applyGiftcard.form.addGiftcardError')
                            }
                            label={t('invoice:applyGiftcard.form.giftcardCode')}
                            name="new_giftcard_code"
                            onChange={handleChange}
                            value={values.new_giftcard_code}
                          />
                          <Button
                            color="primary"
                            disabled={!values.new_giftcard_code || isLoading}
                            onClick={() => {
                              setAddGiftcardError(null);
                              props.handleAttributeByPrintableCode(
                                values.new_giftcard_code,
                                {
                                  onSuccess: () => {
                                    setShowAddGiftcardForm(false);
                                    setFieldValue('new_giftcard_code', '');
                                  },
                                  onError: (error) => {
                                    setAddGiftcardError(error);
                                  },
                                },
                              );
                            }}
                            variant="outlined"
                          >
                            {t('common:add')}
                          </Button>
                        </div>
                      )}
                  </div>

                  <DialogActions className={classes.actions}>
                    <Button
                      disabled={props.disabled || isSubmitting}
                      onClick={handleCancel}
                      variant="text"
                    >
                      {t('applyGiftcard.actions.cancel')}
                    </Button>
                    <Button
                      color="primary"
                      disabled={
                        props.disabled ||
                        isSubmitting ||
                        !values.giftcard_selected ||
                        isLoading
                      }
                      onClick={() => handleSubmit()}
                      variant="text"
                    >
                      {t('applyGiftcard.actions.confirm')}
                    </Button>
                  </DialogActions>
                </GenericResponsiveDialog>
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
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: grey[100],
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  giftcardContainer: {
    border: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing(1),
  },
  radioRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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
  addGiftcardContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'baseline',
    paddingTop: theme.spacing(1),
  },
  addGiftcardField: { flex: 1 },
  addGiftcardButton: {
    height: 'fit-content',
  },
  alignTextLeft: {
    textAlign: 'left',
  },
  fullWidth: {
    width: '100%',
  },
}));
export default UseConsumerGiftcardForm;
