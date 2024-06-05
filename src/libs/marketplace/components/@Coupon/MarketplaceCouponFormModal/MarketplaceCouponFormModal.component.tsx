import React, { useCallback, useState } from 'react';

import { Formik, Form, Field, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import CircularProgress from '#components/css-only/CircularProgress';
import { MARKETPLACE_COUPON_FORM_ERRORS as COUPON_FORM_ERRORS } from '#libs/marketplace/constants';
import Button, { ButtonType } from '#components/css-only/Fabrique/Button';
import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';

import { OptionCallback } from '../../../../../state/types';

import './styles.css';

type CouponFormValues = {
  code: string;
};

export type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (
    formCouponCode: string,
    options: OptionCallback & {
      onNotFound: () => void;
    },
  ) => Promise<void>;
};

const MarketplaceCouponFormModal: React.FC<Props> = ({
  isOpen,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation(['common', 'coupon']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(COUPON_FORM_ERRORS.EMPTY);

  const initialValues: CouponFormValues = { code: '' };

  const { dialogRef, modalRef } = useDialogClickAwayListener({
    onDialogClose: onCancel,
  });

  const handleOnCancel = useCallback(() => {
    setIsLoading(false);
    setError(COUPON_FORM_ERRORS.EMPTY);
    onCancel();
  }, [onCancel]);

  const handleOnSubmit = useCallback(
    (
      values: CouponFormValues,
      formikHelpers: FormikHelpers<CouponFormValues>,
    ) => {
      setIsLoading(true);
      onSubmit(values.code, {
        onSuccess: () => {
          setIsLoading(false);
          setError(COUPON_FORM_ERRORS.EMPTY);
          formikHelpers.setFieldValue('code', '');
        },
        onError: () => {
          setIsLoading(false);
          setError(COUPON_FORM_ERRORS.COUPON_NOT_APPLICABLE);
        },
        onNotFound: () => {
          setIsLoading(false);
          setError(COUPON_FORM_ERRORS.COUPON_NOT_FOUND);
        },
      });
    },
    [onSubmit],
  );

  return (
    <>
      {isOpen && (
        <div ref={dialogRef} className="bs-coupon-form__backdrop">
          <div ref={modalRef} className="bs-coupon-form__dialog">
            <Formik initialValues={initialValues} onSubmit={handleOnSubmit}>
              <Form className="bs-coupon-form__container">
                <Field
                  className="bs-coupon-form__field"
                  id="code"
                  name="code"
                  placeholder="Promotional code"
                />

                {error && (
                  <span className="bs-coupon-form__error">
                    {t(`coupon:code.addCoupon.${error}`)}
                  </span>
                )}

                <div className="bs-coupon-form__actions">
                  <Button
                    classes={{ root: 'bs-coupon-form__button' }}
                    onClick={handleOnCancel}
                  >
                    {t('common:cancel')}
                  </Button>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      classes={{
                        root: 'bs-coupon-form__button bs-coupon-form__submit',
                      }}
                      type={ButtonType.SUBMIT}
                    >
                      {t('common:saveRecord')}
                    </Button>
                  )}
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export const MarketplaceCouponFormModalForStorybook = marketplaceCssHoc()(
  MarketplaceCouponFormModal,
);

export default MarketplaceCouponFormModal;
