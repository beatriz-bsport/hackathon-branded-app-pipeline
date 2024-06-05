import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import MaxoutInfoMessage from '#src/libs/booker-module/components/MaxoutInfoMessage.component';
import PaymentPackBookableItem from './PaymentPackBookableItem.component';
import { RadioItem } from '../../../components/radio/RadioItem';
import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
  MaxoutData,
} from '../../payment-packs/types';
import { MaterialStyleType } from '../../../utils/types';
import { SelectedPack } from '../types';
import CollapsibleSection from '../../../components/CollapsibleSection';

type OwnProps = {
  paymentPackCategory: PaymentPackCategoryWithPacks<PaymentPack & MaxoutData>;
  selectedPack?: SelectedPack;
  onPackChange: (selectedPack: SelectedPack) => void;
  opened: boolean;
  openPacks: (id: number) => void;
  isExcludingTax?: boolean;
  openModale: (msg: string) => void;
  hideCredits?: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PaymentPackCategoryBookableItem = (props: Props) => {
  const { classes, paymentPackCategory, t, hideCredits } = props;
  const [paymentPackMore, setPaymentPackMore] = useState(false);

  return (
    <CollapsibleSection
      in={props.opened}
      onSwitch={() => props.openPacks(paymentPackCategory.id)}
      title={paymentPackCategory ? `${paymentPackCategory.name}` : null}
    >
      {paymentPackCategory &&
      paymentPackCategory.packs &&
      paymentPackCategory.packs.length
        ? paymentPackCategory.packs
            .slice(0, paymentPackMore ? paymentPackCategory.packs.length : 3)
            .map((pack) => (
              <div key={pack.id} className={classes.relative}>
                <RadioItem
                  disabled={pack.exceedsBookingMaxout}
                  onClick={() => props.onPackChange({ paymentPack: pack })}
                  renderItem={() => (
                    <PaymentPackBookableItem
                      hideCredits={!!hideCredits}
                      isExcludingTax={props.isExcludingTax}
                      paymentPack={pack}
                    />
                  )}
                  selected={pack.id === props.selectedPack?.paymentPack?.id}
                />
                {pack.exceedsBookingMaxout && (
                  <div className={classes.maxoutMessageContainer}>
                    <MaxoutInfoMessage
                      maxoutInfo={pack.maxoutInfo}
                      openModale={props.openModale}
                    />
                  </div>
                )}
              </div>
            ))
        : null}
      {paymentPackCategory.packs.length > 3 && !paymentPackMore && (
        <ButtonBase
          className={classes.buttonBase}
          onClick={() => setPaymentPackMore(true)}
        >
          <Typography color="primary">{t('offer.showMore')}</Typography>
        </ButtonBase>
      )}
    </CollapsibleSection>
  );
};

const styles = (theme: Theme) => ({
  category: {
    marginTop: theme.spacing(2),
  },
  titleActions: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  collapse: {
    width: '100%',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(0.5),
  },
  buttonBase: {
    marginLeft: theme.spacing(1.5),
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
  },
});
export default compose<any, OwnProps>(
  withTranslation('booking'),
  // @ts-expect-error
  withStyles(styles),
)(PaymentPackCategoryBookableItem);
