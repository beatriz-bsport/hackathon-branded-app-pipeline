import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  ButtonBase,
  DialogActions,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import BlockIcon from '@material-ui/icons/Block';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import MaxoutInfoMessage from '#libs/booker-module/components/MaxoutInfoMessage.component';
import { ContractWithPaymentPack } from '#libs/subscription/types';
import { CompanyTheme } from '#libs/theme/types';
import { MaterialStyleType } from '../../../utils/types';

import CollapsibleSection from '../../../components/CollapsibleSection';
import PaymentComboBookableItem from './PaymentComboBookableItem.component';
import PaymentPackBookableItem from './PaymentPackBookableItem.component';
import ContractBookableItem from './ContractBookableItem.component';
import ConsumerPaymentPackBookableItem from './ConsumerPaymentPackBookableItem.component';
import { RadioItem } from '../../../components/radio/RadioItem';
import { ConsumerPaymentPack } from '../../consumer-payment-pack/types';
import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
  MaxoutData,
} from '../../payment-packs/types';
import { PaymentCombo } from '../../payment-combo/types';
import { Offer_FULL } from '../../offer/types';
import PaymentPackCategoryBookableItem from './PaymentPackCategoryBookableItem.component';
import { SelectedPack } from '../types';

type OwnProps = {
  offersConstraint: {
    credit: number;
    minDate?: string;
    maxDate?: string;
  };
  selectedPack?: SelectedPack;
  onPackChange: (selectedPack: SelectedPack) => void;
  selectedOffers: {
    offer: Offer_FULL;
    extra_data: any;
  }[];
  availableConsumerPacks: Array<ConsumerPaymentPack<PaymentPack> & MaxoutData>;
  unCategorizedPacks: Array<PaymentPack & MaxoutData>;
  availableComboPacks: Array<PaymentCombo & MaxoutData>;
  paymentPackCategories: Array<
    PaymentPackCategoryWithPacks<PaymentPack & MaxoutData>
  >;
  contractList: Array<ContractWithPaymentPack & MaxoutData>;
  isExcludingTax?: boolean;
  theme: CompanyTheme;
  offerTagStatus: boolean;
  onOpenSubscriptionModal: (contract: ContractWithPaymentPack) => void;
};

enum CollapsePackEnum {
  consumerPacks,
  paymentPacks,
  paymentCombo,
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  openPacks: CollapsePackEnum | null;
  consumerPaymentPackMore: boolean;
  paymentPackMore: boolean;
  paymentComboPackMore: boolean;
  openedCategory: number | null;
  maxoutMessageModaleText: null | string;
};

class BookingMethodSelector extends React.PureComponent<Props, State> {
  state: State = {
    openPacks: null,
    consumerPaymentPackMore: false,
    paymentPackMore: false,
    paymentComboPackMore: false,
    openedCategory: null,
    maxoutMessageModaleText: null,
  };

