// @flow
import React, { useState } from 'react';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import DialogContentText from '@material-ui/core/DialogContentText';
import Alert from '@material-ui/lab/Alert';

import TextField from '@material-ui/core/TextField';
import PriceInput from '../../../../components/input/PriceInput.component';
import PercentInput from '../../../../components/input/PercentInput.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import ConsumerPackRowItem from '../../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import ObjectLevelPermissionWrapper from '../../../role/permission-utils/ObjectLevelPermissionWrapper.component';
import ObjectLevelPermissionProvider from '../../../role/permission-utils/ObjectLevelPermissionProvider.component';

import type { PaymentPack } from '../../../payment-packs/types';
import {
  MaxoutBooking,
  ConsumerPaymentPack,
} from '../../../consumer-payment-pack/types';
import type { Offer } from '../../../offer/types';
import EstablishmentBillingGroupSelector from '../../../establishment/components/EstablishmentBillingGroupSelector';
import ModalConfirm from '../../../../components/ModalConfirm.component';
import { paymentPackTagsAndMemberTagsCompatibilty } from '../../../payment-packs/utils';
import type { Member } from '../../../member/types';
import type { WithIsSharedActive } from '../../../relationship/types';
import type { EstablishmentBillingGroup } from '../../../establishment/types';

type Props = {
  consumerPacks: Array<ConsumerPaymentPack>,
  consumerPacksNonCompatible: Array<WithIsSharedActive<ConsumerPaymentPack>>,
  compatiblePacks: Array<PaymentPack>,
  consumerPacksOrMaxoutLoading: boolean,
  registerToOffer: (
    offer: {
      consumerPaymentPack?: WithIsSharedActive<ConsumerPaymentPack>,
      paymentPack?: PaymentPack,
    },
    voucher?: number,
    voucherReason?: string,
  ) => void,
  onBookMultiple: (bookings: {
    consumerPaymentPack?: ConsumerPaymentPack,
    paymentPack?: PaymentPack,
  }) => void,
  offer?: Offer,
  cppMaxoutBookingsByCpp?: { [cpp_id: string]: MaxoutBooking },
  disableMultiBooking?: boolean,
  establishmentBillingGroups: EstablishmentBillingGroup[],
  establishmentLoading: boolean,
  enableMultiLocalization: boolean,
  member: Member,
  memberDetails: { [id: number]: Member },
  closeDialog: () => void,
  isNotAllowedToOverbook?: Boolean,
  isCustomDiscountReasonRequired: boolean,
  staffDefaultEstablishmentBillingGroup: EstablishmentBillingGroup | null,

  fetchIncompatibilitiesReasonsByOfferByConsumerPack: (
    cpp_id: number,
    offer_id: number,
    options: OptionCallback,
  ) => void,
  incompatibilitiesReasons: { [cpp_id: number]: number[] },
  goToPaymentPack: (pp_id: number) => void,
  handleFetchNoncompatibleConsumerPackByOfferByMember: () => void,
  nonCompatibleByOfferByMemberLoading: boolean,
  containerHasFetchedNonCompatiblePasses: Boolean,
};

