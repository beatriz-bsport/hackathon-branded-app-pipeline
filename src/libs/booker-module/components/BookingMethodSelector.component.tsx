import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { ButtonBase, Theme, Typography, withStyles } from '@material-ui/core';
import BlockIcon from '@material-ui/icons/Block';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
} from '../../payment-packs/types';
import { PaymentCombo } from '../../payment-combo/types';
import { Offer_FULL } from '../../offer/types';
import PaymentPackCategoryBookableItem from './PaymentPackCategoryBookableItem.component';

type SelectedPack = {
  consumerPaymentPack?: ConsumerPaymentPack<PaymentPack> | null;
  paymentPackCombo?: PaymentCombo | null;
  paymentPack?: PaymentPack | null;
};

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
  availableConsumerPacks: ConsumerPaymentPack<PaymentPack>[];
  unCategorizedPacks: PaymentPack[];
  availableComboPacks: PaymentCombo[];
  paymentPackCategories: PaymentPackCategoryWithPacks[];
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
};

class BookingMethodSelector extends React.PureComponent<Props, State> {
  state: State = {
    openPacks: null,
    consumerPaymentPackMore: false,
    paymentPackMore: false,
    paymentComboPackMore: false,
    openedCategory: null,
  };

  componentDidMount() {
    this.setDefaultPack();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.offersConstraint !== this.props.offersConstraint) {
      this.shouldAutoSelectDefaultPack();
    }
  }

  shouldAutoSelectDefaultPack = () => {
    const {
      availableConsumerPacks,
      unCategorizedPacks,
      availableComboPacks,
    } = this.props;

    /** If selected pack not existed anymore */
    if (
      (!this.props.selectedPack.consumerPaymentPack &&
        !this.props.selectedPack.paymentPack &&
        !this.props.selectedPack.paymentPackCombo) ||
      (this.props.selectedPack.consumerPaymentPack &&
        availableConsumerPacks.findIndex(
          (cpp) => cpp.id === this.props.selectedPack.consumerPaymentPack.id,
        ) === -1) ||
      (this.props.selectedPack.paymentPack &&
        (unCategorizedPacks.findIndex(
          (cpp) => cpp.id === this.props.selectedPack.paymentPack.id,
        ) === -1 ||
          !this.props.paymentPackCategories.some((cat) =>
            cat.packs.find(
              (p) => p.id === this.props.selectedPack.paymentPack.id,
            ),
          ))) ||
      (this.props.selectedPack.paymentPackCombo &&
        availableComboPacks.findIndex(
          (cpp) => cpp.id === this.props.selectedPack.paymentPackCombo.id,
        ) === -1)
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

    if (availableConsumerPacks.length) {
      selectedPack.consumerPaymentPack = availableConsumerPacks[0];
      openPacks = CollapsePackEnum.consumerPacks;
    } else if (unCategorizedPacks.length) {
      selectedPack.paymentPack = unCategorizedPacks[0];
      openPacks = CollapsePackEnum.paymentPacks;
    } else if (availableComboPacks.length) {
      selectedPack.paymentPackCombo = availableComboPacks[0];
      openPacks = CollapsePackEnum.paymentCombo;
    } else {
      const category = paymentPackCategories.find((cat) => cat.packs.length);
      selectedPack.paymentPack = category?.packs[0];
      openedCategory = category?.id;
    }

    this.props.onPackChange(selectedPack);
    this.setState({ openPacks, openedCategory });
  };

  openPacks = (id: CollapsePackEnum | number, isCategory: boolean) => {
    const {
      availableConsumerPacks,
      unCategorizedPacks,
      availableComboPacks,
    } = this.props;

    let selectedPack = this.props.selectedPack;

    if (isCategory) {
      selectedPack = {
        paymentPack: this.props.paymentPackCategories.find(
          (cat) => cat.id === id,
        ).packs[0],
      };
      this.setState(() => {
        return {
          openPacks: null,
          openedCategory: id,
        };
      });
    } else {
      if (id === CollapsePackEnum.consumerPacks) {
        if (availableConsumerPacks.length) {
          selectedPack = { consumerPaymentPack: availableConsumerPacks[0] };
        }
      }
      if (id === CollapsePackEnum.paymentPacks) {
        if (unCategorizedPacks.length) {
          selectedPack = { paymentPack: unCategorizedPacks[0] };
        }
      }
      if (id === CollapsePackEnum.paymentCombo) {
        if (availableComboPacks.length) {
          selectedPack = { paymentPackCombo: availableComboPacks[0] };
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

    return (
      <div className={classes.container}>
        {!availableConsumerPacks.length &&
          !unCategorizedPacks.length &&
          !availableComboPacks.length && (
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
            title={t('booking:bookingModule.section.consumerPacks')}
            in={this.state.openPacks === CollapsePackEnum.consumerPacks}
            onSwitch={() =>
              this.openPacks(CollapsePackEnum.consumerPacks, false)
            }
          >
            {availableConsumerPacks
              .slice(0, numberOfConsumerPackToRender)
              .map((consumerPaymentPack) => {
                if (!consumerPaymentPack) {
                  return null;
                }
                return (
                  <div className={classes.item} key={consumerPaymentPack.id}>
                    <RadioItem
                      selected={
                        consumerPaymentPack.id ===
                        this.props.selectedPack?.consumerPaymentPack?.id
                      }
                      onClick={() =>
                        this.props.onPackChange({ consumerPaymentPack })
                      }
                      renderItem={() => (
                        <ConsumerPaymentPackBookableItem
                          consumerPaymentPack={consumerPaymentPack}
                        />
                      )}
                    />
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
        {!!contractList.length && (
          <div className={classes.marginTop}>
            <CollapsibleSection
              title={t('booking:bookingModule.section.contract')}
              in
            >
              {contractList.map((contract) => {
                if (!contract) {
                  return null;
                }
                return (
                  <div className={classes.item} key={contract.id}>
                    <ButtonBase
                      className={classes.item}
                      onClick={() => {
                        this.props.onOpenSubscriptionModal(contract);
                      }}
                    >
                      <div className={classes.row}>
                        <VisibilityIcon
                          color="primary"
                          className={classes.iconLeft}
                        />
                        <ContractBookableItem contract={contract} />
                      </div>
                    </ButtonBase>
                  </div>
                );
              })}
            </CollapsibleSection>
          </div>
        )}

        {unCategorizedPacks.length ? (
          <>
            <div className={classes.marginTop} />
            <CollapsibleSection
              title={t('booking:bookingModule.section.paymentPacks')}
              in={this.state.openPacks === CollapsePackEnum.paymentPacks}
              onSwitch={() =>
                this.openPacks(CollapsePackEnum.paymentPacks, false)
              }
            >
              {unCategorizedPacks
                .filter((e) => !e.category)
                .slice(0, numberOfPaymentPackToRender)
                .map((paymentPack) => {
                  if (!paymentPack) {
                    return null;
                  }
                  return (
                    <div className={classes.item} key={paymentPack.id}>
                      <RadioItem
                        selected={
                          paymentPack.id ===
                          this.props.selectedPack?.paymentPack?.id
                        }
                        onClick={() => this.props.onPackChange({ paymentPack })}
                        renderItem={() => (
                          <PaymentPackBookableItem paymentPack={paymentPack} />
                        )}
                      />
                    </div>
                  );
                })}
              {unCategorizedPacks.length > 3 && !this.state.paymentPackMore && (
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
        {this.props.paymentPackCategories.length
          ? this.props.paymentPackCategories.map((cat) => (
              <PaymentPackCategoryBookableItem
                paymentPackCategory={cat}
                selectedPack={this.props.selectedPack}
                onPackChange={this.props.onPackChange}
                opened={this.state.openedCategory === cat.id}
                openPacks={(id) => this.openPacks(id, true)}
              />
            ))
          : null}

        {!!availableComboPacks.length && (
          <>
            <div className={classes.marginTop} />
            <CollapsibleSection
              title={t('booking:bookingModule.section.paymentCombos')}
              in={this.state.openPacks === CollapsePackEnum.paymentCombo}
              onSwitch={() =>
                this.openPacks(CollapsePackEnum.paymentCombo, false)
              }
            >
              {availableComboPacks
                .slice(0, numberOfPaymentComboToRender)
                .map((paymentPackCombo) => {
                  if (!paymentPackCombo) {
                    return null;
                  }
                  return (
                    <div className={classes.item} key={paymentPackCombo.id}>
                      <RadioItem
                        selected={
                          paymentPackCombo.id ===
                          this.props.selectedPack?.paymentPackCombo?.id
                        }
                        onClick={() =>
                          this.props.onPackChange({ paymentPackCombo })
                        }
                        renderItem={() => (
                          <PaymentComboBookableItem
                            paymentCombo={paymentPackCombo}
                          />
                        )}
                      />
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
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking']),
)(BookingMethodSelector);