  componentDidMount() {
    this.setDefaultPack();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.offersConstraint !== this.props.offersConstraint) {
      this.shouldAutoSelectDefaultPack();
    }
  }

  openMaxoutMessageModale = (msg: string) =>
    this.setState({
      maxoutMessageModaleText: msg,
    });

  closeMaxoutMessageModale = () =>
    this.setState({
      maxoutMessageModaleText: null,
    });

  shouldAutoSelectDefaultPack = () => {
    const { availableConsumerPacks, unCategorizedPacks, availableComboPacks } =
      this.props;
    /** If selected pack not existed anymore */
    if (
      (!this.props.selectedPack.consumerPaymentPack &&
        !this.props.selectedPack.paymentPack &&
        !this.props.selectedPack.paymentPackCombo) ||
      (this.props.selectedPack.consumerPaymentPack &&
        !availableConsumerPacks
          ?.filter((cpp) => !cpp.exceedsBookingMaxout)
          .some(
            (cpp) => cpp.id === this.props.selectedPack.consumerPaymentPack.id,
          )) ||
      (this.props.selectedPack.paymentPack &&
        !unCategorizedPacks
          ?.filter((p) => !p.exceedsBookingMaxout)
          .some((cpp) => cpp.id === this.props.selectedPack.paymentPack.id) &&
        !this.props.paymentPackCategories.some((cat) =>
          cat.packs
            ?.filter((p) => !p.exceedsBookingMaxout)
            .find((p) => p.id === this.props.selectedPack.paymentPack.id),
        )) ||
      (this.props.selectedPack.paymentPackCombo &&
        !availableComboPacks
          ?.filter((cp) => !cp.exceedsBookingMaxout)
          .some(
            (cpp) => cpp.id === this.props.selectedPack.paymentPackCombo.id,
          ))
    ) {
      this.setDefaultPack();
    }
  };

  setDefaultPack = () => {
    const {
      availableConsumerPacks,
      unCategorizedPacks,
      availableComboPacks,
      paymentPackCategories,
    } = this.props;

    const selectedPack: SelectedPack = {};
    let openPacks: CollapsePackEnum | null = null;
    let openedCategory = null;

    if (
      availableConsumerPacks?.filter((cpp) => !cpp.exceedsBookingMaxout).length
    ) {
      selectedPack.consumerPaymentPack = availableConsumerPacks.filter(
        (cpp) => !cpp.exceedsBookingMaxout,
      )[0];
      openPacks = CollapsePackEnum.consumerPacks;
    } else if (
      unCategorizedPacks?.filter((pp) => !pp.exceedsBookingMaxout).length
    ) {
      selectedPack.paymentPack = unCategorizedPacks.filter(
        (cpp) => !cpp.exceedsBookingMaxout,
      )[0];
      openPacks = CollapsePackEnum.paymentPacks;
    } else if (
      availableComboPacks?.filter((cp) => !cp.exceedsBookingMaxout).length
    ) {
      selectedPack.paymentPackCombo = availableComboPacks.filter(
        (cpp) => !cpp.exceedsBookingMaxout,
      )[0];
      openPacks = CollapsePackEnum.paymentCombo;
    } else {
      const category = paymentPackCategories.find(
        (cat) => cat.packs?.filter((p) => !p.exceedsBookingMaxout).length,
      );
      selectedPack.paymentPack = category?.packs.filter(
        (cpp) => !cpp.exceedsBookingMaxout,
      )[0];
      openedCategory = category?.id;
    }

    this.props.onPackChange(selectedPack);
    this.setState({ openPacks, openedCategory });
  };

  openPacks = (id: CollapsePackEnum | number, isCategory: boolean) => {
    const { availableConsumerPacks, unCategorizedPacks, availableComboPacks } =
      this.props;

    let selectedPack = this.props.selectedPack;

    if (isCategory) {
      const category = this.props.paymentPackCategories.find(
        (cat) => cat.id === id,
      );
      if (category?.packs?.filter((p) => !p.exceedsBookingMaxout).length) {
        selectedPack = {
          paymentPack: category.packs.filter((p) => !p.exceedsBookingMaxout)[0],
        };
      }
      this.setState(() => {
        return {
          openPacks: null,
          openedCategory: id,
        };
      });
    } else {
      if (id === CollapsePackEnum.consumerPacks) {
        if (
          availableConsumerPacks?.filter((cpp) => !cpp.exceedsBookingMaxout)
            .length
        ) {
          selectedPack = {
            consumerPaymentPack: availableConsumerPacks.filter(
              (cpp) => !cpp.exceedsBookingMaxout,
            )[0],
          };
        }
      }
      if (id === CollapsePackEnum.paymentPacks) {
        if (unCategorizedPacks?.filter((p) => !p.exceedsBookingMaxout).length) {
          selectedPack = {
            paymentPack: unCategorizedPacks.filter(
              (p) => !p.exceedsBookingMaxout,
            )[0],
          };
        }
      }
      if (id === CollapsePackEnum.paymentCombo) {
        if (
          availableComboPacks?.filter((cp) => !cp.exceedsBookingMaxout).length
        ) {
          selectedPack = {
            paymentPackCombo: availableComboPacks.filter(
              (cp) => !cp.exceedsBookingMaxout,
            )[0],
          };
        }
      }
      this.setState((prevState: State) => {
        return {
          openPacks: prevState.openPacks === id ? null : id,
          openedCategory: null,
        };
      });
    }

    this.props.onPackChange(selectedPack);
  };

  render() {
    const {
      classes,
      t,
      availableConsumerPacks,
      unCategorizedPacks,
      availableComboPacks,
      contractList,
    } = this.props;
    const numberOfConsumerPackToRender = this.state.consumerPaymentPackMore
      ? availableConsumerPacks.length
      : 3;
    const numberOfPaymentPackToRender = this.state.paymentPackMore
      ? unCategorizedPacks.length
      : 3;
    const numberOfPaymentComboToRender = this.state.paymentComboPackMore
      ? availableComboPacks.length
      : 3;

    const showBuyableItem =
      !(
        this.props.theme?.hide_unnecessary_compatible_purchase_method ?? true
      ) || availableConsumerPacks.length === 0;

    return (
      <div className={classes.container}>
        {!availableConsumerPacks.length &&
          !unCategorizedPacks.length &&
          !availableComboPacks.length &&
          !this.props.paymentPackCategories.length && (
            <div className={classes.cannotBookContainer}>
              <BlockIcon className={classes.noItemIcon} />
              <Typography>
                {t('booking:offer.noPackAvailable', {
                  count: this.props.selectedOffers.length + 1,
                })}
              </Typography>
            </div>
          )}

        {!!availableConsumerPacks.length && (
          <CollapsibleSection
            in={this.state.openPacks === CollapsePackEnum.consumerPacks}
            onSwitch={() =>
              this.openPacks(CollapsePackEnum.consumerPacks, false)
            }
            title={t('booking:bookingModule.section.consumerPacks')}
          >
            {availableConsumerPacks
              .slice(0, numberOfConsumerPackToRender)
              .map((consumerPaymentPack) => {
                if (!consumerPaymentPack) {
                  return null;
                }
                return (
                  <div
                    key={consumerPaymentPack.id}
                    className={classNames(classes.item, classes.relative)}
                  >
                    <RadioItem
                      disabled={consumerPaymentPack.exceedsBookingMaxout}
                      onClick={() =>
                        this.props.onPackChange({ consumerPaymentPack })
                      }
                      renderItem={() => (
                        <ConsumerPaymentPackBookableItem
                          consumerPaymentPack={consumerPaymentPack}
                        />
                      )}
                      selected={
                        consumerPaymentPack.id ===
                        this.props.selectedPack?.consumerPaymentPack?.id
                      }
                    />
                    {consumerPaymentPack.exceedsBookingMaxout && (
                      <div className={classes.maxoutMessageContainer}>
                        <MaxoutInfoMessage
                          maxoutInfo={consumerPaymentPack.maxoutInfo}
                          openModale={this.openMaxoutMessageModale}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

            {availableConsumerPacks.length > 3 &&
              !this.state.consumerPaymentPackMore && (
                <ButtonBase
                  onClick={() =>
                    this.setState({ consumerPaymentPackMore: true })
                  }
                >
                  <Typography color="primary">
                    {t('booking:offer.showMore')}
                  </Typography>
                </ButtonBase>
              )}
          </CollapsibleSection>
        )}
        {showBuyableItem && (
          <>
            {!!contractList.length && (
              <div className={classes.marginTop}>
                <CollapsibleSection
                  in
                  title={t('booking:bookingModule.section.contract')}
                >
                  {contractList.map((contract) => {
                    if (!contract) {
                      return null;
                    }
                    return (
                      <div
                        key={contract.id}
                        className={classNames(classes.item, classes.relative)}
                      >
                        <ButtonBase
                          className={classNames(
                            classes.item,
                            classes.fullWidth,
                          )}
                          disabled={contract.exceedsBookingMaxout}
                          onClick={() => {
                            this.props.onOpenSubscriptionModal(contract);
                          }}
                        >
                          <div
                            className={classNames(
                              classes.row,
                              classes.fullWidth,
                            )}
                          >
                            <VisibilityIcon
                              className={classNames({
                                [classes.opacity]:
                                  contract.exceedsBookingMaxout,
                              })}
                              color="primary"
                            />
                            <ContractBookableItem
                              contract={contract}
                              isExcludingTax={this.props.isExcludingTax}
                            />
                          </div>
                        </ButtonBase>
                        {contract.exceedsBookingMaxout && (
                          <div className={classes.maxoutMessageContainer}>
                            <MaxoutInfoMessage
                              maxoutInfo={contract.maxoutInfo}
                              openModale={this.openMaxoutMessageModale}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CollapsibleSection>
              </div>
            )}

            {this.props.paymentPackCategories.length
              ? this.props.paymentPackCategories.map((cat) => (
                  <PaymentPackCategoryBookableItem
                    hideCredits={this.props.theme.hide_credits_for_customers}
                    isExcludingTax={this.props.isExcludingTax}
                    onPackChange={this.props.onPackChange}
                    opened={this.state.openedCategory === cat.id}
                    openModale={this.openMaxoutMessageModale}
                    openPacks={(id) => this.openPacks(id, true)}
                    paymentPackCategory={cat}
                    selectedPack={this.props.selectedPack}
                  />
                ))
              : null}
            {unCategorizedPacks.length ? (
              <>
                <div className={classes.marginTop} />
                <CollapsibleSection
                  in={this.state.openPacks === CollapsePackEnum.paymentPacks}
                  onSwitch={() =>
                    this.openPacks(CollapsePackEnum.paymentPacks, false)
                  }
                  title={t('booking:bookingModule.section.paymentPacks')}
                >
                  {unCategorizedPacks
                    .filter((e) => !e.category)
                    .slice(0, numberOfPaymentPackToRender)
                    .map((paymentPack) => {
                      if (!paymentPack) {
                        return null;
                      }
                      return (
                        <div
                          key={paymentPack.id}
                          className={classNames(classes.item, classes.relative)}
                        >
                          <RadioItem
                            disabled={paymentPack.exceedsBookingMaxout}
                            onClick={() =>
                              this.props.onPackChange({ paymentPack })
                            }
                            renderItem={() => (
                              <PaymentPackBookableItem
                                hideCredits={
                                  this.props.theme.hide_credits_for_customers
                                }
                                isExcludingTax={this.props.isExcludingTax}
                                paymentPack={paymentPack}
                              />
                            )}
                            selected={
                              paymentPack.id ===
                              this.props.selectedPack?.paymentPack?.id
                            }
                          />
                          {paymentPack.exceedsBookingMaxout && (
                            <div className={classes.maxoutMessageContainer}>
                              <MaxoutInfoMessage
                                maxoutInfo={paymentPack.maxoutInfo}
                                openModale={this.openMaxoutMessageModale}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {unCategorizedPacks.length > 3 &&
                    !this.state.paymentPackMore && (
                      <ButtonBase
                        onClick={() => this.setState({ paymentPackMore: true })}
                      >
                        <Typography color="primary">
                          {t('booking:offer.showMore')}
                        </Typography>
                      </ButtonBase>
                    )}
                </CollapsibleSection>
              </>
            ) : null}

            {!!availableComboPacks.length && (
              <>
                <div className={classes.marginTop} />
                <CollapsibleSection
                  in={this.state.openPacks === CollapsePackEnum.paymentCombo}
                  onSwitch={() =>
                    this.openPacks(CollapsePackEnum.paymentCombo, false)
                  }
                  title={t('booking:bookingModule.section.paymentCombos')}
                >
                  {availableComboPacks
                    .slice(0, numberOfPaymentComboToRender)
                    .map((paymentPackCombo) => {
                      if (!paymentPackCombo) {
                        return null;
                      }
                      return (
                        <div
                          key={paymentPackCombo.id}
                          className={classNames(classes.item, classes.relative)}
                        >
                          <RadioItem
                            disabled={paymentPackCombo.exceedsBookingMaxout}
                            onClick={() =>
                              this.props.onPackChange({ paymentPackCombo })
                            }
                            renderItem={() => (
                              <PaymentComboBookableItem
                                isExcludingTax={this.props.isExcludingTax}
                                paymentCombo={paymentPackCombo}
                              />
                            )}
                            selected={
                              paymentPackCombo.id ===
                              this.props.selectedPack?.paymentPackCombo?.id
                            }
                          />
                          {paymentPackCombo.exceedsBookingMaxout && (
                            <div className={classes.maxoutMessageContainer}>
                              <MaxoutInfoMessage
                                maxoutInfo={paymentPackCombo.maxoutInfo}
                                openModale={this.openMaxoutMessageModale}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {availableComboPacks.length > 3 &&
                    !this.state.paymentComboPackMore && (
                      <ButtonBase
                        onClick={() =>
                          this.setState({ paymentComboPackMore: true })
                        }
                      >
                        <Typography color="primary">
                          {t('booking:offer.showMore')}
                        </Typography>
                      </ButtonBase>
                    )}
                </CollapsibleSection>
              </>
            )}
          </>
        )}
        {!!this.state.maxoutMessageModaleText && (
          <Dialog open>
            <DialogContent>
              <Typography>{this.state.maxoutMessageModaleText}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeMaxoutMessageModale}>
                {t('common:close')}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
  },
  skeletonContainer: {
    marginTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(0),
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  titleContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  cannotBookContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  noItemIcon: {
    fontSize: 140,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  item: {
    paddingTop: theme.spacing(1),
  },
  fullWidth: { width: '100%' },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1.3),
      marginLeft: theme.spacing(1.3),
    },
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  opacity: {
    opacity: 0.5,
  },
  relative: {
    position: 'relative',
  },
  maxoutMessageContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    transform: 'translateY(50%)',
    maxWidth: '40%',
    paddingRight: theme.spacing(2),
    textAlign: 'center',
  },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['booking']),
)(BookingMethodSelector);
