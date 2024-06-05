import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { Form, FormikProps, withFormik } from 'formik';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import * as Yup from 'yup';

import OfferListItemV2 from '#src/libs/offer/components/OfferListItemV2.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type { OfferDataListItem } from '#src/libs/offer/types';

type FormikValues = { offersChecked: number[] };

const RecurrenceRuleOfferFormDialogSchema = Yup.object({
  offersChecked: Yup.array().of(Yup.number()),
});

type OwnProps = {
  allOfferIds: number[];
  loading: boolean;
  offers: OfferDataListItem[];
  open: boolean;
};

type Props = OwnProps & FormikProps<FormikValues>;

type FormikHOCProps = {
  onSubmit: (offerIds: number[]) => void;
};

const RecurrenceRuleOfferFormDialog: React.FC<Props> = ({
  allOfferIds,
  handleSubmit,
  loading,
  offers,
  open,
  setFieldValue,
  values,
}) => {
  const { t } = useTranslation('booking');
  const classes = useStyles();

  const isSelectAllChecked = React.useMemo(
    () => values.offersChecked.length === allOfferIds.length,
    [allOfferIds, values.offersChecked],
  );

  const handleSelectAll = React.useCallback(
    () =>
      isSelectAllChecked
        ? setFieldValue('offersChecked', [])
        : setFieldValue('offersChecked', allOfferIds),
    [isSelectAllChecked, allOfferIds, setFieldValue],
  );

  const handleChange = React.useCallback(
    (offerId: number) => () =>
      setFieldValue(
        'offersChecked',
        values.offersChecked.includes(offerId)
          ? values.offersChecked.filter((id) => id !== offerId)
          : [...values.offersChecked, offerId],
      ),
    [values.offersChecked, setFieldValue],
  );

  const handleClick = React.useCallback(
    (offerId: number) =>
      setFieldValue(
        'offersChecked',
        values.offersChecked.includes(offerId)
          ? values.offersChecked.filter((id) => id !== offerId)
          : [...values.offersChecked, offerId],
      ),
    [values.offersChecked, setFieldValue],
  );

  return (
    <GenericResponsiveDialog
      open={open}
      PaperProps={{ classes: { root: classes.paper } }}
    >
      <DialogTitle>{t('recurrenceRule.form.title')}</DialogTitle>
      <Form onSubmit={handleSubmit}>
        <DialogContent className={classes.content}>
          <Typography variant="body2">
            {t('recurrenceRule.offerForm.helperText')}
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSelectAllChecked}
                  indeterminate={
                    values.offersChecked.length > 0 && !isSelectAllChecked
                  }
                />
              }
              disabled={loading}
              label={
                isSelectAllChecked
                  ? t('recurrenceRule.offerForm.unselectAll')
                  : t('recurrenceRule.offerForm.selectAll')
              }
              onChange={handleSelectAll}
            />
            <Divider />
            {(offers ?? []).map((offer) => (
              <OfferListItemV2
                key={offer.id}
                similarOffer
                checked={values.offersChecked.includes(offer.id)}
                handleChange={handleChange(offer.id)}
                offer={offer}
                onClick={handleClick}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} type="submit">
            {t('recurrenceRule.actions.save')}
          </Button>
        </DialogActions>
      </Form>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  content: { display: 'flex', flexDirection: 'column', gap: theme.spacing(4) },
  paper: { maxWidth: '600px' },
}));

const formikFormWrapper = withFormik<OwnProps & FormikHOCProps, FormikValues>({
  mapPropsToValues: () => {
    return {
      offersChecked: [],
    };
  },
  handleSubmit: (values, { props: { onSubmit } }) => {
    onSubmit(values.offersChecked);
  },
  validationSchema: RecurrenceRuleOfferFormDialogSchema,
});

export default React.memo(formikFormWrapper(RecurrenceRuleOfferFormDialog));