const BookingModuleRegisterMethodChoice = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    handleFetchNoncompatibleConsumerPackByOfferByMember,
    nonCompatibleByOfferByMemberLoading,
    containerHasFetchedNonCompatiblePasses,
  } = props;

  const [voucher, setVoucher] = useState('0,00');
  const [voucherPercentage, setVoucherPercentage] = useState(0.0);
  const [voucherReason, setVoucherReason] = useState<string | null>(null);
  const [voucherReasonErrors, setVoucherReasonErrors] = useState(false);
  const [finalPricePreview, setFinalPricePreview] = useState('0,00');

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);

  const [openNonCompatibleConsumerPass, setOpenNonCompatibleConsumerPass] =
    useState(false);

  const [
    openBuyableCompatiblePassesCollapse,
    setOpenBuyableCompatiblePassesCollapse,
  ] = React.useState(false);
  const [hasFetchedNonCompatiblePasses, setHasFetchedNonCompatiblePasses] =
    React.useState(false);

  const [selectedPack, setSelectedPack] = useState<PaymentPack | null>(null);

  const [
    selectedEstablishmentBillingGroup,
    setSelectedEstablishmentBillingGroup,
  ] = useState<EstablishmentBillingGroup | null>(
    props.staffDefaultEstablishmentBillingGroup || null,
  );

  const [warnManagerOnInvoice, setWarnManagerOnInvoice] = useState(false);

  const [
    requiredEstablishmentBillingGroupIsMissing,
    setRequiredEstablishmentBillingGroupIsMissing,
  ] = useState(false);

  const handlePackSelect = React.useCallback(
    (pack: PaymentPack) => {
      setSelectedPack(pack);
      if (!pack) {
        return setWarnManagerOnInvoice(false);
      }
      const memberTags = props.memberDetails[props.member.id]?.tags;
      return setWarnManagerOnInvoice(
        paymentPackTagsAndMemberTagsCompatibilty(pack, memberTags),
      );
    },
    [props.member.id, props.memberDetails],
  );

  const handleOnChangeVoucherCredit = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newVoucher = event.target.value;
      const newVoucherNumber = parseFloat(parseFloat(newVoucher).toFixed(2));
      setVoucher(newVoucher);
      setVoucherPercentage(
        selectedPack && selectedPack?.price
          ? parseFloat(
              (newVoucherNumber / parseFloat(selectedPack.price)) * 100,
            ).toFixed(2)
          : '0,00',
      );
      setFinalPricePreview(
        selectedPack
          ? (selectedPack.price - newVoucherNumber).toFixed(2)
          : '0.00',
      );
    },
    [selectedPack],
  );

  const handleOnChangeVoucherPercentage = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newVoucher =
        Math.round(parseFloat(event.target.value) * selectedPack.price) / 100;
      setVoucher(selectedPack ? newVoucher.toString() : voucher);
      setVoucherPercentage(event.target.value);
      setFinalPricePreview(
        selectedPack ? (selectedPack.price - newVoucher).toFixed(2) : '0.00',
      );
    },
    [selectedPack, voucher],
  );

  const handleOnChangeFinalPricePreview = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const pricePreview = event.target.value;
      const roundedPricePreviewNumber = parseFloat(
        parseFloat(event.target.value).toFixed(2),
      );
      const newVoucher = selectedPack
        ? (selectedPack.price - roundedPricePreviewNumber).toFixed(2)
        : voucher;
      setFinalPricePreview(pricePreview);
      setVoucher(newVoucher);
      setVoucherPercentage(
        selectedPack && selectedPack?.price
          ? parseFloat(
              (newVoucher / parseFloat(selectedPack.price)) * 100,
            ).toFixed(2)
          : '0,00',
      );
    },
    [selectedPack, voucher],
  );
  const handleVoucherCreditOnBlur = React.useCallback(() => {
    setVoucher((prevState) => parseFloat(prevState).toFixed(2));
  }, []);

  const handleFinalPricePreviewOnBlur = React.useCallback(() => {
    // Depending on how you change the state, prevState and toFixed might not exist
    setFinalPricePreview((prevState) => parseFloat(prevState).toFixed(2));
  }, []);

  const handleVoucherPercentageOnBlur = React.useCallback(() => {
    setVoucherPercentage((prevState) => parseFloat(prevState).toFixed(2));
  }, []);

  const handleOnCancelClick = React.useCallback(() => {
    setSelectedPack(null);
    setVoucherDialogOpen(false);
    setVoucher('0,00');
    setVoucherPercentage(0.0);
    setVoucherReason(null);
    setFinalPricePreview('0,00');
  }, []);

  const handleOnConfirmClick = () => {
    if (shouldEnterCustomDiscountReason && !voucherReason) {
      setVoucherReasonErrors(true);
      return;
    }
    if (
      props.enableMultiLocalization &&
      !selectedEstablishmentBillingGroup &&
      props.establishmentBillingGroups?.length
    ) {
      setRequiredEstablishmentBillingGroupIsMissing(true);
      return;
    }
    props.registerToOffer(
      { paymentPack: selectedPack },
      voucher,
      voucherReason,
      selectedEstablishmentBillingGroup?.id,
    );
    setSelectedPack(null);
    setVoucher('0,00');
    setFinalPricePreview('0,00');
    setSelectedEstablishmentBillingGroup(null);
  };

  const handleGoToPaymentPack = (paymentPackId) => () => {
    if (!paymentPackId) {
      return;
    }
    props.goToPaymentPack(paymentPackId);
  };

  const handleOnBookOneClick = React.useCallback(
    (pack: PaymentPack) => () => {
      handlePackSelect(pack);
      // We don't trust offer.is_full field, as it takes into account the waiting list's convertible options.
      // The relevant figure in this case is the real number of available bookings left.
      if (props.offer.nb_bookings >= props.offer.effectif) {
        setOpenConfirmation(true);
      } else {
        setVoucherDialogOpen(true);
        setFinalPricePreview(pack.price.toFixed(2));
      }
    },
    [handlePackSelect, props.offer.nb_bookings, props.offer.effectif],
  );

  const handleRegisterToOffer = (consumerPaymentPack) => () =>
    props.registerToOffer({ consumerPaymentPack });

  const handleSwitchCollapse = React.useCallback(() => {
    if (!hasFetchedNonCompatiblePasses && !openNonCompatibleConsumerPass) {
      handleFetchNoncompatibleConsumerPackByOfferByMember();
      setHasFetchedNonCompatiblePasses(true);
    }
    setOpenNonCompatibleConsumerPass(!openNonCompatibleConsumerPass);
  }, [
    hasFetchedNonCompatiblePasses,
    openNonCompatibleConsumerPass,
    handleFetchNoncompatibleConsumerPackByOfferByMember,
    setOpenNonCompatibleConsumerPass,
  ]);

  const handleSelectEstablishmentBillingGroup = React.useCallback(
    (item: EstablishmentBillingGroup) => {
      setSelectedEstablishmentBillingGroup(item || null);
      setRequiredEstablishmentBillingGroupIsMissing(!item);
    },
    [
      setSelectedEstablishmentBillingGroup,
      setRequiredEstablishmentBillingGroupIsMissing,
    ],
  );

  const handleOnChangeVoucherReason = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value || '';
      setVoucherReasonErrors(!value);
      setVoucherReason(value);
    },
    [setVoucherReasonErrors, setVoucherReason],
  );
  const handleEnterKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent adding a new line when pressing Enter
      }
    },
    [],
  );

  const shouldEnterCustomDiscountReason = React.useMemo(() => {
    return (
      (parseFloat(voucher) > 0 || parseFloat(voucherPercentage) > 0) &&
      props.isCustomDiscountReasonRequired
    );
  }, [voucher, voucherPercentage, props.isCustomDiscountReasonRequired]);

  const hasNoCompatiblePasses =
    !props.consumerPacksOrMaxoutLoading && props.consumerPacks.length === 0;

  const hasNoInCompatiblePasses =
    (hasFetchedNonCompatiblePasses || containerHasFetchedNonCompatiblePasses) &&
    props.consumerPacksNonCompatible?.length === 0;

  React.useEffect(() => {
    if (!openBuyableCompatiblePassesCollapse && hasNoCompatiblePasses) {
      setOpenBuyableCompatiblePassesCollapse(true);
    }
  }, [
    props.consumerPacksOrMaxoutLoading,
    props.consumerPacks,
    openBuyableCompatiblePassesCollapse,
    hasNoCompatiblePasses,
  ]);

  React.useEffect(() => {
    if (!openNonCompatibleConsumerPass && nonCompatibleByOfferByMemberLoading) {
      setOpenNonCompatibleConsumerPass(true);
    }
  }, [
    openNonCompatibleConsumerPass,
    nonCompatibleByOfferByMemberLoading,
    setOpenNonCompatibleConsumerPass,
  ]);

  React.useEffect(() => {
    setVoucherDialogOpen(false);
  }, [props.member]);

  React.useEffect(() => {
    if (
      props.staffDefaultEstablishmentBillingGroup &&
      !selectedEstablishmentBillingGroup
    ) {
      setSelectedEstablishmentBillingGroup(
        props.staffDefaultEstablishmentBillingGroup,
      );
      setRequiredEstablishmentBillingGroupIsMissing(false);
    }
  }, [
    props.staffDefaultEstablishmentBillingGroup,
    selectedEstablishmentBillingGroup,
  ]);

  return (
    <div className={classes.container}>
      <Typography component="h4" variant="h6">
        {t('offerManagement.forms.register.passOwnedByMember')}
      </Typography>
      {props.consumerPacksOrMaxoutLoading ? (
        <>
          <div>
            <Skeleton animation="wave" height={30} variant="text" width="40%" />
            <Box mt={2} />
            <Skeleton
              animation="wave"
              height={50}
              variant="rect"
              width="100%"
            />
          </div>
          <div>
            <Skeleton animation="wave" height={30} variant="text" width="40%" />
            <Box mt={2} />
            <Skeleton
              animation="wave"
              height={50}
              variant="rect"
              width="100%"
            />
          </div>
        </>
      ) : (
        <>
          {props.consumerPacks.length > 0 ? (
            <>
              <List>
                {props.consumerPacks.map((cp) => (
                  <ConsumerPackRowItem
                    key={cp.id}
                    hideConsumer
                    {...{
                      onBook: props.disableMultiBooking
                        ? handleRegisterToOffer(cp)
                        : undefined,
                    }}
                    consumerPack={cp}
                    maxoutBooking={props.cppMaxoutBookingsByCpp[cp.id]}
                    offer={props.offer}
                    onBookMultiple={
                      props.disableMultiBooking
                        ? undefined
                        : () =>
                            props.onBookMultiple({ consumerPaymentPack: cp })
                    }
                    onBookOne={handleRegisterToOffer(cp)}
                    paymentPack={cp.payment_pack}
                  />
                ))}
              </List>
            </>
          ) : (
            <Alert className={classes.alert} severity="warning">
              {t('offer.noConsumerPackAvailableForPurchase')}
            </Alert>
          )}
        </>
      )}

      <div>
        <ButtonBase
          className={classes.nonCompatibleCollapsable}
          disabled={nonCompatibleByOfferByMemberLoading}
          onClick={handleSwitchCollapse}
        >
          <Typography
            color={
              nonCompatibleByOfferByMemberLoading || hasNoInCompatiblePasses
                ? 'textSecondary'
                : 'textPrimary'
            }
            styles={{ textAlign: 'start' }}
            variant="h6"
          >
            {t('offer.noncompatibleConsumerPaymentPacksAre')}
          </Typography>
          {openNonCompatibleConsumerPass ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Collapse in={openNonCompatibleConsumerPass}>
          <div>
            {nonCompatibleByOfferByMemberLoading ? (
              <>
                <Skeleton
                  animation="wave"
                  height={30}
                  variant="text"
                  width="40%"
                />
                <Box mt={2} />
                <Skeleton
                  animation="wave"
                  height={50}
                  variant="rect"
                  width="100%"
                />
              </>
            ) : (
              <>
                {hasNoInCompatiblePasses && (
                  <div className={classes.paddingTop2}>
                    <Alert className={classes.alert} severity="info">
                      {t('offer.noInConsumerPackAvailableForPurchase')}
                    </Alert>
                  </div>
                )}
                {!hasNoInCompatiblePasses &&
                  props.consumerPacksNonCompatible.map((cp) => (
                    <ConsumerPackRowItem
                      key={cp.id}
                      hideConsumer
                      isNonCompatible
                      consumerPack={cp}
                      fetchIncompatibilitiesReasonsByOfferByConsumerPack={
                        props.fetchIncompatibilitiesReasonsByOfferByConsumerPack
                      }
                      goToPaymentPack={handleGoToPaymentPack(
                        cp.payment_pack?.id,
                      )}
                      incompatibilitiesReasons={props.incompatibilitiesReasons}
                      offer={props.offer}
                      paymentPack={cp.payment_pack}
                    />
                  ))}
              </>
            )}
          </div>
        </Collapse>
      </div>
      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="billing.allowed_actions.createInvoice"
      >
        <>
          <ButtonBase
            className={classes.nonCompatibleCollapsable}
            disabled={hasNoCompatiblePasses}
            onClick={() =>
              setOpenBuyableCompatiblePassesCollapse(
                !openBuyableCompatiblePassesCollapse,
              )
            }
          >
            <Typography
              component="h4"
              styles={{ textAlign: 'start' }}
              variant="h6"
            >
              {t(
                'offerManagement.forms.register.passCompatibleNotOwnedByMember',
              )}
            </Typography>
            {openBuyableCompatiblePassesCollapse ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </ButtonBase>
          <Collapse in={openBuyableCompatiblePassesCollapse}>
            {!props.compatiblePacks.length ? (
              <Alert
                className={clsx(classes.alert, classes.paddingTop2)}
                severity="warning"
              >
                {t('offer.noPackAvailableForOfferPurchase')}
              </Alert>
            ) : (
              <List>
                {props.compatiblePacks
                  .filter((pack) => !pack.disabled)
                  .map((pack) => (
                    <PaymentPackListItem
                      key={pack.id}
                      divider
                      hidePacksNumber
                      isFlexContainerOnMobile
                      showDuration
                      onBookMultiple={
                        props.disableMultiBooking
                          ? undefined
                          : () => props.onBookMultiple({ paymentPack: pack })
                      }
                      onBookOne={handleOnBookOneClick(pack)}
                      pack={pack}
                    />
                  ))}
              </List>
            )}
          </Collapse>
        </>
      </ObjectLevelPermissionWrapper>
      <ModalConfirm
        handleCancel={() => {
          setVoucherDialogOpen(false);
          setWarnManagerOnInvoice(false);
        }}
        handleConfirm={() => {
          setWarnManagerOnInvoice(false);
        }}
        open={warnManagerOnInvoice}
        options={{
          title: 'invoice:invoicePaymentPackTagWarningDialog.title',
          Content: () => (
            <p>{t('invoice:invoicePaymentPackTagWarningDialog.content')}</p>
          ),
        }}
      />
      <Dialog open={openConfirmation}>
        <DialogTitle>{t('offer:maximumNumber')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.isNotAllowedToOverbook
              ? t('role:overbookingForbidden')
              : t('offer:maximumNumberDescription', {
                  effectif: props.offer.effectif,
                })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            key="cancel"
            onClick={() => {
              props.closeDialog();
              setOpenConfirmation(false);
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            key="confirm"
            color="primary"
            onClick={() => {
              setOpenConfirmation(false);
              setVoucherDialogOpen(true);
            }}
            variant="contained"
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={voucherDialogOpen && !warnManagerOnInvoice}>
        <DialogTitle>
          {t('translation:payment.updateInvoiceVoucher')}
        </DialogTitle>
        <DialogContent>
          <Typography>{t('translation:quickInvoiceVoucher')}</Typography>
          <Typography variant="caption">
            {t('translation:quickInvoiceNoVoucher')}
          </Typography>
          <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.createManualDiscount">
            {(hasCreateDiscountPermission) => (
              <div
                className={clsx(classes.voucherField, {
                  [classes.alignCenter]: !hasCreateDiscountPermission,
                })}
              >
                <PaymentPackListItem
                  hidePacksNumber
                  isFlexContainerOnMobile
                  showDuration
                  pack={selectedPack}
                />
                {hasCreateDiscountPermission ? (
                  <div className={classes.voucherRight}>
                    <PriceInput
                      error={
                        Number.isNaN(voucher) ||
                        voucher < 0 ||
                        (selectedPack ? selectedPack.price < voucher : false)
                      }
                      invalid={
                        Number.isNaN(voucher) ||
                        (selectedPack ? selectedPack.price < voucher : false) ||
                        voucher < 0
                      }
                      label={t('translation:payment.voucher')}
                      onBlur={handleVoucherCreditOnBlur}
                      onChange={handleOnChangeVoucherCredit}
                      value={voucher}
                      variant="outlined"
                    />
                    {shouldEnterCustomDiscountReason && (
                      <TextField
                        multiline
                        required
                        className={classes.fieldDiscountWrapper}
                        error={voucherReasonErrors}
                        helperText={`${voucherReason?.length ?? 0}/100`}
                        inputProps={{ maxLength: 100 }}
                        label={t('invoice:invoiceItem.discountReason')}
                        maxRows={5}
                        name="voucherReason"
                        onChange={handleOnChangeVoucherReason}
                        onKeyDown={handleEnterKey}
                        value={voucherReason}
                        variant="outlined"
                      />
                    )}
                    <PercentInput
                      error={
                        Number.isNaN(voucher) ||
                        voucher < 0 ||
                        (selectedPack ? selectedPack.price < voucher : false)
                      }
                      invalid={
                        (selectedPack ? selectedPack.price < voucher : false) ||
                        voucher < 0
                      }
                      label={t('translation:payment.voucher')}
                      onBlur={handleVoucherPercentageOnBlur}
                      onChange={handleOnChangeVoucherPercentage}
                      style={{ minWidth: 480 }}
                      value={voucherPercentage}
                      variant="outlined"
                    />
                    <PriceInput
                      error={
                        Number.isNaN(voucher) ||
                        voucher < 0 ||
                        (selectedPack ? selectedPack.price < voucher : false)
                      }
                      invalid={
                        Number.isNaN(voucher) ||
                        (selectedPack ? selectedPack.price < voucher : false) ||
                        voucher < 0
                      }
                      label={t('invoice:invoiceItem.finalPricePreview')}
                      onBlur={handleFinalPricePreviewOnBlur}
                      onChange={handleOnChangeFinalPricePreview}
                      value={finalPricePreview}
                      variant="outlined"
                    />
                  </div>
                ) : (
                  <Typography>
                    {t('invoice:section.invoiceItemList.cannotCreateDiscount')}
                  </Typography>
                )}
              </div>
            )}
          </ObjectLevelPermissionProvider>
          {props.enableMultiLocalization && (
            <div>
              <Typography className={classes.sectionTitle} variant="h6">
                {t('invoice:section.invoiceItemList.billingGroup')}
              </Typography>
              <Divider className={classes.divider} />

              <EstablishmentBillingGroupSelector
                closeMenuOnSelect
                isOptionDisabled
                isRequired
                noMulti
                establishmentBillingGroups={props.establishmentBillingGroups}
                isLoading={props.establishmentLoading}
                requiredValueIsMissing={
                  requiredEstablishmentBillingGroupIsMissing
                }
                selectedEstablishmentBillingGroup={
                  selectedEstablishmentBillingGroup
                }
                selectOption={handleSelectEstablishmentBillingGroup}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnCancelClick}>
            {t('translation:common.cancel')}
          </Button>
          <Button
            color="primary"
            disabled={
              Number.isNaN(voucher) ||
              voucher < 0 ||
              (selectedPack ? selectedPack.price < voucher : true)
            }
            onClick={handleOnConfirmClick}
          >
            {t('translation:common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  voucherField: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingTop: theme.spacing(2),
  },
  alignCenter: { alignItems: 'center' },
  voucherRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    '&>*': {
      marginBottom: theme.spacing(1.5),
    },
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  nonCompatibleCollapsable: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  paddingTop2: {
    paddingTop: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
}));

export default BookingModuleRegisterMethodChoice;
